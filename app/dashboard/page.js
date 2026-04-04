'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const QUEUE = [
  { time: '09:00', period: 'AM', name: 'Marcus Richardson', reason: 'Annual Physical', active: true },
  { time: '10:30', period: 'AM', name: 'Sarah Parker', reason: 'Lab Result Review', active: false },
  { time: '11:15', period: 'AM', name: 'David Thompson', reason: 'Consultation', active: false },
];

const statusStyle = {
  Stable: 'bg-tertiary-container text-on-tertiary-container',
  Urgent: 'bg-red-100 text-red-700',
  'Follow-up': 'bg-secondary-container text-on-secondary-container',
};

const AVATAR_COLORS = [
  'bg-secondary-container text-on-secondary-container',
  'bg-blue-100 text-blue-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
];

function getColor(id) {
  const idx = id ? parseInt(id.toString().slice(-2), 16) % AVATAR_COLORS.length : 0;
  return AVATAR_COLORS[idx];
}

function getInitials(first = '', last = '') {
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || '?';
}

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ patients: 0, appointments: 0, pending: 0 });
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    // Fetch real patients from DB
    fetch('/api/patients')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data.slice(0, 5));
      })
      .catch(() => {});

    // Fetch dynamic stats from DB
    fetch('/api/stats')
      .then((r) => r.json())
      .then((targets) => {
        // Animate counters
        const duration = 1000;
        const steps = 40;
        let step = 0;
        const interval = setInterval(() => {
          step++;
          const progress = step / steps;
          setStats({
            patients: Math.round((targets.patients || 0) * progress),
            appointments: Math.round((targets.appointments || 0) * progress),
            pending: Math.round((targets.pending || 0) * progress),
          });
          if (step >= steps) clearInterval(interval);
        }, duration / steps);
      })
      .catch((err) => console.error('Stats error:', err));
  }, []);

  const fetchAiInsight = async () => {
    setAiLoading(true);
    setAiText('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Give me a brief 2-sentence clinical summary insight for today. Mention patient load and a recommendation.',
        }),
      });
      const data = await res.json();
      setAiText(data.text || 'No insight available.');
    } catch {
      setAiText('Could not load AI insight. Check API key configuration.');
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-label font-bold text-on-surface-variant tracking-widest uppercase">Total Patients</p>
            <span className="material-symbols-outlined text-primary bg-primary-container/40 p-2 rounded-lg text-xl">group</span>
          </div>
          <div className="mt-4">
            <span className="font-headline text-3xl font-bold tracking-tight text-on-surface">{stats.patients.toLocaleString()}</span>
            <p className="text-xs text-primary mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12% from last month
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-tertiary shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-label font-bold text-on-surface-variant tracking-widest uppercase">Today's Appointments</p>
            <span className="material-symbols-outlined text-tertiary bg-tertiary-container/40 p-2 rounded-lg text-xl">event_available</span>
          </div>
          <div className="mt-4">
            <span className="font-headline text-3xl font-bold tracking-tight text-on-surface">{stats.appointments}</span>
            <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm">schedule</span> 4 remaining today
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-error shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-label font-bold text-on-surface-variant tracking-widest uppercase">Pending Reports</p>
            <span className="material-symbols-outlined text-error bg-error-container/30 p-2 rounded-lg text-xl">assignment_late</span>
          </div>
          <div className="mt-4">
            <span className="font-headline text-3xl font-bold tracking-tight text-on-surface">{stats.pending}</span>
            <p className="text-xs text-error mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span> 3 high priority
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Patient Directory */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-container">
            <div>
              <h3 className="text-xl font-headline font-bold text-on-surface">Patient Directory</h3>
              <p className="text-sm text-on-surface-variant">Manage and view your patient clinical records</p>
            </div>
            <Link
              href="/patients"
              className="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              View All Patients
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant">
                <tr>
                  <th className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold">Patient Name</th>
                  <th className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold">Age / Sex</th>
                  <th className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold">Last Visit</th>
                  <th className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold">Status</th>
                  <th className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {patients.length > 0 ? patients.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getColor(p._id)}`}>
                          {getInitials(p.firstName, p.lastName)}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{p.firstName} {p.lastName}</p>
                          <p className="text-xs text-on-surface-variant">ID: #{p._id.toString().slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">{p.age} / {p.sex}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusStyle[p.status] || 'bg-surface-container text-on-surface-variant'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-on-surface-variant">No patients found. Add your first patient in the Patients Directory.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Appointment Queue */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-lg text-on-surface">Upcoming Queue</h3>
              <span className="px-2 py-1 bg-primary-container text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">TODAY</span>
            </div>
            <div className="space-y-3">
              {QUEUE.map((q, i) => (
                <div key={i} className={`bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-transform ${q.active ? 'border-l-2 border-primary' : ''}`}>
                  <div className="text-center min-w-[50px]">
                    <p className={`text-xs font-bold ${q.active ? 'text-primary' : 'text-on-surface'}`}>{q.time}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-medium">{q.period}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface leading-tight">{q.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{q.reason}</p>
                  </div>
                  <span className="material-symbols-outlined text-xl" style={q.active ? { color: 'var(--color-primary-dim)', fontVariationSettings: "'FILL' 1" } : { color: 'var(--color-outline-variant)' }}>
                    {q.active ? 'play_circle' : 'pending'}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/appointments">
              <button className="w-full mt-6 py-2 border-2 border-outline-variant/20 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-lowest transition-colors">
                Full Schedule View
              </button>
            </Link>
          </div>

          {/* AI Insights Card */}
          <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <h4 className="font-headline font-bold text-lg mb-2 relative z-10">Clinical Assistant</h4>
            {aiText ? (
              <p className="text-sm opacity-90 mb-4 z-10 relative leading-relaxed">{aiText}</p>
            ) : (
              <p className="text-sm opacity-90 mb-4 z-10 relative">
                AI-powered insights for your active patient roster. Click below to generate.
              </p>
            )}
            <button
              onClick={fetchAiInsight}
              disabled={aiLoading}
              className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/30 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {aiLoading ? (
                <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
              ) : (
                <><span className="material-symbols-outlined text-sm">bolt</span>Generate Insight</>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
