'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
}

export default function LoginForm({
  onLoginSuccess,
  onLoginError,
}: LoginFormProps): JSX.Element {
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ emailOrUsername?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: { emailOrUsername?: string; password?: string } = {};

    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername,
          password,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        error?: string;
        userId?: string;
      };

      if (!response.ok || !data.success) {
        const errorMessage = data.error || 'Invalid email or password';
        setServerError(errorMessage);
        onLoginError(errorMessage);
        return;
      }

      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      onLoginSuccess();
    } catch (error) {
      const errorMessage = 'Connection error. Please try again.';
      setServerError(errorMessage);
      onLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      const form = e.currentTarget.form;
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="emailOrUsername"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email or Username
        </label>
        <input
          id="emailOrUsername"
          type="text"
          aria-label="Email or Username"
          value={emailOrUsername}
          onChange={(e) => {
            setEmailOrUsername(e.target.value);
            if (errors.emailOrUsername) {
              setErrors({ ...errors, emailOrUsername: undefined });
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          disabled={isLoading}
        />
        {errors.emailOrUsername && (
          <p className="mt-1 text-sm text-red-600">{errors.emailOrUsername}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          aria-label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors({ ...errors, password: undefined });
            }
          }}
          onKeyDown={handlePasswordKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Logging in...</span>
          </>
        ) : (
          'Log In'
        )}
      </button>
    </form>
  );
}