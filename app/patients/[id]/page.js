'use client';

import { useState } from 'react';
import Link from 'next/link';

// Static patient for demo — in production pull from /api/patients/:id
const PATIENT = {
  id: 'CS-882-901',
  name: 'Alexander Thompson',
  suffix: 'Ph.D.',
  joined: 'May 2021',
  bloodType: 'A-Positive',
  age: 64,
  sex: 'Male',
  height: '182 cm',
  weight: '78.4 kg',
  email: 'a.thompson@university.edu',
  phone: '+1 (555) 902-1244',
  address: '442 Silver Creek Rd, Seattle, WA',
  allergies: ['Penicillin', 'Peanuts'],
  condition: 'Cardiovascular',
  status: 'Stable',
  initials: 'AT',
  timeline: [
    {
      date: 'October 14, 2023',
      type: 'Routine Checkup',
      title: 'Cardiovascular Assessment',
      body: 'Patient reported slight fatigue during morning exercises. BP recorded at 128/84. ECG results within normal range. Recommended 2-week sodium restriction.',
      doctor: 'Dr. Emily Chen',
      dept: 'Cardiology Unit',
      borderColor: 'border-primary',
      dotColor: 'bg-primary',
      badge: 'bg-secondary-container text-on-secondary-container',
    },
    {
      date: 'August 22, 2023',
      type: 'Laboratory',
      title: 'Full Blood Panel',
      body: 'Comprehensive metabolic panel completed. Cholesterol levels show positive improvement from previous quarter. Vitamin D deficiency noted.',
      doctor: 'Dr. Michael Ross',
      dept: 'Laboratory Services',
      borderColor: 'border-surface-container-highest',
      dotColor: 'bg-surface-container-highest',
      badge: 'bg-tertiary-container/50 text-tertiary-dim',
    },
    {
      date: 'June 05, 2023',
      type: 'Urgent Care',
      title: 'Acute Bronchitis Episode',
      body: 'Presented with persistent cough and low-grade fever. Prescribed non-penicillin alternative (Azithromycin) due to allergy.',
      doctor: 'Dr. Sarah Jenkins',
      dept: 'Emergency Medicine',
      borderColor: 'border-error-container',
      dotColor: 'bg-error-container',
      badge: 'bg-error-container/20 text-error',
    },
  ],
  documents: [
    { name: 'MRI_Brain_Scan_01.pdf', date: 'Oct 12, 2023', size: '4.2 MB', icon: 'picture_as_pdf', iconBg: 'bg-red-50 text-red-500' },
    { name: 'Lab_Results_Panel.pdf', date: 'Aug 22, 2023', size: '1.1 MB', icon: 'description', iconBg: 'bg-blue-50 text-blue-500' },
    { name: 'Pulmonary_Function.pdf', date: 'Jun 10, 2023', size: '2.8 MB', icon: 'picture_as_pdf', iconBg: 'bg-red-50 text-red-500' },
    { name: 'Insurance_Form_C12.pdf', date: 'May 15, 2023', size: '0.5 MB', icon: 'clinical_notes', iconBg: 'bg-blue-50 text-blue-500' },
  ],
};

export default function PatientProfilePage() {
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const fetchAiInsight = async () => {
    setAiLoading(true);
    setAiInsight('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate a short 2-3 sentence clinical AI insight for patient ${PATIENT.name}, age ${PATIENT.age}, with ${PATIENT.condition} history. Include recovery trajectory and next recommended action.`,
        }),
      });
      const data = await res.json();
      setAiInsight(data.text || 'Unable to generate insight.');
    } catch {
      setAiInsight('Error connecting to AI. Check GEMINI_API_KEY.');
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Back nav */}
      <Link href="/patients" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary font-semibold transition-colors">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Patients
      </Link>

      {/* Profile Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personal Info Card */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row gap-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-xl"></div>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl shadow-lg border-4 border-surface bg-primary-container flex items-center justify-center font-headline font-extrabold text-4xl text-primary">
              {PATIENT.initials}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-container-lowest">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            <div>
              <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tighter">{PATIENT.name}, {PATIENT.suffix}</h2>
              <p className="text-on-surface-variant font-body">Patient ID: #{PATIENT.id} • Joined {PATIENT.joined}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: 'Blood Type', value: PATIENT.bloodType, color: 'text-primary' },
                { label: 'Age / Sex', value: `${PATIENT.age} / ${PATIENT.sex}` },
                { label: 'Height', value: PATIENT.height },
                { label: 'Weight', value: PATIENT.weight },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <span className="text-[10px] font-label font-bold text-outline-variant uppercase tracking-widest">{item.label}</span>
                  <p className={`text-lg font-headline font-bold ${item.color || 'text-on-surface'}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {PATIENT.allergies.map((a) => (
                <span key={a} className="bg-error-container/20 text-error px-3 py-1 rounded-full text-xs font-bold border border-error-container/30 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">warning</span> ALLERGY: {a}
                </span>
              ))}
              <span className="bg-tertiary-container/30 text-tertiary-dim px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span> {PATIENT.status} Condition
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-6 space-y-5">
          <div>
            <h4 className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest mb-4">Contact Details</h4>
            <div className="space-y-3">
              {[
                { icon: 'mail', text: PATIENT.email },
                { icon: 'call', text: PATIENT.phone },
                { icon: 'location_on', text: PATIENT.address },
              ].map((c) => (
                <div key={c.icon} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-xl">{c.icon}</span>
                  <span className="truncate">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Link href="/appointments">
              <button className="w-full py-3 px-4 signature-gradient text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity active:scale-95">
                <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                Schedule Appointment
              </button>
            </Link>
            <Link href="/ai">
              <button className="w-full py-3 px-4 mt-2 bg-surface-container-lowest text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                AI Consultation
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clinical Timeline */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Clinical Timeline</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View Full History <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-highest">
            {PATIENT.timeline.map((item, i) => (
              <div key={i} className="relative">
                <span className={`absolute -left-[30px] top-1.5 w-5 h-5 rounded-full ${item.dotColor} border-4 border-surface-container-lowest shadow-sm z-10`}></span>
                <div className={`bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 ${item.borderColor}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-label font-bold text-outline-variant uppercase tracking-widest">{item.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.badge}`}>{item.type}</span>
                  </div>
                  <h4 className="text-lg font-headline font-bold text-on-surface">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{item.body}</p>
                  <div className="mt-4 flex flex-col">
                    <span className="text-[10px] font-label font-bold text-outline-variant uppercase">{item.doctor}</span>
                    <span className="text-xs font-body font-medium text-on-surface-variant">{item.dept}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents + AI Sidebar */}
        <div className="space-y-6">
          {/* Clinical Documents */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-headline font-bold text-on-surface">Clinical Documents</h3>
              <button className="bg-primary-container text-on-primary-container p-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-xl">upload_file</span>
              </button>
            </div>
            <div className="space-y-3">
              {PATIENT.documents.map((doc) => (
                <div key={doc.name} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.iconBg}`}>
                      <span className="material-symbols-outlined text-2xl">{doc.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-on-surface text-sm truncate">{doc.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase">{doc.date} • {doc.size}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">download</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
            <h4 className="font-headline font-bold text-primary flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              Health AI Insight
            </h4>
            {aiInsight ? (
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{aiInsight}</p>
            ) : (
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Click below to generate an AI-powered clinical insight for this patient based on their history.
              </p>
            )}
            <button
              onClick={fetchAiInsight}
              disabled={aiLoading}
              className="signature-gradient text-on-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {aiLoading ? (
                <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
              ) : (
                <><span className="material-symbols-outlined text-sm">auto_awesome</span>Generate Insight</>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
