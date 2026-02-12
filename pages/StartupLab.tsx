
import React from 'react';
import { ICONS } from '../constants';

const StartupLab: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-purple-100">Business Resilience</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Founder's Legal Lab</h1>
        <p className="text-lg text-slate-500 font-medium">Protect your equity, minimize liability, and ensure 100% compliance with Indian laws.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm col-span-2 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Legal Health</p>
               <p className="text-6xl font-bold text-slate-900 tracking-tighter">84<span className="text-2xl text-slate-300">/100</span></p>
               <p className="text-xs font-bold text-emerald-600 mt-4 uppercase tracking-widest">Growth Ready • Stable</p>
            </div>
            <div className="mt-12 flex gap-4 relative z-10">
               <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl">Full Audit</button>
               <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest">History</button>
            </div>
            <div className="absolute top-0 right-0 h-full w-48 bg-slate-50 -rotate-12 translate-x-12 pointer-events-none"></div>
         </div>

         <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200">
            <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">Contract Hub</h4>
            <p className="text-sm font-bold leading-relaxed mb-8">AI-Review for one-sided indemnity and GST clauses.</p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg">New Review</button>
         </div>

         <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Compliance Desk</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs font-bold">
                  <span>ROC Filing</span>
                  <span className="text-amber-400">12 Days</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold">
                  <span>GST GSTR-1</span>
                  <span className="text-emerald-400">Done</span>
               </div>
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/20">Full Calendar</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-900">Critical Risks Identified</h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <span className="text-3xl">⚠️</span>
                     <div>
                        <p className="text-sm font-bold text-rose-900">Missing POSH Policy</p>
                        <p className="text-xs text-rose-600 font-medium">Required for firms with 10+ employees.</p>
                     </div>
                  </div>
                  <button className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Draft Now</button>
               </div>
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-6">
                     <span className="text-3xl">📝</span>
                     <div>
                        <p className="text-sm font-bold text-slate-700">Trademark Renewal</p>
                        <p className="text-xs text-slate-400 font-medium">Renewal window opens in 180 days.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Asset Protection</h4>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl">🛡️</div>
                  <div>
                     <p className="text-sm font-bold text-slate-900">Equity Vesting</p>
                     <p className="text-[10px] text-slate-400 uppercase font-bold">Standard 4-year cycle</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">📄</div>
                  <div>
                     <p className="text-sm font-bold text-slate-900">IP Assignment</p>
                     <p className="text-[10px] text-slate-400 uppercase font-bold">Standard Developer Clause</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StartupLab;
