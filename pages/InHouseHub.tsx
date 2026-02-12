
import React from 'react';
import { ICONS } from '../constants';

const InHouseHub: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-800">Corporate Legal HQ</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Legal Ops Terminal</h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl">Monitor external counsels, track litigation exposure, and maintain the corporate compliance shield.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div>
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Matter Exposure</h4>
               <p className="text-4xl font-bold text-slate-900 tracking-tighter">₹ 14.2 Cr</p>
               <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase tracking-widest">Active Claims Value</p>
            </div>
            <button onClick={() => setView('MATTERS')} className="mt-12 py-3 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">Audit Matters</button>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-rose-50 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
         </div>

         <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200 flex flex-col justify-between">
            <div>
               <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">Contract Lifecycle</h4>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                     <span>Pending Review</span>
                     <span className="bg-white/10 px-2 py-0.5 rounded">08</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold">
                     <span>Expiring (30d)</span>
                     <span className="bg-white/10 px-2 py-0.5 rounded">03</span>
                  </div>
               </div>
            </div>
            <button onClick={() => setView('CONTRACT_REVIEW')} className="mt-8 py-3 bg-white text-indigo-600 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg active:scale-95">Run AI Audit</button>
         </div>

         <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">External Counsel Management</h4>
            <div className="space-y-6 flex-1">
               {['Khaitan & Co', 'AZB & Partners', 'Independent Counsel'].map(firm => (
                 <div key={firm} className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <p className="text-xs font-bold">{firm}</p>
                 </div>
               ))}
            </div>
            <button className="w-full mt-10 py-3 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/5">Performance Logs</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-900 flex items-center gap-3">
                  <span className="h-4 w-1 bg-indigo-600 rounded-full"></span> Critical Compliance Alerts
               </h3>
            </div>
            <div className="p-8 space-y-4">
               <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-rose-900">GDPR/DPDP Gap Identified</p>
                    <p className="text-[10px] text-rose-500 uppercase font-bold mt-1">Vendor Privacy Policy Review Required</p>
                  </div>
                  <span className="text-2xl">🚨</span>
               </div>
               <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-amber-900">Trademark Renewal Window</p>
                    <p className="text-[10px] text-amber-500 uppercase font-bold mt-1">Class 9: Multi-node Application</p>
                  </div>
                  <span className="text-2xl">⏳</span>
               </div>
            </div>
         </div>

         <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-6">
            <div className="h-20 w-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl">📥</div>
            <div>
               <h4 className="text-xl font-bold text-slate-900 legal-serif mb-2">Legal Health Audit</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">Generate a high-accuracy legal health report for internal stakeholders or board meetings.</p>
            </div>
            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Start Audit</button>
         </div>
      </div>
    </div>
  );
};

export default InHouseHub;
