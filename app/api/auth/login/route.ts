import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { supabase } from '@/lib/supabase';

interface LoginRequestBody {
  emailOrUsername: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  userId?: string;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoginResponse>> {
  try {
    const body = (await request.json()) as LoginRequestBody;
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    const { data: user, error: dbError } = await supabase
      .from('login_page_1777749616131_users')
      .select('id, email, username, password_hash')
      .or(
        `email.eq.${emailOrUsername},username.eq.${emailOrUsername}`
      )
      .single();

    if (dbError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Connection error. Please try again.' },
      { status: 500 }
    );
  }
}