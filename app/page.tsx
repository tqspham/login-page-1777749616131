'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleLoginSuccess = (): void => {
    router.push('/dashboard');
  };

  const handleLoginError = (errorMessage: string): void => {
    setError(errorMessage);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Log In
        </h1>
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
        />
      </div>
    </main>
  );
}