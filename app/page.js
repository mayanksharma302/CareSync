import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/30 blur-3xl"></div>
      </div>
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center space-y-12 text-center mt-20">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 focus:outline-none">CareSync</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The next-generation healthcare coordination system. Seamlessly connecting doctors and patients using advanced AI.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 z-10">
          <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-200 text-lg">
            Login to Portal
          </Link>
          <Link href="/register" className="px-8 py-4 bg-white text-indigo-600 border border-indigo-100 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-lg">
            Create Account
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full z-10">
          <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Management</h3>
            <p className="text-slate-600">Effortlessly manage patient histories and upcoming appointments in one focused interface.</p>
          </div>
          <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Summaries</h3>
            <p className="text-slate-600">Get instant AI-generated risk indicators and medical history summaries using Gemini models.</p>
          </div>
          <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Scheduling</h3>
            <p className="text-slate-600">Streamline appointment booking with real-time status updates and simple patient-doctor flow.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
