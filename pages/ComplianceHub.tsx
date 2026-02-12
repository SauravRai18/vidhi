
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { ComplianceItem } from '../types';
import { ICONS } from '../constants';

const ComplianceHub: React.FC = () => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Pending' | 'Completed'>('All');

  useEffect(() => {
    // Seed Indian Advocate specific compliance/deadlines
    const existing = db.getComplianceItems();
    if (existing.length === 0) {
      const advocateDeadlines: ComplianceItem[] = [
        {
          id: 'dl_1',
          firmId: db.getFirmId(),
          title: 'Limitation: Appeal in RFA 102/2023',
          type: 'Professional', // Using Professional as a catch-all for Legal Deadlines
          dueDate: Date.now() + 86400000 * 3,
          status: 'Critical',
          description: 'Last date to file Appeal against the Order dated 15.05.2024. 90-day window closing.'
        },
        {
          id: 'dl_2',
          firmId: db.getFirmId(),
          title: 'Cure Registry Defects: WP 505/2024',
          type: 'Professional',
          dueDate: Date.now() + 86400000 * 1,
          status: 'Critical',
          description: 'Registry raised objection regarding missing Annexure P-4 and blurred copies.'
        },
        {
          id: 'dl_3',
          firmId: db.getFirmId(),
          title: 'File Written Statement: Khanna vs. LG',
          type: 'Professional',
          dueDate: Date.now() + 86400000 * 12,
          status: 'Pending',
          description: '30-day statutory period for filing WS under CPC expiring soon.'
        },
        {
          id: 'dl_4',
          firmId: db.getFirmId(),
          title: 'Professional Tax Filing',
          // Fix: 'IncomeTax' was not assignable to type '"Limitation" | "Statutory" | "Registry" | "Professional"'.
          type: 'Statutory',
          dueDate: Date.now() + 86400000 * 20,
          status: 'Pending',
          description: 'Annual Professional Tax payment for the current financial year.'
        }
      ];
      advocateDeadlines.forEach(item => db.saveComplianceItem(item));
    }
    setItems(db.getComplianceItems());
  }, []);

  const displayItems = items.filter(i => {
    if (filter === 'All') return true;
    return i.status === filter;
  });

  const getDaysRemaining = (date: number) => {
    const diff = date - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 legal-serif">Deadline & Obligations</h2>
          <p className="text-slate-500 font-medium">Critical timelines for limitation, registry objections, and statutory filings.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-slate-100 p-1 shadow-sm">
           {['All', 'Critical', 'Pending', 'Completed'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                 filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
               }`}
             >{f}</button>
           ))}
        </div>
      </header>

      {/* Quick Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Limitation Alarms</p>
             <p className="text-2xl font-bold text-red-600">{items.filter(i => i.title.toLowerCase().includes('limitation')).length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registry Defects</p>
             <p className="text-2xl font-bold text-amber-600">{items.filter(i => i.title.toLowerCase().includes('defect')).length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Statutory Window</p>
             <p className="text-2xl font-bold text-indigo-600">{items.filter(i => i.title.toLowerCase().includes('written')).length}</p>
          </div>
          <button className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl hover:bg-indigo-700 transition-all flex flex-col items-center justify-center gap-2 group">
             <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3} /></svg>
             <span className="text-[10px] font-bold uppercase tracking-widest">New Deadline</span>
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-20 font-bold uppercase tracking-[0.3em]">No items in this category</div>
        ) : displayItems.map(item => {
          const daysLeft = getDaysRemaining(item.dueDate);
          return (
            <div key={item.id} className={`bg-white group rounded-[2.5rem] border shadow-sm flex flex-col hover:shadow-2xl transition-all relative overflow-hidden ${
              daysLeft <= 3 ? 'border-red-200' : 'border-slate-100'
            }`}>
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                   <span className={`text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${
                     item.status === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                   }`}>
                     {daysLeft < 0 ? 'EXPIRED' : `${daysLeft} Days Left`}
                   </span>
                   
                   <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                     item.title.toLowerCase().includes('limitation') ? 'bg-red-50 text-red-600' : 
                     item.title.toLowerCase().includes('defect') ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                   }`}>
                      {item.title.toLowerCase().includes('limitation') ? '⏳' : '⚖️'}
                   </div>
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6 font-medium">{item.description}</p>
              </div>

              <div className="mt-auto px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Date</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(item.dueDate).toLocaleDateString()}</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="h-10 px-4 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:text-indigo-600 hover:border-indigo-600 transition-all text-[10px] font-bold uppercase tracking-widest">
                       Snooze
                    </button>
                    <button className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg">
                       <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} /></svg>
                    </button>
                 </div>
              </div>

              {daysLeft <= 3 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Assistant Call to Action */}
      <div className="bg-indigo-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-indigo-200">
         <div className="h-20 w-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-3xl">🤖</div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold legal-serif mb-2">Automated Limitation Check</h3>
            <p className="text-indigo-200 text-sm max-w-xl">Upload your impugned order and let Vidhi AI calculate the exact last date for Appeal, Revision, or Review under the Limitation Act 1963.</p>
         </div>
         <button className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all whitespace-nowrap">
            Analyze Order
         </button>
      </div>
    </div>
  );
};

export default ComplianceHub;
