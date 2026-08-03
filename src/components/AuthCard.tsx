import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useSignupMutation, useLoginMutation } from '../app/api/auth';

export default function AuthCard() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // 2. Initialize the hook

  const [signup, { isLoading: isSigningUp, error: signupError }] = useSignupMutation();
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();

  const isLoading = isSigningUp || isLoggingIn;
  const currentError = mode === 'signup' ? signupError : loginError;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'signup') {
        // 3. Chain unwrap() and navigate on resolution
        await signup({ fullName, email, password }).unwrap();
      } else {
        await login({ email, password }).unwrap();
      }

      // 4. Redirect with replace: true to prevent back-button returning to auth
      navigate('/home/dashboard', { replace: true });
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  const getErrorMessage = (err: unknown) => {
    if (!err) return null;
    if (typeof err === 'object' && err !== null && 'data' in err) {
      const apiErr = err as { data?: { message?: string } };
      return apiErr.data?.message || 'An error occurred during authentication.';
    }
    return 'Network error or server unreachable.';
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#12141a] p-6 text-left shadow-2xl">
      <div className="flex rounded-xl bg-[#1b1e26] p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === 'signin'
              ? 'bg-[#0f1115] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === 'signup'
              ? 'bg-[#0f1115] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Create account
        </button>
      </div>

      {currentError && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
          {getErrorMessage(currentError)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-zinc-200"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required={mode === 'signup'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/60 bg-[#1b1e26]/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-zinc-200"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700/60 bg-[#1b1e26]/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-zinc-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={mode === 'signup' ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700/60 bg-[#1b1e26]/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {mode === 'signup' && (
            <p className="pt-0.5 text-xs text-zinc-400">At least 8 characters</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#12141a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Processing...'
            : mode === 'signin'
            ? 'Sign in'
            : 'Create account'}
        </button>
      </form>
    </div>
  );
}