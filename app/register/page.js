'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'doctor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-surface flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-5xl flex bg-surface-container-lowest rounded-xl shadow-[0px_40px_80px_rgba(42,52,57,0.1)] overflow-hidden">
        {/* Left Side: Visual Content */}
        <div className="hidden lg:block w-1/2 relative">
          <img
            alt="medical clinic"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5KG9JLzqY7kFoLR5RnEcdyAyeXa-l5us9nAMBFxfy12d48-YJ4z8aGYuxldi2edivhPei16G74oDGaoWvXyHwcozDweB_DyX7IuQskMmTKWtcGKAw8rSInwEDfgJoZbluXUAZbozGeH9_OucyingLXhMsY1QZHc1m5cCAguHdN89ZdIg4iafftosr3ggdwUk6HRDlqVVoItqo6fLsLl9GCYkbkGRumhSp25fErCqvvy5wYe2BMesc2xKNwJnQDFC6WppVu-43IinE"
          />
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
          <div className="absolute bottom-12 left-12 right-12">
            <div className="p-8 bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl">
              <p className="text-primary font-headline text-lg font-bold mb-2">Trusted by 10,000+ Providers</p>
              <p className="text-on-surface text-sm leading-relaxed">
                Join the most advanced ecosystem for patient care and clinical management.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16">
          <div className="mb-10">
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">Create Account</h2>
            <p className="text-on-surface-variant">Start your journey with CareSync today</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
             <div>
              <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                I am a
              </label>
              <select
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="doctor">Provider / Doctor</option>
                <option value="patient">Patient</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Professional Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="j.doe@medicalcenter.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
           
            <div className="text-xs text-on-surface-variant leading-relaxed py-2">
              By clicking register, you agree to our{' '}
              <a className="text-primary underline" href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="text-primary underline" href="#">
                Privacy Policy
              </a>
              .
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full signature-gradient text-on-primary font-bold py-4 rounded-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Complete Registration'
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account?
              <Link href="/login" className="text-primary font-bold hover:underline ml-1">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
