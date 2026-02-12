
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Hearing, Matter } from '../types';
import { ICONS } from '../constants';

const BoardTracker: React.FC = () => {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');

  useEffect(() => {
    setMatters(db.getMatters());
    setHearings(db.getHearings().sort((a, b) => a.date - b.date));
  }, []);

  const displayHearings = hearings.filter(h => filter === 'Upcoming' ? h.date >= Date.now() : h.date < Date.now());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 legal-serif">Board Tracker</h2>
          <p className="text-slate-500 font-medium">Daily hearing list and court-room schedule management.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-slate-100 p-1 shadow-sm">
           <button onClick={() => setFilter('Upcoming')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === 'Upcoming' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Upcoming</button>
           <button onClick={() => setFilter('Past')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === 'Past' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Past</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {displayHearings.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 opacity-30 italic">
               No hearings found for this period.
            </div>
          ) : displayHearings.map(h => {
            const m = matters.find(matter => matter.id === h.matterId);
            return (
              <div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{new Date(h.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <span className="text-2xl font-bold text-slate-900">{new Date(h.date).getDate()}</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 text-lg">{m?.title || 'Case Removed'}</h4>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m?.court}</span>
                         <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                         <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{h.purpose}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-xs font-bold text-slate-700">{h.bench || 'Bench Unassigned'}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Item No: {h.itemNumber || '--'}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6">Court Holidays</h4>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-xs font-bold">Janmashtami</p>
                   <p className="text-[10px] opacity-40">26 Aug 2024 • All Courts</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-xs font-bold">Gandhi Jayanti</p>
                   <p className="text-[10px] opacity-40">02 Oct 2024 • Gazetted</p>
                </div>
              </div>
           </div>
           
           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Board Stats</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Hearings this Week</span>
                    <span className="font-bold">{hearings.filter(h => h.date >= Date.now() && h.date <= Date.now() + 86400000 * 7).length}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Pending Orders</span>
                    <span className="font-bold text-indigo-600">04</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BoardTracker;
