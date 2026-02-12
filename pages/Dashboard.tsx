
import React from 'react';
import { User, AppView } from '../types';

interface DashboardProps {
  user: User | null;
  setView: (v: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  if (!user) return null;

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'Citizen':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl col-span-2 flex flex-col justify-between">
               <div>
                  <h3 className="text-3xl font-bold legal-serif mb-4">Hello, How can we help?</h3>
                  <p className="text-indigo-100 opacity-80 max-w-md">Get instant guidance on FIRs, Consumer Complaints, or Rental issues in simple language.</p>
               </div>
               <button onClick={() => setView(AppView.RESEARCH_HUB)} className="mt-8 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-xl self-start">Start Chat</button>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center text-center">
               <span className="text-5xl mb-6">📄</span>
               <h4 className="text-xl font-bold text-slate-900 mb-2">Analyze a Notice</h4>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Upload any legal document to understand it in plain English.</p>
               <button onClick={() => setView(AppView.DOC_INTELLIGENCE)} className="mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest">Upload Now</button>
            </div>
          </div>
        );

      case 'Student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Active Learning Path</p>
                <h3 className="text-2xl font-bold text-slate-900 legal-serif mb-2">Constitution of India</h3>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                   <div className="bg-indigo-500 h-full w-[45%]"></div>
                </div>
                <button onClick={() => setView(AppView.STUDENT_BARE_ACTS)} className="text-xs font-bold text-indigo-600 hover:underline">Continue Prep →</button>
             </div>
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Moot Room</h4>
                <p className="text-sm font-medium">Memorial drafting for 'State of X vs. Counsel'.</p>
                <button onClick={() => setView(AppView.STUDENT_MOOT)} className="mt-4 py-2 bg-white/10 rounded-xl text-[9px] font-bold uppercase">Open Memorial</button>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-3xl mb-4">🔥</p>
                <p className="text-2xl font-bold text-slate-900">7 Days</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Study Streak</p>
             </div>
          </div>
        );

      case 'Junior_Advocate':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm col-span-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Daily Filing Checklist</h4>
                <div className="space-y-4">
                   {['Bail Application (Sec 439 BNSS)', 'Process Fee Filing', 'Affidavit Attestation'].map(item => (
                      <div key={item} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="text-xs font-bold text-slate-700">{item}</span>
                         <span className="text-[8px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded">PENDING</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl flex flex-col justify-between">
                <div>
                   <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">Filing Assistant</h4>
                   <p className="text-sm leading-relaxed mb-8">Step-by-step help for clearing Registry Objections in the High Court.</p>
                </div>
                <button onClick={() => setView(AppView.JUNIOR_FILING)} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg">Start Guide</button>
             </div>
          </div>
        );

      case 'Senior_Advocate':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Matters</p>
                  <p className="text-5xl font-bold text-slate-900 tracking-tighter">14</p>
                </div>
                <button onClick={() => setView(AppView.INHOUSE_MATTERS)} className="mt-6 text-[10px] font-bold text-indigo-600">Dossier Hub →</button>
             </div>
             <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl col-span-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">Strategic Research Hub</h4>
                  <p className="text-xl font-bold leading-tight">Query 1.2M+ SC/HC citations with Neural Citation Mapping.</p>
                </div>
                <button onClick={() => setView(AppView.RESEARCH_HUB)} className="mt-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-[10px] uppercase">Launch RAG Pipeline</button>
             </div>
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Firm Intelligence</p>
                  <p className="text-sm">24 Internal Templates Indexed.</p>
                </div>
                <button onClick={() => setView(AppView.DOC_INTELLIGENCE)} className="mt-6 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold">Manage Brain</button>
             </div>
          </div>
        );

      case 'Startup_Founder':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legal Health Score</p>
                   <p className="text-6xl font-bold text-slate-900 tracking-tighter">84<span className="text-2xl text-slate-300">/100</span></p>
                </div>
                <button onClick={() => setView(AppView.STARTUP_COMPLIANCE)} className="mt-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl relative z-10">Full Audit</button>
                <div className="absolute top-0 right-0 h-full w-48 bg-slate-50 -rotate-12 translate-x-12"></div>
             </div>
             <div className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-xl col-span-2">
                <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-8">Pending Compliance</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-white/10 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-bold text-indigo-300 mb-1">ROC Filing</p>
                      <p className="text-lg font-bold">12 Days Left</p>
                   </div>
                   <div className="p-5 bg-white/10 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-bold text-indigo-300 mb-1">GST GSTR-1</p>
                      <p className="text-lg font-bold">Next Tuesday</p>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'In_House_Counsel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Matter Exposure</h4>
                   <p className="text-4xl font-bold text-slate-900">₹ 14.2 Cr</p>
                </div>
                <button onClick={() => setView(AppView.INHOUSE_EXPOSURE)} className="mt-12 py-3 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-bold uppercase border border-slate-100">Exposure Audit</button>
             </div>
             <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl col-span-2">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-10">External Counsel Monitoring</h4>
                <div className="space-y-4">
                   {['Firm A: 4 active matters', 'Firm B: 2 pending reviews'].map(log => (
                      <div key={log} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold">{log}</div>
                   ))}
                </div>
             </div>
          </div>
        );

      default:
        return <div className="p-20 text-center text-slate-400">Loading Workspace...</div>;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Command Center</h1>
          <p className="text-lg text-slate-500 font-medium">
            Calibration: <span className="text-slate-900 font-bold">{user.practiceArea || 'General Jurisprudence'}</span> in <span className="text-slate-900 font-bold">{user.city || 'India'}</span>
          </p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button onClick={() => setView(AppView.PERSONA_SELECTOR)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95">Switch Workspace</button>
        </div>
      </header>

      {renderDashboardContent()}

      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h3 className="text-3xl font-bold legal-serif mb-6">Neural Protocol: Indian Statutes</h3>
               <p className="text-indigo-200 leading-relaxed font-medium max-w-lg">Vidhi AI is grounding all neural research in the verified Indian statutory corpus. IPC-BNS mappings are automatically verified against latest Ministry notifications.</p>
               <button onClick={() => setView(AppView.RESEARCH_HUB)} className="mt-10 px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-sm shadow-xl transition-all hover:bg-indigo-50 active:scale-95">Launch Advanced Research</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center">
                  <p className="text-4xl font-bold mb-2">99%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Accuracy Grounding</p>
               </div>
               <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center">
                  <p className="text-4xl font-bold mb-2">BNS</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Protocol Active</p>
               </div>
            </div>
         </div>
         <div className="absolute -bottom-20 -right-20 h-96 w-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default Dashboard;
