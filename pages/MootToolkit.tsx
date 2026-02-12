
import React, { useState } from 'react';
import { ICONS } from '../constants';

const MootToolkit: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'memorial' | 'issues' | 'arguments'>('memorial');

  const tools = [
    { id: 'memorial', title: 'Memorial Structuring', desc: 'Standard High Court/Supreme Court moot format.' },
    { id: 'issues', title: 'Issue Framing', desc: 'Extract key legal issues from a fact sheet.' },
    { id: 'arguments', title: 'Argument Builder', desc: 'Ground your oral pleadings in precedents.' },
  ];

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      <header className="pb-6 border-b border-slate-200">
        <h2 className="text-3xl font-bold text-slate-900 legal-serif">Moot Court Toolkit</h2>
        <p className="text-slate-500 font-medium">Professional grade tools for competitive legal debating.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        <div className="lg:col-span-3 flex flex-col gap-4">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`p-6 text-left rounded-3xl border transition-all duration-300 ${
                activeTool === tool.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 border-indigo-600 scale-[1.02]' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <h4 className="font-bold text-sm mb-1">{tool.title}</h4>
              <p className={`text-[10px] leading-relaxed ${activeTool === tool.id ? 'opacity-70' : 'text-slate-400'}`}>
                {tool.desc}
              </p>
            </button>
          ))}
          
          <div className="mt-auto bg-slate-900 rounded-3xl p-6 text-white shadow-inner">
             <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Upcoming Moots</h5>
             <div className="space-y-4">
                <div className="text-[11px]">
                  <p className="font-bold">Bar Council of India Moot</p>
                  <p className="opacity-40">Deadline: 20 Aug</p>
                </div>
                <div className="text-[11px]">
                  <p className="font-bold">NLSIU International Moot</p>
                  <p className="opacity-40">Deadline: 05 Sep</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-9 bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
           <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
              {activeTool === 'memorial' && (
                <div className="space-y-10 max-w-4xl mx-auto">
                   <div className="text-center pb-12 border-b border-slate-100">
                      <h3 className="text-2xl font-bold legal-serif mb-4">Memorial Template: Supreme Court of India</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Formal Practice Simulation</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Required Sections</h4>
                        <ul className="text-sm space-y-4 text-slate-600 font-medium">
                          <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span> Cover Page</li>
                          <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span> Table of Contents</li>
                          <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span> List of Abbreviations</li>
                          <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span> Index of Authorities</li>
                          <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span> Statement of Jurisdiction</li>
                        </ul>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Drafting Tips</h4>
                        <div className="space-y-4 text-xs leading-relaxed text-slate-500">
                          <p>• Ensure all citations follow Bluebook or ILI format.</p>
                          <p>• Facts should be stated objectively without legal arguments.</p>
                          <p>• Issues must be framed in a "Whether..." format.</p>
                          <p>• Prayer should include explicit relief sought under Art. 32/226.</p>
                        </div>
                      </div>
                   </div>

                   <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-2xl shadow-slate-200">
                      Initialize Draft Memorial with AI
                   </button>
                </div>
              )}
              {activeTool !== 'memorial' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 h-full">
                   <ICONS.Gavel />
                   <p className="mt-6 text-xs font-bold uppercase tracking-widest">Intelligence Module Processing Fact Sheet...</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MootToolkit;
