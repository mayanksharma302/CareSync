'use client';

import { usePathname } from 'next/navigation';

export default function Navbar({ userName }) {
  const pathname = usePathname();
  let title = 'Dashboard';
  if (pathname.includes('/patients')) title = 'Patients';
  if (pathname.includes('/appointments')) title = 'Appointments';

  return (
    <header className="z-30 bg-white/60 backdrop-blur-xl sticky top-0 w-full shadow-sm border-b border-surface-container-high">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-8">
          <h1 className="font-headline tracking-tighter text-slate-900 text-xl font-bold">{title}</h1>
          <div className="hidden lg:flex items-center gap-6">
            <span className="text-blue-600 font-bold border-b-2 border-blue-600 tracking-tight cursor-pointer">Live Session</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-surface-tint w-64 outline-none" placeholder="Search records..." type="text" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-surface-container rounded-full transition-all flex items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center ml-2 border-l border-surface-container-high pl-4">
              <div className="mr-3 text-right hidden md:block">
                <p className="text-sm font-bold text-on-surface">{userName || 'Dr. Smith'}</p>
                <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Provider</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary-container flex items-center justify-center font-bold text-primary">
                 {userName?.charAt(0) || 'D'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
