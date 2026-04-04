'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const STATUS_STYLES = {
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
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-800',
];

function getInitials(firstName = '', lastName = '') {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?';
}

function getColor(id) {
  const idx = id ? parseInt(id.toString().slice(-2), 16) % AVATAR_COLORS.length : 0;
  return AVATAR_COLORS[idx];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newPatient, setNewPatient] = useState({
    firstName: '', lastName: '', age: '', sex: 'Male',
    diagnosis: '', phone: '', bloodGroup: '', status: 'Stable',
  });

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setError('Could not load patients. Check your database connection.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const filtered = patients.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || (p.diagnosis || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create patient');
      }
      const created = await res.json();
      setPatients((prev) => [created, ...prev]);
      setShowModal(false);
      setNewPatient({ firstName: '', lastName: '', age: '', sex: 'Male', diagnosis: '', phone: '', bloodGroup: '', status: 'Stable' });
      setSuccessMsg('Patient added successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Patient Directory</h2>
          <p className="text-sm text-on-surface-variant">
            {loading ? 'Loading...' : `${patients.length} patient${patients.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="signature-gradient text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add New Patient
        </button>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-xl text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>{successMsg}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="p-3 bg-error-container/30 text-error rounded-xl text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>{error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
          <input
            type="text"
            placeholder="Search by name or diagnosis..."
            className="w-full bg-surface-container-lowest rounded-xl pl-10 pr-4 py-2.5 text-sm border border-surface-container-high focus:ring-2 focus:ring-primary outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['All', 'Stable', 'Urgent', 'Follow-up'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'}`}
          >
            {s}
          </button>
        ))}
        <button onClick={fetchPatients} className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface-variant hover:text-primary transition-colors" title="Refresh">
          <span className="material-symbols-outlined text-xl">refresh</span>
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  <div className="h-3 bg-surface-container-high rounded w-2/3" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container h-3 bg-surface-container-high rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Patient Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div
              key={p._id}
              onClick={() => setSelectedPatient(p)}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${getColor(p._id)}`}>
                  {getInitials(p.firstName, p.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-headline font-bold text-on-surface truncate">{p.firstName} {p.lastName}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${STATUS_STYLES[p.status] || 'bg-surface-container text-on-surface-variant'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{p.age} yrs / {p.sex}</p>
                  {p.diagnosis && <p className="text-xs text-on-surface-variant mt-0.5 truncate">{p.diagnosis}</p>}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary font-semibold group-hover:underline">
                  View Profile
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 block">person_search</span>
          <p className="font-headline font-bold text-lg">
            {patients.length === 0 ? 'No patients yet' : 'No patients found'}
          </p>
          <p className="text-sm mt-1">
            {patients.length === 0 ? 'Add your first patient using the button above' : 'Try adjusting your search or filters'}
          </p>
        </div>
      )}

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-container sticky top-0 bg-surface-container-lowest">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-headline font-bold text-on-surface">Add New Patient</h3>
                <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">First Name *</label>
                  <input required type="text" placeholder="John" value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Last Name *</label>
                  <input required type="text" placeholder="Doe" value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Age *</label>
                  <input required type="number" min="0" max="120" placeholder="45" value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Sex</label>
                  <select value={newPatient.sex} onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Status</label>
                  <select value={newPatient.status} onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none">
                    <option>Stable</option><option>Urgent</option><option>Follow-up</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Blood Group</label>
                  <select value={newPatient.bloodGroup} onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Unknown</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Phone</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-1.5">Primary Diagnosis</label>
                <input type="text" placeholder="e.g. Hypertension, Type 2 Diabetes" value={newPatient.diagnosis}
                  onChange={(e) => setNewPatient({ ...newPatient, diagnosis: e.target.value })}
                  className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-sm border-0 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-surface-container-high text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 signature-gradient text-on-primary rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting
                    ? <><div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                    : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Profile Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${getColor(selectedPatient._id)}`}>
                    {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-on-surface">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                    <p className="text-sm text-on-surface-variant">{selectedPatient.age} yrs • {selectedPatient.sex}</p>
                    <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[selectedPatient.status] || ''}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { icon: 'medical_information', label: 'Diagnosis', value: selectedPatient.diagnosis || '—' },
                  { icon: 'bloodtype', label: 'Blood Group', value: selectedPatient.bloodGroup || 'Unknown' },
                  { icon: 'call', label: 'Phone', value: selectedPatient.phone || '—' },
                  { icon: 'calendar_today', label: 'Registered', value: new Date(selectedPatient.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                ].map((item) => (
                  <div key={item.icon} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                    <div>
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">{item.label}</p>
                      <p className="font-semibold text-on-surface">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <Link href="/appointments" className="flex-1 py-3 signature-gradient text-on-primary rounded-xl text-sm font-bold text-center hover:opacity-90 transition-opacity">
                  Schedule Appointment
                </Link>
                <button onClick={() => setSelectedPatient(null)} className="flex-1 py-3 border border-surface-container-high rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
