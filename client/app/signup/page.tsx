'use client';

import React, { useState } from 'react';
import { useAuth } from '../providers';
import Link from 'next/link';
import { Rocket, AlertCircle, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; api?: string }>({});

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, login } = useAuth();

  // Validate form fields
  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (err: any) {
      setErrors({ api: err.message || 'Registration failed. Please check your data and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Demo Sandbox Registration: Auto-fills registration credentials and automatically registers/logs in
  const handleDemoSignup = async () => {
    setErrors({});
    setLoading(true);

    // Create a unique email to ensure registration doesn't fail due to "Email already exists"
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const mockEmail = `sandbox.founder.${randomSuffix}@launchpilot.app`;
    const mockPassword = 'password123';
    
    // Auto-populate values on UI
    setName('Sandbox Founder');
    setEmail(mockEmail);
    setPassword(mockPassword);

    try {
      await signup('Sandbox Founder', mockEmail, mockPassword);
    } catch (err: any) {
      setErrors({ api: err.message || 'Demo Sandbox registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  // Google Login/Signup: Simulated OAuth flow
  const handleGoogleLogin = async () => {
    setErrors({});
    setGoogleLoading(true);
    try {
      // Attempt login first if account exists
      await login('google.user@gmail.com', 'google-pass-12345');
    } catch (err: any) {
      try {
        // Fallback signup if the account doesn't exist
        await signup('Google User', 'google.user@gmail.com', 'google-pass-12345');
      } catch (signupErr: any) {
        setErrors({ api: signupErr.message || 'Google Auth simulation failed.' });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 backdrop-blur-xl bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800/80 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Create your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-black">
              LaunchPilot
            </span>{' '}
            account
          </h2>
          <p className="text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>

        {/* API Error Alert */}
        {errors.api && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.api}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            {/* Full Name field */}
            <div className="space-y-1">
              <label htmlFor="full-name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`appearance-none relative block w-full px-3 py-2.5 border ${
                  errors.name ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl placeholder-zinc-500 text-white bg-zinc-950/80 focus:outline-none focus:ring-1 ${
                  errors.name ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                } sm:text-xs transition-all`}
                placeholder="Alex Johnson"
              />
              {errors.name && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label htmlFor="email-address" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`appearance-none relative block w-full px-3 py-2.5 border ${
                  errors.email ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl placeholder-zinc-500 text-white bg-zinc-950/80 focus:outline-none focus:ring-1 ${
                  errors.email ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                } sm:text-xs transition-all`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`appearance-none relative block w-full px-3 py-2.5 border ${
                  errors.password ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl placeholder-zinc-500 text-white bg-zinc-950/80 focus:outline-none focus:ring-1 ${
                  errors.password ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                } sm:text-xs transition-all`}
                placeholder="Min 6 characters"
              />
              {errors.password && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 cursor-pointer shadow-lg disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-zinc-800/80" />
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Or Continue With</span>
          <div className="flex-grow border-t border-zinc-800/80" />
        </div>

        <div className="space-y-2.5">
          {/* Google Sign-in */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-zinc-850 hover:border-zinc-750 text-xs font-semibold rounded-xl text-zinc-200 bg-zinc-950 hover:bg-zinc-900 transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-zinc-500/30 border-t-zinc-300 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Quick Demo Sandbox Registration */}
          <button
            onClick={handleDemoSignup}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-indigo-500/20 hover:border-indigo-500/40 text-xs font-semibold rounded-xl text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 mr-0.5 animate-pulse" />
            <span>Fast Entry (Developer Sandbox)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
