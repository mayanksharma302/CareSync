'use client';

import { useState, useEffect } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CALENDAR_DAYS = [
  { d: 26, prev: true }, { d: 27, prev: true }, { d: 28, prev: true }, { d: 29, prev: true },
  { d: 1 }, { d: 2, weekend: true }, { d: 3, weekend: true },
  { d: 4 }, { d: 5 }, { d: 6 }, { d: 7, event: { label: '09:30 - Dental Checkup', color: 'bg-primary text-on-primary' } }, { d: 8 }, { d: 9, weekend: true }, { d: 10, weekend: true },
  { d: 11 }, { d: 12, event: { label: '14:00 - AI Health Scan', color: 'bg-tertiary text-on-tertiary' } }, { d: 13 }, { d: 14 }, { d: 15 }, { d: 16, weekend: true }, { d: 17, weekend: true },
];

const TODAY = 12;

const STATUS_STYLES = {
  Confirmed: 'bg-tertiary-container text-on-tertiary-container',
  Pending: 'bg-error-container/30 text-error',
  Cancelled: 'bg-surface-container text-on-surface-variant',
};

const SPECIALTIES = ['General Cardiology', 'Dermatology & Skin', 'Dental Hygiene', 'Neurology Consultation', 'Pediatrics', 'Pulmonology', 'Orthopedics'];

export default function AppointmentsPage() {
  const [form, setForm] = useState({ specialty: SPECIALTIES[0], doctorId: '', patientId: '', reason: '', date: '', time: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch doctors
    fetch('/api/doctors').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setDoctors(data);
        if (data.length > 0) setForm(f => ({ ...f, doctorId: data[0]._id }));
      }
    }).catch(() => {});

    // Fetch patients
    fetch('/api/patients').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setPatients(data);
        if (data.length > 0) setForm(f => ({ ...f, patientId: data[0]._id }));
      }
    }).catch(() => {});

    // Fetch appointments
    fetch('/api/appointments').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAppointments(data);
    }).catch(() => {});
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time,
        type: form.specialty,
        notes: form.reason
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Refetch appointments
        const newAppts = await fetch('/api/appointments').then(r => r.json());
        setAppointments(Array.isArray(newAppts) ? newAppts : []);
        
        setSuccess(true);
        setForm(f => ({ ...f, reason: '', date: '', time: '' }));
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Main: Calendar + Appointment List */}
      <section className="flex-1 space-y-6 min-w-0">
        {/* Calendar */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">March 2024</h3>
              <p className="text-sm text-on-surface-variant">{appointments.length} Appointments scheduled this month</p>
            </div>
            <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
              <button className="px-4 py-1.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-lowest rounded-md transition-all">Week</button>
              <button className="px-4 py-1.5 text-sm font-semibold text-primary bg-surface-container-lowest rounded-md shadow-sm">Month</button>
            </div>
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-surface-container rounded-lg overflow-hidden border border-surface-container text-center">
            {DAYS.map((d) => (
              <div key={d} className={`bg-surface-container-low py-3 text-xs font-bold tracking-widest uppercase ${d === 'Sat' || d === 'Sun' ? 'text-error/60' : 'text-outline-variant'}`}>{d}</div>
            ))}
            {CALENDAR_DAYS.map((cell, i) => {
              // Dynamically inject appointments into the calendar tiles
              const cellAppts = appointments.filter(a => {
                if (!a.date || cell.prev) return false;
                const apptDay = parseInt(a.date.split('-')[2], 10);
                return apptDay === cell.d;
              });
              const event = cellAppts.length > 0 
                ? { label: `${cellAppts[0].time} - ${cellAppts[0].type}`, color: 'bg-primary text-on-primary' } 
                : cell.event; // fallback to dummy events if no dynamic ones on that day

              return (
              <div
                key={i}
                className={`h-20 p-1.5 text-left text-xs font-medium transition-colors relative
                  ${cell.prev ? 'bg-surface-container-lowest opacity-30' : 'bg-surface-container-lowest'}
                  ${cell.weekend && !cell.prev ? 'text-on-surface/40' : ''}
                  ${cell.d === TODAY ? 'ring-2 ring-inset ring-primary' : ''}
                  ${cell.event ? 'bg-primary-container/10 cursor-pointer hover:bg-primary-container/20' : ''}
                `}
              >
                <span className={cell.d === TODAY ? 'w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold' : ''}>
                  {cell.d}
                </span>
                {event && (
                  <div className={`mt-1 px-1 py-0.5 rounded text-[9px] leading-tight truncate font-bold ${event.color}`}>
                    {event.label}
                  </div>
                )}
                {cellAppts.length > 1 && (
                  <div className="mt-0.5 px-1 py-0.5 rounded text-[9px] font-bold text-center bg-surface-container-high text-on-surface">
                    +{cellAppts.length - 1} more
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-surface-container flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg text-on-surface">All Appointments</h3>
            <span className="text-xs font-bold text-on-surface-variant">{appointments.length} total</span>
          </div>
          <div className="divide-y divide-surface-container">
            {appointments.length === 0 && (
              <div className="p-8 text-center text-sm text-on-surface-variant">No appointments strictly matched from the database yet. Create one!</div>
            )}
            {appointments.map((appt) => (
              <div key={appt._id} className="p-5 flex items-start gap-4 hover:bg-surface-container-low/30 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${STATUS_STYLES[appt.status]?.includes('tertiary') ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                  <span className="material-symbols-outlined">event_available</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-headline font-bold text-on-surface">{appt.type}</p>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        {appt.patientId?.firstName} {appt.patientId?.lastName} • Dr. {appt.doctorId?.name}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${STATUS_STYLES[appt.status] || STATUS_STYLES.Pending}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-outline">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">event</span>{appt.date}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{appt.time}</span>
                    {appt.room !== '—' && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">door_open</span>Room {appt.room || 'TBD'}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Sidebar */}
      <aside className="w-full lg:w-96 bg-surface-container-low rounded-3xl p-7 sticky top-4 h-fit shadow-sm">
        <div className="mb-7">
          <h3 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">New Appointment</h3>
          <p className="text-sm text-on-surface-variant mt-1">Schedule a session with a specialist.</p>
        </div>

        {success && (
          <div className="mb-5 p-3 bg-tertiary-container text-on-tertiary-container rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Appointment booked successfully!
          </div>
        )}

        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Select Patient</label>
            <div className="relative">
              <select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                className="w-full bg-surface-container-lowest rounded-xl py-3 px-4 text-sm appearance-none focus:ring-2 focus:ring-primary outline-none border-0">
                {patients.length === 0 && <option value="">Loading patients...</option>}
                {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">keyboard_arrow_down</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Select Specialty</label>
            <div className="relative">
              <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="w-full bg-surface-container-lowest rounded-xl py-3 px-4 text-sm appearance-none focus:ring-2 focus:ring-primary outline-none border-0">
                {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">keyboard_arrow_down</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Choose Doctor</label>
            <div className="space-y-2">
              {doctors.length === 0 ? (
                <div className="text-xs text-on-surface-variant p-2">Loading doctors...</div>
              ) : doctors.map(doc => (
                <label key={doc._id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ring-1 ${form.doctorId === doc._id ? 'bg-white ring-primary/40 shadow-sm' : 'bg-surface-container-lowest ring-transparent hover:ring-surface-container-high'}`}>
                  <input type="radio" name="doctor" checked={form.doctorId === doc._id} onChange={() => setForm({ ...form, doctorId: doc._id })} className="text-primary focus:ring-primary h-4 w-4 border-outline-variant" />
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary text-xs font-bold">
                    {doc.name.split(' ').slice(-1)[0]?.[0] || 'D'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">Dr. {doc.name}</p>
                    <p className="text-[10px] text-outline">Available Soon</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Date</label>
              <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Time</label>
              <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Reason for Visit</label>
            <textarea rows={3} placeholder="Briefly describe symptoms or reason..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full bg-surface-container-lowest rounded-xl p-4 text-sm border-0 focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-4 signature-gradient text-on-primary rounded-xl font-headline font-extrabold text-base shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Finalize Booking'}
          </button>
        </form>
      </aside>
    </div>
  );
}
