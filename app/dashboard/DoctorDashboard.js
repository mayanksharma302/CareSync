'use client';
import { useState, useEffect } from 'react';
import { Users, Calendar, Activity, Loader2 } from 'lucide-react';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingPatient, setAnalyzingPatient] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsRes, apptRes] = await Promise.all([
          fetch('/api/patients').then(res => res.json()),
          fetch('/api/appointments').then(res => res.json())
        ]);
        if (patientsRes.success) setPatients(patientsRes.data);
        if (apptRes.success) setAppointments(apptRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const analyzePatient = async (patient) => {
    setAnalyzingPatient(patient._id);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patient })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('AI Analysis failed');
    } finally {
      setAnalyzingPatient(null);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users size={24} /></div>
            <h3 className="text-2xl font-bold text-slate-800">{patients.length}</h3>
          </div>
          <p className="text-slate-500 font-medium">Total Patients</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Calendar size={24} /></div>
            <h3 className="text-2xl font-bold text-slate-800">{appointments.length}</h3>
          </div>
          <p className="text-slate-500 font-medium">Upcoming Appointments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Users className="text-indigo-500" size={20} /> Your Patients</h2>
          <div className="space-y-4">
            {patients.length === 0 ? <p className="text-slate-500 text-sm">No patients currently assigned to you.</p> : null}
            {patients.map(p => (
              <div key={p._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center hover:bg-white hover:border-indigo-100 transition-colors shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-800">{p.userId?.name || 'Unknown Patient'}</h4>
                  <p className="text-sm text-slate-500 mt-1">Age: {p.age} • Blood Group: {p.bloodGroup}</p>
                </div>
                <button 
                  onClick={() => analyzePatient(p)}
                  disabled={analyzingPatient === p._id}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 text-indigo-700 flex-shrink-0 rounded-xl text-sm font-bold hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {analyzingPatient === p._id ? <Loader2 className="animate-spin" size={16} /> : <Activity size={16} />}
                  AI Summary
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Calendar className="text-indigo-500" size={20} /> Appointments</h2>
          <div className="space-y-4">
             {appointments.length === 0 ? <p className="text-slate-500 text-sm">No scheduled appointments.</p> : null}
             {appointments.map(a => (
               <div key={a._id} className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center shadow-sm">
                 <div>
                   <h4 className="font-bold text-slate-800">{a.patientId?.name || 'Unknown Patient'}</h4>
                   <p className="text-sm text-slate-500 mt-1">{new Date(a.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${a.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                   {a.status}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {aiAnalysis && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
               <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <span className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Activity size={20} /></span>
                 AI Clinical Analysis
               </h2>
               <button onClick={() => setAiAnalysis(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors">
                 &times;
               </button>
            </div>
            <div className="p-8 overflow-y-auto prose prose-indigo max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {aiAnalysis}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button onClick={() => setAiAnalysis(null)} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg font-semibold rounded-2xl transition-all">
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
