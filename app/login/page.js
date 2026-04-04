'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-surface-container-low flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0px_20px_50px_rgba(42,52,57,0.08)] overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="mb-10">
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant">Sign in to your clinical dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface placeholder:text-outline-variant border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="dr.smith@caresync.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Password
                </label>
                <a className="text-primary text-xs font-semibold hover:underline" href="#">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface placeholder:text-outline-variant border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-3 py-2">
              <input
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                id="remember"
                type="checkbox"
              />
              <label className="text-sm text-on-surface-variant font-medium" htmlFor="remember">
                Remember this device
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full signature-gradient text-on-primary font-bold py-4 rounded-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
          <div className="mt-10 pt-8 border-t border-surface-container-high text-center">
            <p className="text-on-surface-variant text-sm">
              New to CareSync?
              <Link href="/register" className="text-primary font-bold hover:underline ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
