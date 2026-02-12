
import React from 'react';
import { User, AppView } from '../types';

interface DashboardProps {
  user: User | null;
  setView: (v: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  if (!user) return null;

  const renderContent = () => {
    switch (user.role) {
      case 'Citizen':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold legal-serif mb-4">How can we help today?</h3>
                <p className="text-indigo-100 max-w-lg mb-8">Get instant guidance on FIRs, Rent disputes, or Consumer Court issues in simple language.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['FIR Guide', 'Consumer Complaint', 'Rental Notice'].map(q => (
                    <button key={q} onClick={() => setView(AppView.RESEARCH_HUB)} className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left font-bold text-sm transition-all">
                       Ask about {q} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-10 flex flex-col justify-center text-center shadow-sm">
              <span className="text-6xl mb-6">📄</span>
              <h4 className="text-xl font-bold mb-2">Analyze a Notice</h4>
              <p className="text-xs text-slate-500 mb-8 font-medium">Upload any legal paper to understand it in plain English.</p>
              <button onClick={() => setView(AppView.DOC_INTELLIGENCE)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95">Start Analysis</button>
            </div>
          </div>
        );

      case 'Student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col justify-between shadow-sm">
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Learning Streak</p>
                  <h3 className="text-4xl font-bold text-slate-900 mb-4">Phase 1: BNS Prep</h3>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-indigo-600 h-full w-[45%] shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                  </div>
               </div>
               <button onClick={() => setView(AppView.STUDENT_BARE_ACTS)} className="mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest self-start px-10 shadow-xl">Continue Study</button>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Moot Room</h4>
               <p className="text-sm font-medium opacity-80 leading-relaxed">Active Memorial for 'State vs counsel'.</p>
               <button onClick={() => setView(AppView.STUDENT_MOOT)} className="mt-8 py-3 bg-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest">Edit Memorial</button>
            </div>
            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl flex flex-col justify-center text-center">
               <p className="text-4xl font-bold mb-2">12</p>
               <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Cases Briefed</p>
               <button onClick={() => setView(AppView.STUDENT_BRIEFS)} className="mt-6 text-[9px] font-bold underline uppercase tracking-widest">View All</button>
            </div>
          </div>
        );

      case 'Junior_Advocate':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-sm">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <span className="h-4 w-1 bg-indigo-600 rounded-full"></span> Daily Hearing Checklist
               </h4>
               <div className="space-y-4">
                  {['Check Daily Board for Item No.', 'Verify Notice of Motion status', 'Submit Process Fee (PF)'].map(i => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-200 transition-all cursor-pointer group">
                       <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{i}</span>
                       <span className="h-4 w-4 rounded border-2 border-slate-200"></span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="space-y-8">
               <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl flex flex-col justify-between h-1/2">
                  <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Filing Assistant</h4>
                  <p className="text-lg font-bold leading-tight">Clear Registry Objections in Delhi HC.</p>
                  <button onClick={() => setView(AppView.JUNIOR_FILING)} className="mt-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-[9px] uppercase tracking-widest">Guide Me</button>
               </div>
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between h-1/2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hearing Prep</h4>
                  <p className="text-sm font-medium opacity-80">Synthesize facts for 'Kumar vs Union'.</p>
                  <button onClick={() => setView(AppView.JUNIOR_HEARING_PREP)} className="mt-6 py-3 bg-white/10 rounded-xl font-bold text-[9px] uppercase tracking-widest">Launch AI Prep</button>
               </div>
            </div>
          </div>
        );

      case 'Senior_Advocate':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all">
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Matter Dossier</p>
                  <p className="text-5xl font-bold text-slate-900 tracking-tighter">14</p>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase mt-2">Active</p>
               </div>
               <button onClick={() => setView(AppView.INHOUSE_MATTERS)} className="mt-8 text-indigo-600 font-bold text-[9px] uppercase tracking-widest underline underline-offset-4">Explore Registry</button>
            </div>
            <div className="md:col-span-2 bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-10">Strategic Research Hub</h4>
                  <h3 className="text-3xl font-bold legal-serif leading-tight max-w-sm">Synthesize Strategic Grounds against 1.2M Precedents.</h3>
               </div>
               <button onClick={() => setView(AppView.RESEARCH_HUB)} className="mt-12 py-5 px-10 bg-white text-indigo-600 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl group-hover:scale-105 transition-transform">Launch Advanced RAG</button>
               <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 group-hover:rotate-12 transition-transform">⚖️</div>
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-between">
               <div>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Firm Brain</p>
                  <p className="text-xs font-medium opacity-70">24 Internal Precedents Learned.</p>
               </div>
               <button onClick={() => setView(AppView.SENIOR_STRATEGY)} className="py-3 bg-white/10 border border-white/10 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-white/20 transition-all">Audit Precedents</button>
            </div>
          </div>
        );

      case 'Startup_Founder':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-sm flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Legal Health Audit</p>
                  <p className="text-7xl font-bold text-slate-900 tracking-tighter">84<span className="text-2xl text-slate-300">/100</span></p>
               </div>
               <button onClick={() => setView(AppView.STARTUP_COMPLIANCE)} className="mt-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl relative z-10">Full Health Check</button>
               <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-slate-50 -rotate-12 rounded-full"></div>
            </div>
            <div className="md:col-span-2 bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-xl flex flex-col justify-between">
               <div>
                  <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-8">Contract Intelligence AI</h4>
                  <p className="text-2xl font-bold legal-serif leading-snug max-w-md">Identify 'One-sided Indemnity' and 'Risky Termination' clauses instantly.</p>
               </div>
               <div className="mt-10 flex gap-4">
                  <button onClick={() => setView(AppView.STARTUP_CONTRACT_AI)} className="px-10 py-5 bg-white text-indigo-600 rounded-3xl font-bold text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Start Review</button>
                  <button onClick={() => setView(AppView.DOC_INTELLIGENCE)} className="px-10 py-5 bg-white/10 border border-white/10 text-white rounded-3xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all">History</button>
               </div>
            </div>
          </div>
        );

      case 'In_House_Counsel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 flex items-center justify-between">
                  <span>Exposure Tracking</span>
                  <button onClick={() => setView(AppView.INHOUSE_EXPOSURE)} className="text-indigo-600 underline">Audit All Matters</button>
               </h4>
               <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-5xl font-bold text-slate-900 tracking-tighter">₹ 14.2 Cr</span>
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Active Claims</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[60%]"></div>
               </div>
            </div>
            <div className="md:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">Counsel Monitoring</h4>
               <div className="space-y-3">
                  {['Firm A: Pending Response (3d)', 'Firm B: Draft Received', 'Independent Counsel: Hearing Tomorrow'].map(l => (
                    <div key={l} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold tracking-tight">
                       {l}
                    </div>
                  ))}
               </div>
               <button onClick={() => setView(AppView.INHOUSE_MATTERS)} className="mt-8 py-3 bg-white/10 rounded-xl font-bold text-[9px] uppercase tracking-widest">Registry Command</button>
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center opacity-30 italic">Initializing Workspace Nodes...</div>;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Command Center</h1>
          <p className="text-lg text-slate-500 font-medium mt-2 italic">
            Calibrated for: <span className="text-slate-900 font-bold">{user.city || 'India'}</span> Jurisprudence
          </p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button onClick={() => setView(AppView.PERSONA_SELECTOR)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95">Re-Initialize Persona</button>
        </div>
      </header>

      {renderContent()}

      {/* Shared Strategic Protocol Card */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
               <h3 className="text-3xl font-bold legal-serif mb-6">Neural Grounding Protocol</h3>
               <p className="text-indigo-200 leading-relaxed font-medium text-lg max-w-lg">Vidhi AI is strictly grounded in the Indian Statutory Corpus. All IPC-BNS mappings are verified against the latest Ministry notifications.</p>
               <button onClick={() => setView(AppView.RESEARCH_HUB)} className="mt-10 px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Launch Strategic Node</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { val: '99.2%', label: 'Mapping Precision' },
                 { val: 'BNS+', label: 'Reform Protocol' },
                 { val: 'SC-IN', label: 'Landmark Index' },
                 { val: 'DPDP', label: 'Privacy Standard' }
               ].map(stat => (
                 <div key={stat.label} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center group hover:bg-white/10 transition-all">
                    <p className="text-3xl font-bold text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stat.val}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
         <div className="absolute -bottom-20 -right-20 h-96 w-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute -top-20 -left-20 h-96 w-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <footer className="text-center opacity-30 pt-10">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">Vidhi Neural OS • Advanced Strategic Layer • ISO 27001 Grounded</p>
      </footer>
    </div>
  );
};

export default Dashboard;
