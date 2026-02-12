
import React from 'react';
import { ICONS } from '../constants';

const CitizenHub: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const commonIssues = [
    { title: 'Rent & Tenant Issues', icon: '🏠', desc: 'Eviction notice, security deposit disputes, and rental agreements.' },
    { title: 'Police & FIR Guide', icon: '👮', desc: 'How to file an FIR, what to do if police refuse, and bailable vs non-bailable offences.' },
    { title: 'Consumer Complaints', icon: '🛒', desc: 'Defective products, service deficiency, and E-Daakhil filing.' },
    { title: 'Cheque Bounce (NI Act)', icon: '💸', desc: 'Legal notice for Sec 138 and recovery procedures.' },
    { title: 'Cyber Crime & Fraud', icon: '💻', desc: 'Online financial fraud, identity theft, and reporting to 1930.' },
    { title: 'Labour & Salary', icon: '👷', desc: 'Unpaid wages, wrongful termination, and EPF issues.' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">Public Access Portal</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Citizen Legal Care</h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl">Simple, reliable legal guidance for every Indian citizen. No complex jargon, just clear steps.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {commonIssues.map((issue) => (
          <button
            key={issue.title}
            className="flex flex-col items-start p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-1 transition-all group text-left"
          >
            <span className="text-5xl mb-6 group-hover:scale-110 transition-transform">{issue.icon}</span>
            <h3 className="text-2xl font-bold text-slate-900 legal-serif mb-3">{issue.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">{issue.desc}</p>
            <span className="mt-auto text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              Get Help Now <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={3}/></svg>
            </span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white flex flex-col lg:flex-row items-center gap-12 shadow-2xl">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold legal-serif">Rights Education Mode</h2>
          <p className="text-indigo-200 leading-relaxed font-medium">Learn about your Fundamental Rights, how the Indian Judiciary works, and your duties as a citizen. Empower yourself with legal awareness.</p>
          <div className="flex flex-wrap gap-4">
             <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Start Learning</button>
             <button className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Download Handbooks</button>
          </div>
        </div>
        <div className="w-full lg:w-96 grid grid-cols-2 gap-4">
           {['RTI Drafting', 'E-Filing Help', 'Legal Notices', 'Govt Schemes'].map(t => (
             <div key={t} className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default CitizenHub;
