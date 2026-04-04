'use client';

import { useState, useRef, useEffect } from 'react';

const SUGGESTED_PROMPTS = [
  { label: 'Review Vitals', prompt: 'Summarize vital signs for Eleanor Fitzgerald and flag any concerns.' },
  { label: 'Check Allergies', prompt: 'List all known allergies for the patient and suggest safe alternatives for common medications.' },
  { label: 'Lab Trends', prompt: 'Analyze the trends from the last 3 metabolic panels and provide insights.' },
  { label: 'Drug Interactions', prompt: 'Check for drug interactions between Lisinopril and Spironolactone.' },
  { label: 'Patient Summary', prompt: 'Generate a concise clinical summary for the patient chart.' },
];

const INITIAL_MESSAGES = [
  {
    role: 'ai',
    content: "Good morning, Doctor. I've reviewed Eleanor Fitzgerald's latest metabolic panel. Everything looks within standard parameters, though her sodium levels are at the upper boundary. Would you like me to cross-reference this with her current medication list?",
    time: '09:12 AM',
  },
];

const PATIENT_CONTEXT = {
  name: 'Eleanor Fitzgerald',
  id: '#CS-99281',
  status: 'Stable',
  bp: '120/80',
  hr: '72',
  lastLab: 'Metabolic panel — Normal ranges observed.',
  lastLabTime: '2 days ago',
  lastConsult: 'Follow-up for chronic hypertension management.',
  lastConsultTime: '1 month ago',
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [activePatientId, setActivePatientId] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setPatients(data);
        setActivePatientId(data[0]._id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const activePatient = patients.find(p => p._id === activePatientId) || {};
  const currentContext = activePatient._id ? {
    name: `${activePatient.firstName} ${activePatient.lastName}`,
    id: activePatient._id.toString().slice(-6).toUpperCase(),
    status: activePatient.status || 'Stable',
    bp: '120/80 (Simulated)',
    hr: '72 (Simulated)',
    lastLab: activePatient.diagnosis || 'No previous diagnosis recorded.',
    lastLabTime: new Date(activePatient.createdAt).toLocaleDateString(),
    lastConsult: activePatient.allergies ? `Allergies: ${activePatient.allergies}` : 'No known allergies',
    lastConsultTime: 'N/A'
  } : PATIENT_CONTEXT;

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: userText, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          context: `Active Patient: ${currentContext.name} (${currentContext.id}). Vitals: BP ${currentContext.bp} mmHg, HR ${currentContext.hr} bpm. Status: ${currentContext.status}. Notes: ${currentContext.lastConsult}`,
        }),
      });
      const data = await res.json();
      const aiMsg = {
        role: 'ai',
        content: data.text || 'I was unable to process that request. Please try again.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Connection error. Check your GEMINI_API_KEY configuration.', time: '' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateSummary = () => {
    sendMessage(`Generate a comprehensive clinical summary for ${currentContext.name}. Include their diagnosis, status, and recommendations.`);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left: Patient Context Panel */}
      <div className="col-span-12 lg:col-span-4 space-y-5">
        {/* Patient Card */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-[5px] border-primary">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Active Patient</span>
            <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase">{currentContext.status}</span>
          </div>
          {patients.length > 0 ? (
            <select value={activePatientId} onChange={(e) => setActivePatientId(e.target.value)} className="w-full bg-surface-container-low border-0 text-on-surface font-headline font-bold text-xl rounded-lg p-2 mb-1 cursor-pointer outline-none focus:ring-2 focus:ring-primary">
              {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
            </select>
          ) : (
            <h3 className="font-headline font-bold text-xl text-on-surface mb-1">{currentContext.name}</h3>
          )}
          <p className="text-sm text-on-surface-variant font-medium mb-5">Patient ID: #{currentContext.id}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-3 rounded-lg">
              <p className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase mb-1">Blood Pressure</p>
              <p className="text-lg font-headline font-bold text-on-surface">{currentContext.bp} <span className="text-xs font-normal text-on-surface-variant">mmHg</span></p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg">
              <p className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase mb-1">Heart Rate</p>
              <p className="text-lg font-headline font-bold text-on-surface">{currentContext.hr} <span className="text-xs font-normal text-on-surface-variant">bpm</span></p>
            </div>
          </div>
        </section>

        {/* Contextual Data */}
        <section className="bg-surface-container-low rounded-xl p-6">
          <h4 className="font-headline font-bold text-on-surface mb-4">Contextual Data</h4>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-2 bg-surface-container-lowest rounded-lg shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-sm">description</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Diagnosis</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{currentContext.lastLab}</p>
                <p className="text-[10px] text-primary mt-1 font-semibold">{currentContext.lastLabTime}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-2 bg-surface-container-lowest rounded-lg shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-sm">history</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Medical Notes</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{currentContext.lastConsult}</p>
                <p className="text-[10px] text-primary mt-1 font-semibold">{currentContext.lastConsultTime}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Prompts */}
        <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h4 className="font-headline font-bold text-on-surface text-sm mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.prompt)}
                disabled={loading}
                className="text-[10px] font-bold text-on-surface-variant hover:text-primary bg-surface-container-low hover:bg-primary-container/30 px-3 py-1.5 rounded-full border border-surface-container-high transition-colors uppercase tracking-wider disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Right: AI Chat Panel */}
      <div className="col-span-12 lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-3xl shadow-lg border border-surface-container-high overflow-hidden" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-surface-container flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl signature-gradient flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <h3 className="font-headline font-extrabold text-on-surface tracking-tight">CareSync AI Assistant</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Clinical Intelligence Active</p>
              </div>
            </div>
          </div>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate Summary
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: 'radial-gradient(circle at top right, #f0f4f7 0%, transparent 40%)' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[85%]' : 'max-w-[85%]'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-primary-container text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-sm">{msg.role === 'ai' ? 'smart_toy' : 'person'}</span>
              </div>

              {/* Bubble */}
              <div className="space-y-1">
                <div className={`p-4 text-sm leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-surface-container-low text-on-surface rounded-2xl rounded-tl-none'
                    : 'signature-gradient text-on-primary rounded-2xl rounded-tr-none shadow-md'
                }`}>
                  {/* Parse warning alerts from AI */}
                  {msg.role === 'ai' && msg.content.toLowerCase().includes('interaction') || msg.content.toLowerCase().includes('alert') || msg.content.toLowerCase().includes('risk') ? (
                    <div className="space-y-3">
                      <p>{msg.content}</p>
                      {msg.content.toLowerCase().includes('risk') && (
                        <div className="bg-white border-2 border-primary/10 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                          <div className="p-2 bg-error-container/20 rounded-full">
                            <span className="material-symbols-outlined text-error text-sm">warning</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-on-surface">Clinical Alert</p>
                            <p className="text-[11px] text-on-surface-variant">Review before prescribing.</p>
                          </div>
                          <button className="text-xs font-bold text-primary hover:underline whitespace-nowrap">View Details</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                {msg.time && <p className={`text-[10px] text-on-surface-variant ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</p>}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-primary flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input box */}
        <div className="p-5 bg-white border-t border-surface-container flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 pl-5 pr-20 text-sm focus:ring-2 focus:ring-primary outline-none shadow-inner transition-all"
                placeholder="Ask CareSync AI a clinical question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button className="p-1.5 text-outline-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">mic</span>
                </button>
                <button className="p-1.5 text-outline-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">attach_file</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="signature-gradient text-on-primary h-12 w-12 rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex-shrink-0"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-on-surface-variant font-medium">Suggested:</span>
            {SUGGESTED_PROMPTS.slice(0, 3).map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.prompt)}
                disabled={loading}
                className="text-[10px] font-bold text-on-surface-variant hover:text-primary bg-surface-container-low px-3 py-1 rounded-full border border-surface-container-high transition-colors uppercase tracking-wider disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
