'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname.startsWith(path) && (path !== '/dashboard' || pathname === '/dashboard');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-slate-50 border-r border-slate-100 p-4 shrink-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            medical_services
          </span>
        </div>
        <div>
          <h2 className="font-headline font-extrabold text-blue-700 leading-none">CareSync</h2>
          <p className="text-[10px] font-label font-medium tracking-widest text-on-surface-variant uppercase mt-1">
            Clinical Sanctuary
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm font-semibold transition-transform duration-300 hover:translate-x-1 ${
            isActive('/dashboard') ? 'bg-white text-blue-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label text-sm tracking-wide">Overview</span>
        </Link>
        <Link
          href="/appointments"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-300 hover:translate-x-1 ${
            isActive('/appointments') ? 'bg-white text-blue-600 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-label text-sm tracking-wide">Appointments</span>
        </Link>
        <Link
          href="/patients"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-300 hover:translate-x-1 ${
            isActive('/patients') ? 'bg-white text-blue-600 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined">folder_shared</span>
          <span className="font-label text-sm tracking-wide">Patients Directory</span>
        </Link>
        <Link
          href="/ai"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-transform duration-300 hover:translate-x-1 ${
            isActive('/ai') ? 'bg-white text-blue-600 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined" style={isActive('/ai') ? { fontVariationSettings: "'FILL' 1" } : {}}>smart_toy</span>
          <span className="font-label text-sm tracking-wide">AI Assistant</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 space-y-1">
        <button className="w-full mb-4 py-3 px-4 bg-primary text-white rounded-xl font-headline font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Encounter
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-error hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
