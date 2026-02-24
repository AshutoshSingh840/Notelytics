import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService.js';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('alex@timetoprogram.com');
  const [password, setPassword] = useState('Test@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.loginUser({ email, password });
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (!token || !user) {
        throw new Error('Invalid login response from server.');
      }

      login(user, token);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.details?.error || err?.message || 'Failed to login. Please check your credentials.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 px-6 pb-8 pt-8 shadow-[0_16px_44px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-300 sm:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-[0_10px_22px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-105">
              <BrainCircuit className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Welcome back</h1>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">Email</label>
              <div className="relative">
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 ${
                    focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">Password</label>
              <div className="relative">
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 ${
                    focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="........"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-base font-medium text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-500 text-base font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_12px_24px_rgba(16,185,129,0.35)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-7 border-t border-slate-200 pt-6 text-center">
            <p className="text-base text-slate-700 sm:text-lg">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-7 text-center text-xs text-slate-400 sm:text-sm">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
