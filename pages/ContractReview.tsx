
import React, { useState, useRef } from 'react';
import { reviewContractAI } from '../services/gemini';
import { documentService } from '../services/documentService';
import { ICONS } from '../constants';

const ContractReview: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const content = await documentService.extractText(file);
        setText(content);
        const res = await reviewContractAI(content);
        setReport(res);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const runAudit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await reviewContractAI(text);
      setReport(res);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 legal-serif">Contract Intelligence Audit</h2>
          <p className="text-slate-500 font-medium">Scan for one-sided indemnity, liability traps, and GST gaps.</p>
        </div>
        <div className="flex gap-3">
           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.txt" />
           <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">Upload Contract</button>
           <button onClick={runAudit} disabled={isLoading || !text.trim()} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xl active:scale-95 disabled:opacity-30">Run AI Audit</button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Source</span>
            </div>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 p-10 font-mono text-sm leading-relaxed border-none outline-none resize-none bg-transparent custom-scrollbar"
              placeholder="Paste contract text here or upload a file..."
            />
         </div>

         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            
            {!report && !isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-16 opacity-20">
                  <div className="h-32 w-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mb-6">
                     <ICONS.Summarize />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.4em]">Audit Terminal Ready</p>
               </div>
            ) : isLoading ? (
               <div className="flex-1 p-16 space-y-12 animate-pulse">
                  <div className="h-10 bg-slate-100 rounded-2xl w-1/3"></div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="h-32 bg-slate-50 rounded-[2rem]"></div>
                     <div className="h-32 bg-slate-50 rounded-[2rem]"></div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-4 bg-slate-50 rounded w-full"></div>
                     <div className="h-4 bg-slate-50 rounded w-5/6"></div>
                  </div>
               </div>
            ) : (
               <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                  <div className="flex justify-between items-end">
                     <div>
                        <h3 className="text-3xl font-bold legal-serif mb-1">Risk Score: {report.riskScore}%</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High-Accuracy Audit</p>
                     </div>
                     <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                        report.isGSTCompliant ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                     }`}>
                        GST {report.isGSTCompliant ? 'COMPLIANT' : 'DEFICIENT'}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-3">
                        <span className="h-px w-6 bg-indigo-200"></span> Identified Risks
                     </h4>
                     <div className="space-y-3">
                        {report.risks.map((risk: string, i: number) => (
                          <div key={i} className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-700 leading-relaxed">
                             {risk}
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-3">
                        <span className="h-px w-6 bg-emerald-200"></span> Mitigation Suggestions
                     </h4>
                     <div className="space-y-3">
                        {report.suggestions.map((sug: string, i: number) => (
                          <div key={i} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700 leading-relaxed">
                             {sug}
                          </div>
                        ))}
                     </div>
                  </div>

                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                     Export Risk Certificate (PDF)
                  </button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ContractReview;
