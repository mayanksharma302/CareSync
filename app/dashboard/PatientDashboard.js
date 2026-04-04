'use client';
import { useState, useEffect } from 'react';
import { FileText, CalendarPlus, Loader2, Calendar } from 'lucide-react';

export default function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  // Default dummy hex string matching MongoDB ObjectId length
  const [bookData, setBookData] = useState({ date: '', notes: '', doctorId: '60c72b2f9b1d8e001c8e4b5a' }); 

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsRes, apptRes] = await Promise.all([
          fetch('/api/patients').then(res => res.json()),
          fetch('/api/appointments').then(res => res.json())
        ]);
        if (patientsRes.success && patientsRes.data.length > 0) setProfile(patientsRes.data[0]);
        if (apptRes.success) setAppointments(apptRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      const data = await res.json();
      if (data.success) {
        setAppointments([...appointments, data.data]);
        alert('Appointment booked successfully!');
        setBookData({...bookData, date: '', notes: ''});
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
          <p className="text-white/80">Here is your medical overview and upcoming schedule.</p>
        </div>
        <div className="mt-6 sm:mt-0 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-sm text-white/70 uppercase tracking-widest font-bold">Upcoming</p>
          <p className="text-2xl font-bold">{appointments.filter(a => a.status !== 'Completed').length} Appts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><CalendarPlus size={20} /></div>
             Book Appointment
          </h2>
          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Date & Time</label>
              <input 
                type="datetime-local" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 bg-slate-50 outline-none transition-all hover:bg-white"
                value={bookData.date}
                onChange={e => setBookData({...bookData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Reason / Notes</label>
              <textarea 
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 bg-slate-50 outline-none transition-all resize-none hover:bg-white"
                placeholder="Briefly describe your symptoms..."
                value={bookData.notes}
                onChange={e => setBookData({...bookData, notes: e.target.value})}
              ></textarea>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Doctor ID (MVP Demo)</label>
               <input 
                 type="text" 
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed"
                 value={bookData.doctorId}
                 onChange={e => setBookData({...bookData, doctorId: e.target.value})}
               />
               <p className="text-xs text-slate-400 mt-2">In a real app, this would be a doctor selection dropdown.</p>
            </div>
            <button 
              type="submit" 
              disabled={booking}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
            >
              {booking ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Booking'}
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Calendar size={20} /></div>
              Your Appointments
            </h2>
            <div className="space-y-4">
               {appointments.length === 0 ? <p className="text-slate-500 text-sm">No scheduled appointments.</p> : null}
               {[...appointments].reverse().map(a => (
                 <div key={a._id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow hover:bg-white group cursor-default">
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="font-bold text-slate-800">{new Date(a.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
                       <p className="text-sm text-slate-500 mt-1">Ref: {a._id?.substring(0, 8)}</p>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${a.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                       {a.status}
                     </span>
                   </div>
                   {a.notes && <p className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100 mt-1">"{a.notes}"</p>}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
