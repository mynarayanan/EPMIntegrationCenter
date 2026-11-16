'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Layers, ShieldCheck, Server, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        router.push('/dashboard');
        router.refresh();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setMessage(
            'Account created. Check your inbox to confirm your email, or sign in if email confirmation is disabled.'
          );
          setMode('signin');
        }
      }
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left Architecture Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border-r border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-white">
              Integration Centre
            </span>
            <p className="text-xs text-slate-400">Enterprise Data Control Plane</p>
          </div>
        </div>

        <div className="space-y-6 max-w-lg">
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            Unified orchestration for EPM, OLAP cubes, and cloud data warehouses.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Configure connections, manage dimension mappings, and govern batch extraction jobs across Oracle EPM, Anaplan, Snowflake, IBM TM1, Board, and SFTP sources.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-white">Multi-Tenant Governance & RLS</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Strict tenant isolation enforced at the PostgreSQL row level with role-based access control and immutable audit logs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <Server className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-white">Hybrid Execution Architecture</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Control plane hosted on Vercel; decoupled Python workers handle long-lived cloud and private-network extractions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Milestone 1 • Foundation, Tenant Isolation & Connector Catalogue
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 text-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-slate-900">Integration Centre</span>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {mode === 'signin' ? 'Sign in to Control Plane' : 'Provision Enterprise Workspace'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {mode === 'signin'
                ? 'Enter your credentials to access your tenant workspace.'
                : 'Create an account to automatically provision your tenant workspace as Admin.'}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@enterprise.com"
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 transition"
            >
              {loading
                ? 'Authenticating...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account & Workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setMessage(null);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {mode === 'signin'
                ? "Don't have an account? Provision a new workspace"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
