
import React, { useEffect, useState } from 'react';
import { User, AppView } from '../types';
import { api } from '../services/api';

const Dashboard: React.FC<{ user: User | null, setView: (v: AppView) => void }> = ({ user, setView }) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats().then(data => {
      setStats(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="h-full flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing OS Ecosystem...</div>;

  const renderPersonaWidgets = () => {
    switch(user?.role) {
      case 'Citizen':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200 col-span-2">
                <h3 className="text-3xl font-bold legal-serif mb-4">Quick Legal Access</h3>
                <p className="text-indigo-100 mb-8 max-w-lg">Plain-language assistance for common Indian legal issues. Get guided steps for FIRs, Notices, and Complaints.</p>
                <div className="grid grid-cols-2 gap-4">
                   {['Rent Dispute Help', 'Police Complaint Guide', 'Consumer Forum', 'Cyber Crime Reporting'].map(q => (
                      <button key={q} onClick={() => setView(AppView.CHAT)} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-left transition-all border border-white/10">
                         <p className="font-bold text-sm truncate">{q}</p>
                      </button>
                   ))}
                </div>
             </div>
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">📄</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Guided Drafting</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">Create legally sound notices and applications in simple language.</p>
                <button onClick={() => setView(AppView.DRAFT)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl">Draft Now</button>
             </div>
          </div>
        );
      case 'Startup_Founder':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">AI Audit Pulse</h4>
                  <p className="text-3xl font-bold leading-tight">Contract Health: 84%</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest italic">Standard Risk Mapping: ACTIVE</p>
                </div>
                <button onClick={() => setView(AppView.CONTRACT_REVIEW)} className="mt-8 py-3 bg-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Launch Review</button>
             </div>
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-8">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming Compliance Deadlines</h4>
                   <button onClick={() => setView(AppView.COMPLIANCE)} className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Full List →</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl group hover:border-rose-400 transition-all">
                      <p className="text-[9px] font-bold text-rose-400 uppercase mb-1">Today</p>
                      <p className="text-sm font-bold text-rose-900">TDS Payment Window</p>
                   </div>
                   <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-indigo-400 transition-all">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">12 Days Left</p>
                      <p className="text-sm font-bold text-slate-700">Annual Return (ROC)</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'Junior_Advocate':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm md:col-span-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mentor AI Status</p>
                <div className="flex items-center gap-3">
                   <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-xs font-bold text-slate-900">Online & Grounded</span>
                </div>
                <button onClick={() => setView(AppView.CHAT)} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest">Ask Procedural</button>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm md:col-span-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Court Filing Preparation</h4>
                <div className="flex gap-4">
                   {['Admission', 'Interim Relief', 'Final Disposal'].map(f => (
                      <div key={f} className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                         <p className="text-[8px] font-bold text-slate-500 uppercase">{f}</p>
                      </div>
                   ))}
                </div>
             </div>
             <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
                <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mb-3">Daily Board</p>
                <p className="text-3xl font-bold">{stats.upcomingHearings.length}</p>
                <p className="text-[9px] font-bold text-white/60 mt-1 uppercase">Items in Board</p>
             </div>
          </div>
        );
      case 'Student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Study Streak</p>
                <p className="text-5xl font-bold text-orange-500 tracking-tighter">🔥 7 Days</p>
                <button onClick={() => setView(AppView.STUDENT_DASHBOARD)} className="mt-8 text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Continue Path →</button>
             </div>
             <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200 col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Current Learning Paths</h4>
                  <span className="text-[9px] font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">Academic Mode</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <p className="text-sm font-bold">Constitution of India</p>
                      <span className="text-[10px] font-bold">65%</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <p className="text-sm font-bold">BNS (Criminal Law)</p>
                      <span className="text-[10px] font-bold">20%</span>
                   </div>
                </div>
             </div>
          </div>
        );
      default: // Senior Advocate / Law Firm
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Matters</p>
                   <p className="text-5xl font-bold text-slate-900 tracking-tighter">{stats.activeMattersCount}</p>
                </div>
                <button onClick={() => setView(AppView.MATTERS)} className="mt-6 text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Registry Hub →</button>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm md:col-span-2 overflow-hidden flex flex-col">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Upcoming Master Board</h4>
                <div className="flex-1 space-y-3">
                   {stats.upcomingHearings.slice(0, 3).map((h: any) => (
                      <div key={h.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                         <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{h.purpose}</p>
                         <span className="text-[8px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{new Date(h.date).toLocaleDateString()}</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Neural Credits</p>
                  <p className="text-3xl font-bold">{stats.remainingCredits}</p>
                </div>
                <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500" style={{ width: `${(stats.remainingCredits / stats.maxCredits) * 100}%` }}></div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Ecosystem Command</h1>
          <p className="text-lg text-slate-500 font-medium">Hello <span className="text-slate-900 font-bold">{user?.name}</span>. Your {user?.role.replace('_', ' ')} Hub is initialized.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button onClick={() => setView(AppView.PERSONA_SELECTOR)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all">Choose Workspace Mode</button>
        </div>
      </header>

      {renderPersonaWidgets()}

      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h3 className="text-3xl font-bold legal-serif mb-6">Neural Intelligence Protocol</h3>
               <p className="text-indigo-200 leading-relaxed font-medium max-w-lg">Vidhi AI is grounding all research in verified Indian statutory records. Every response is cross-referenced with BNS/BNSS protocols and landmark precedents from {stats.totalFirms * 10}+ practice nodes.</p>
               <div className="mt-10 flex gap-4">
                  <button onClick={() => setView(AppView.CHAT)} className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">Launch Research Node</button>
                  {user?.role === 'Senior_Advocate' && (
                     <button onClick={() => setView(AppView.STRATEGY)} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all border border-indigo-400">Strategy Lab</button>
                  )}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <p className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">99%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grounding Accuracy</p>
               </div>
               <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <p className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">DPDP</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Privacy Compliant</p>
               </div>
               <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <p className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">BNS</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mapping Protocol</p>
               </div>
               <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <p className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">SC/HC</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Case Index</p>
               </div>
            </div>
         </div>
         <div className="absolute -bottom-20 -right-20 h-96 w-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute -top-20 -left-20 h-96 w-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <footer className="shrink-0 flex items-center justify-center py-10 opacity-30">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">Vidhi Neural OS • Advanced Strategic Layer • ISO 27001 Shard</p>
      </footer>
    </div>
  );
};

export default Dashboard;
