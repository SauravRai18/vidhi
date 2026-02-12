
import React, { useState, useRef, useEffect } from 'react';
import { analyzeJudgmentEnterprise } from '../services/gemini';
import { documentService } from '../services/documentService';
import { db } from '../services/db';
import { api } from '../services/api';
import { JudgmentSummary, Matter } from '../types';
import { ICONS } from '../constants';
// Added import to fix the "Cannot find name 'knowledgeBase'" error
import { knowledgeBase } from '../services/knowledgeBase';

const Summarizer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<JudgmentSummary | null>(null);
  const [manualText, setManualText] = useState('');
  const [activeTab, setActiveTab] = useState<'facts' | 'ratio' | 'arguments'>('facts');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [targetMatterId, setTargetMatterId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMatters(db.getMatters());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(20);
    
    try {
      const text = await documentService.extractText(file);
      setManualText(text);
      setUploadProgress(100);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleProcess = async () => {
    if (!manualText.trim()) return;
    setIsLoading(true);
    const result = await analyzeJudgmentEnterprise(manualText);
    setSummary(result);
    setIsLoading(false);
  };

  const handleSaveToMatter = async () => {
    if (!summary || !targetMatterId) return;
    setIsSaving(true);
    try {
      const doc = await knowledgeBase.ingest(
        new File([JSON.stringify(summary)], `${summary.caseTitle}_Summary.txt`, { type: 'text/plain' }),
        'Judgment',
        ['AI_Summary', 'Landmark_Extraction']
      );
      await api.matters.linkDocument(targetMatterId, doc.id);
      alert("Summary assimilated into Matter Dossier.");
      setTargetMatterId('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 shrink-0">
         <div>
           <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 legal-serif">Judgment Intelligence</h2>
           <p className="text-[10px] sm:text-sm text-slate-500 font-medium mt-1">SaaS-driven extraction of Ratio Decidendi and Case Principles.</p>
         </div>
         <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".txt,.pdf"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs font-bold bg-white border border-slate-200 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <span className="scale-75 sm:scale-100"><ICONS.Upload /></span>
              <span>Ingest Case File</span>
            </button>
            <button 
              onClick={() => { setSummary(null); setManualText(''); }}
              className="flex-1 sm:flex-none text-[10px] sm:text-xs font-bold bg-slate-900 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-white hover:bg-slate-800 shadow-xl transition-all active:scale-95"
            >
              Reset
            </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 sm:gap-8 min-h-0">
        {/* Ingestion Workspace */}
        <div className="w-full lg:w-[40%] xl:w-[45%] bg-white rounded-2xl sm:rounded-[3rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative group shrink-0 h-[300px] lg:h-auto">
          {uploadProgress > 0 && (
            <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-500 z-10 shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${uploadProgress}%` }} />
          )}
          <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-3">
               <span className="h-2 w-2 rounded-full bg-slate-400 group-focus-within:bg-indigo-500 transition-colors"></span>
               <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Source Input</span>
            </div>
          </div>
          <textarea 
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className="flex-1 p-6 sm:p-10 text-xs sm:text-sm border-none outline-none resize-none font-mono text-slate-700 bg-transparent leading-[2] custom-scrollbar selection:bg-indigo-100"
            placeholder="Paste raw judgment text or ingest a file..."
          ></textarea>
          <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
            <button
              onClick={handleProcess}
              disabled={isLoading || !manualText.trim()}
              className="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/10 disabled:opacity-30 active:scale-[0.98] flex items-center justify-center space-x-3 sm:space-x-4"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span className="tracking-widest uppercase text-[10px] sm:text-xs">Synchronizing...</span>
                </>
              ) : (
                <>
                  <span className="scale-75 sm:scale-100"><ICONS.Summarize /></span>
                  <span className="tracking-widest uppercase text-[10px] sm:text-xs">Run Intelligence</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Intelligence Output */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-[3rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative min-h-0">
          {!summary && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-16 space-y-6 sm:space-y-8">
               <div className="h-20 w-20 sm:h-32 sm:w-32 bg-slate-50 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center text-slate-200 shadow-inner scale-75 sm:scale-100">
                  <ICONS.Gavel />
               </div>
               <div>
                 <h3 className="text-xl sm:text-2xl font-bold text-slate-900 legal-serif">Intelligence Idle</h3>
                 <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3 max-w-sm leading-relaxed font-medium">Ingest a judicial document to initiate the extraction pipeline. Vidhi AI will map the principles automatically.</p>
               </div>
            </div>
          ) : isLoading ? (
            <div className="flex-1 p-8 sm:p-16 space-y-8 sm:space-y-12 overflow-hidden">
               <div className="animate-pulse space-y-6">
                  <div className="h-8 sm:h-12 bg-slate-100 rounded-xl w-2/3"></div>
                  <div className="h-4 bg-slate-50 rounded-lg w-1/4"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="h-40 sm:h-56 bg-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] animate-pulse"></div>
                  <div className="h-40 sm:h-56 bg-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] animate-pulse delay-75"></div>
               </div>
            </div>
          ) : (
            <>
              <div className="p-6 sm:p-12 border-b border-slate-100 bg-slate-900 text-white relative shrink-0">
                <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-5 pointer-events-none">
                  <ICONS.Gavel />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-[8px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] block mb-2 sm:mb-4">Intelligence Extractions</span>
                    <h3 className="text-xl sm:text-3xl font-bold legal-serif leading-tight max-w-3xl line-clamp-2 sm:line-clamp-none">{summary?.caseTitle}</h3>
                    <div className="mt-4 sm:mt-8 flex flex-wrap gap-2">
                      {summary?.sectionsCited.map((sec, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold backdrop-blur-xl">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Link to Matter UI */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-3 backdrop-blur-md">
                     <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Assimilate to Matter</p>
                     <select 
                        value={targetMatterId}
                        onChange={(e) => setTargetMatterId(e.target.value)}
                        className="bg-transparent text-[10px] font-bold outline-none border-b border-white/20 pb-1 text-white w-32"
                     >
                        <option value="" className="text-slate-900">Select Matter</option>
                        {matters.map(m => <option key={m.id} value={m.id} className="text-slate-900">{m.title}</option>)}
                     </select>
                     <button 
                        onClick={handleSaveToMatter}
                        disabled={!targetMatterId || isSaving}
                        className="py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-30 transition-all"
                     >
                        {isSaving ? 'Saving...' : 'Link Summary'}
                     </button>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-12 py-2 sm:py-3 border-b border-slate-100 flex bg-slate-50/50 overflow-x-auto no-scrollbar shrink-0">
                {(['facts', 'arguments', 'ratio'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`min-w-[80px] sm:min-w-[120px] flex-1 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-xl sm:rounded-2xl ${
                      activeTab === tab ? 'bg-white shadow-xl text-slate-900 ring-1 ring-slate-100' : 'text-slate-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-6 sm:p-12 overflow-y-auto space-y-8 sm:space-y-12 custom-scrollbar">
                {activeTab === 'facts' && (
                  <div className="animate-in slide-in-from-bottom-6 duration-700">
                    <section className="mb-8 sm:mb-12">
                      <h4 className="text-[9px] sm:text-[11px] font-bold text-indigo-600 uppercase tracking-[0.3em] mb-4 sm:mb-6 flex items-center">
                        <span className="h-1 w-6 sm:w-8 bg-indigo-500 mr-3 sm:mr-4 rounded-full"></span> Factual Matrix
                      </h4>
                      <p className="text-sm sm:text-lg text-slate-700 leading-[1.8] font-medium">{summary?.facts}</p>
                    </section>
                    
                    <section>
                      <h4 className="text-[9px] sm:text-[11px] font-bold text-indigo-600 uppercase tracking-[0.3em] mb-4 sm:mb-6 flex items-center">
                        <span className="h-1 w-6 sm:w-8 bg-indigo-500 mr-3 sm:mr-4 rounded-full"></span> Issues Framed
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        {summary?.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-3 sm:gap-5 p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                            <span className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-900 shadow-sm">{idx + 1}</span>
                            <span className="text-xs sm:text-base text-slate-600 font-medium italic leading-relaxed pt-1 sm:pt-1.5">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'ratio' && (
                  <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-8 sm:space-y-12">
                     <div className="p-8 sm:p-14 bg-indigo-50 border border-indigo-100 rounded-2xl sm:rounded-[3.5rem] relative overflow-hidden group">
                        <div className="relative z-10">
                          <h4 className="text-[9px] sm:text-[11px] font-bold text-indigo-600 uppercase tracking-[0.3em] mb-4 sm:mb-6">Ratio Decidendi</h4>
                          <p className="text-lg sm:text-2xl text-indigo-900 font-bold italic leading-relaxed">"{summary?.ratioDecidendi}"</p>
                        </div>
                        <div className="absolute top-6 right-6 sm:top-10 sm:right-12 text-indigo-200 opacity-20 scale-75 sm:scale-110">
                           <svg className="h-16 w-16 sm:h-24 sm:w-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.5693 13 5.017 13H4.017V21H6.017Z" /></svg>
                        </div>
                     </div>
                     <div className="p-8 sm:p-12 bg-white border border-slate-200 rounded-2xl sm:rounded-[3.5rem] shadow-sm">
                        <h4 className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4 sm:mb-6">Final Order</h4>
                        <p className="text-sm sm:text-lg text-slate-700 leading-relaxed font-medium">{summary?.judgment}</p>
                     </div>
                  </div>
                )}

                {activeTab === 'arguments' && (
                  <div className="animate-in slide-in-from-bottom-6 duration-700 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                    <div className="p-6 sm:p-10 bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-sm">
                       <h4 className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center">
                         <span className="h-1 w-4 bg-slate-300 mr-2 sm:mr-3 rounded-full"></span> Petitioner
                       </h4>
                       <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-medium italic">"{summary?.argumentsPetitioner}"</p>
                    </div>
                    <div className="p-6 sm:p-10 bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-sm">
                       <h4 className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center">
                         <span className="h-1 w-4 bg-slate-300 mr-2 sm:mr-3 rounded-full"></span> Respondent
                       </h4>
                       <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-medium italic">"{summary?.argumentsRespondent}"</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
