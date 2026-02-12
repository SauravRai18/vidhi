
import React from 'react';
import { ICONS } from '../constants';

const JuniorWorkspace: React.FC = () => {
  const steps = [
    { title: 'Drafting & Verification', desc: 'Ensure all annexures are marked and vakalatnama is signed.' },
    { title: 'Registry Filing', desc: 'How to clear objections in the Delhi High Court & District Courts.' },
    { title: 'Process Fee & Notices', desc: 'Steps for service of summons and tracking delivery.' },
    { title: 'Oral Mentioning', desc: 'How to effectively mention urgent matters before the Bench.' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-indigo-100">Advocate Launchpad</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 legal-serif tracking-tight">Junior Chamber</h1>
        <p className="text-lg text-slate-500 font-medium">Bridge the gap between Law School and the Bar with procedural intelligence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900 flex items-center gap-3">
                   <span className="h-4 w-1 bg-indigo-600 rounded-full"></span> Stepwise Filing Guides
                 </h3>
              </div>
              <div className="p-8 space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                     <div className="shrink-0 h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {i + 1}
                     </div>
                     <div className="flex-1 pb-6 border-b border-slate-50 last:border-0">
                        <h4 className="text-base font-bold text-slate-900 mb-1">{step.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
              <h3 className="text-2xl font-bold legal-serif mb-6">Learning AI Mentor</h3>
              <p className="text-slate-400 leading-relaxed mb-10 max-w-lg">Stuck on a procedural doubt? Ask the Mentor. Explains court rules, registry practices, and standard objections in simple terms.</p>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">Ask Mentor a Question</button>
              <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 rotate-12">
                 <ICONS.Books />
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Court Specific Formats</h4>
              <div className="space-y-3">
                 {['Supreme Court', 'Delhi High Court', 'Bombay High Court', 'CAT / NCLT'].map(c => (
                   <button key={c} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-xs font-bold text-slate-700 hover:border-indigo-400 transition-all flex justify-between items-center group">
                      {c}
                      <svg className="h-4 w-4 text-slate-300 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200">
              <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">Fresh Advocate Checklist</h4>
              <div className="space-y-4">
                 {[
                   'AIBE Preparation Status',
                   'Bar Council Enrollment',
                   'Chamber Allocation',
                   'Legal Research Database'
                 ].map(item => (
                   <div key={item} className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-white/20 rounded-md"></div>
                      <span className="text-xs font-bold">{item}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JuniorWorkspace;
