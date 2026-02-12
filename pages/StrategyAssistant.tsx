
import React, { useState, useEffect, useRef } from 'react';
import { suggestLitigationStrategy, generateHearingBrief } from '../services/gemini';
import { documentService } from '../services/documentService';
import { db } from '../services/db';
import { Matter } from '../types';
import { ICONS } from '../constants';

interface Attachment {
  name: string;
  content: string;
}

const StrategyAssistant: React.FC = () => {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [activeMatterId, setActiveMatterId] = useState<string>('');
  const [facts, setFacts] = useState('');
  const [purpose, setPurpose] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<{ score: number, basis: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'Strategy' | 'Brief'>('Strategy');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showFoundation, setShowFoundation] = useState(false);
  const [suggestions, setSuggestions] = useState<{title: string, query: string}[]>([]);
  const [activeTab, setActiveTab] = useState<'Intelligence' | 'Roadmap' | 'Precedents'>('Intelligence');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = db.getMatters();
    setMatters(list);
    if (list.length > 0) setActiveMatterId(list[0].id);
  }, []);

  useEffect(() => {
    const m = matters.find(matter => matter.id === activeMatterId);
    if (!m) return;

    const isCriminal = m.tags.some(t => {
      const tl = t.toLowerCase();
      return tl.includes('criminal') || tl.includes('bail') || tl.includes('bns');
    });
    
    const isWrit = m.tags.some(t => t.toLowerCase().includes('writ') || t.toLowerCase().includes('consti'));

    let tacticalPrompts = [];
    if (isCriminal) {
      tacticalPrompts = [
        { title: 'Anticipatory Bail Strategy', query: 'Detailed strategy for Anticipatory Bail under Sec 482 BNSS including change in law analysis.' },
        { title: 'Quashing Grounds (BNSS)', query: 'Map grounds for quashing FIR based on Landmark Precedents vs specific BNS allegations.' },
        { title: 'Custody Strategy', query: 'Analyze police vs judicial custody duration limits under new BNSS provisions.' }
      ];
    } else if (isWrit) {
      tacticalPrompts = [
        { title: 'Administrative Overreach', query: 'Grounds for certiorari to quash a perverse administrative order.' },
        { title: 'Mandamus Action', query: 'Drafting a Writ of Mandamus for statutory performance by public authority.' },
        { title: 'Stay Strategy', query: 'Analyze grounds for ex-parte ad-interim relief in Constitutional matters.' }
      ];
    } else {
      tacticalPrompts = [
        { title: 'Order 39 Relief', query: 'Grounds for temporary injunction: Balance of Convenience and Irreparable Loss analysis.' },
        { title: 'Summary Suit Check', query: 'Feasibility of Order 37 summary procedure for commercial recovery.' },
        { title: 'Arbitration Interim', query: 'Section 9 interim protection strategy during pending arbitration.' }
      ];
    }
    setSuggestions(tacticalPrompts);
  }, [activeMatterId, matters]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const newAttachments = await Promise.all(files.map(async (f: File) => ({
        name: f.name,
        content: await documentService.extractText(f)
      })));
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Attachment Error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const parseConfidence = (content: string) => {
    const scoreMatch = content.match(/\[CONFIDENCE_SCORE\]:\s*(\d+)%/);
    const basisMatch = content.match(/\[LEGAL_BASIS\]:\s*([\s\S]*?)$/);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      basis: basisMatch ? basisMatch[1].trim() : '',
      cleanedContent: content.split('[CONFIDENCE_SCORE]')[0].trim()
    };
  };

  const handleAction = async () => {
    setIsLoading(true);
    let result = '';
    const docContexts = attachments.map(a => a.content);
    
    try {
      if (mode === 'Strategy') {
        result = await suggestLitigationStrategy(facts || purpose, docContexts) || "No strategy generated.";
      } else {
        const m = matters.find(matter => matter.id === activeMatterId);
        result = await generateHearingBrief(m?.title || 'Selected Case', facts, purpose, docContexts) || "No brief generated.";
      }
      
      const { score, basis, cleanedContent } = parseConfidence(result);
      setOutput(cleanedContent);
      setConfidence({ score, basis });
      setActiveTab('Intelligence');
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setOutput("Neural synchronization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const injectSuggestion = (s: {title: string, query: string}) => {
    setPurpose(s.query);
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { 
      label: 'Settled Doctrine', 
      color: 'text-emerald-600 bg-emerald-50', 
      dot: 'bg-emerald-500', 
      risk: 'LOW',
      desc: 'Based on stable statutory language and binding precedent.'
    };
    if (score >= 65) return { 
      label: 'Procedural Strength', 
      color: 'text-indigo-600 bg-indigo-50', 
      dot: 'bg-indigo-500', 
      risk: 'MODERATE',
      desc: 'Significant procedural grounds identified with persuasive support.'
    };
    return { 
      label: 'Tactical Pivot', 
      color: 'text-amber-600 bg-amber-50', 
      dot: 'bg-amber-500', 
      risk: 'ELEVATED',
      desc: 'Complex factual mapping requiring novel legal interpretation.'
    };
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700 pb-20 px-1 sm:px-0 overflow-y-auto custom-scrollbar">
      <header className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 legal-serif tracking-tight">Litigation Intelligence Lab</h2>
          <p className="text-slate-500 font-medium mt-1">High-fidelity tactical synthesis grounded in Constitutional and Statutory foundations.</p>
        </div>
        <div className="flex bg-slate-200/50 p-1 rounded-2xl self-start sm:self-center shadow-inner border border-slate-100">
           <button onClick={() => {setMode('Strategy'); setOutput(null); setConfidence(null);}} className={`px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${mode === 'Strategy' ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>Tactical Builder</button>
           <button onClick={() => {setMode('Brief'); setOutput(null); setConfidence(null);}} className={`px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${mode === 'Brief' ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>Hearing Memo</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT PANEL */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-center mb-8">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                   <span className="h-1 w-4 bg-indigo-500 rounded-full"></span> Neural Tactical Feed
                </h4>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              </div>
              <div className="space-y-4 relative z-10">
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => injectSuggestion(s)}
                    className="w-full p-5 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/40 rounded-3xl text-left transition-all group/btn"
                  >
                    <p className="text-xs font-bold text-white group-hover/btn:text-indigo-400 transition-colors leading-relaxed">{s.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Template</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
           </div>

           <div className="bg-white rounded-[3.5rem] border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8 relative overflow-hidden">
              <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contextual Matter</label>
                    <select 
                      value={activeMatterId}
                      onChange={(e) => setActiveMatterId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                    >
                      {matters.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{mode === 'Brief' ? 'Hearing Objective' : 'Strategic Goal'}</label>
                    <input 
                      type="text" 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder={mode === 'Brief' ? "e.g., Final Arguments on Bail" : "e.g., Commercial Suit Maintenance"}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Factual Matrix (Primary Grounds)</label>
                    <textarea 
                      value={facts}
                      onChange={(e) => setFacts(e.target.value)}
                      placeholder="Synthesize the factual core of the matter to align with specific statutes..."
                      className="w-full h-48 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium outline-none resize-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all leading-relaxed"
                    />
                </div>

                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evidentiary Attachments</label>
                   <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} accept=".txt,.pdf" />
                   <div className="space-y-3">
                      {attachments.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl group animate-in slide-in-from-left-2">
                           <div className="flex items-center space-x-3 truncate">
                              <span className="text-indigo-600 shrink-0"><ICONS.Attachment /></span>
                              <span className="text-[11px] font-bold text-indigo-900 truncate">{a.name}</span>
                           </div>
                           <button onClick={() => removeAttachment(i)} className="text-indigo-300 hover:text-red-500 shrink-0 transition-colors p-1">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                           </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-5 border-2 border-dashed border-slate-100 rounded-3xl text-[10px] font-bold text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        <ICONS.Upload /> GROUND WITH DOCUMENTS
                      </button>
                   </div>
                </div>

                <button
                    onClick={handleAction}
                    disabled={isLoading || (!facts.trim() && !purpose.trim())}
                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-2xl hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-30 transition-all mt-4 relative overflow-hidden group/run"
                >
                    <span className="relative z-10">{isLoading ? "Synchronizing Jurisprudence..." : `RUN TACTICAL SYNTHESIS`}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/run:animate-[shimmer_2s_infinite]"></div>
                </button>
              </div>
           </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px] lg:h-auto" ref={resultsRef}>
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative h-full">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-indigo-900 to-slate-900"></div>
              
              {!output && !isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-8 opacity-20">
                   <div className="h-32 w-32 bg-slate-100 rounded-[3rem] flex items-center justify-center scale-110">
                      <ICONS.Gavel />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-900">Intelligence Terminal</h3>
                      <p className="text-xs max-w-sm font-bold leading-[2] text-slate-500 uppercase tracking-widest">Awaiting Factual Matrix to initiate grounding against SC/HC legal graph.</p>
                   </div>
                </div>
              ) : isLoading ? (
                <div className="flex-1 p-10 sm:p-20 space-y-12 animate-pulse">
                   <div className="flex justify-between items-center">
                      <div className="h-10 bg-slate-100 rounded-2xl w-1/3"></div>
                      <div className="h-8 bg-slate-100 rounded-full w-24"></div>
                   </div>
                   <div className="space-y-6">
                     <div className="h-5 bg-slate-50 rounded-lg w-full"></div>
                     <div className="h-5 bg-slate-50 rounded-lg w-full"></div>
                     <div className="h-5 bg-slate-50 rounded-lg w-5/6"></div>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="h-40 bg-slate-50 rounded-[3rem]"></div>
                      <div className="h-40 bg-slate-50 rounded-[3rem]"></div>
                   </div>
                   <div className="h-20 bg-indigo-50/30 rounded-3xl"></div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Result Header */}
                  <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Strategy Finalized</span>
                       </div>
                       <div className="h-4 w-px bg-slate-200"></div>
                       <div className="flex gap-1.5">
                          {['Intelligence', 'Roadmap', 'Precedents'].map((tab: any) => (
                            <button 
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200/50'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth={2}/></svg>
                       </button>
                       <button 
                         onClick={() => output && navigator.clipboard.writeText(output)}
                         className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                       >
                          Copy Report
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 sm:p-20 custom-scrollbar">
                    
                    {activeTab === 'Intelligence' && (
                      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Summary Visualization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                           <div className="bg-slate-50 border border-slate-100 p-8 rounded-[3rem] relative overflow-hidden group">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Probability of Success</h4>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-6xl font-bold text-slate-900 tracking-tighter">{confidence?.score}%</span>
                                 <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Optimized</span>
                              </div>
                              <div className="mt-8 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${confidence?.score}%` }}></div>
                              </div>
                              <p className="text-[9px] text-slate-400 mt-4 font-bold uppercase italic leading-relaxed">Synthesized via Bayesian Statutory inference models.</p>
                           </div>
                           
                           <div className="bg-indigo-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">Tactical Risk Assessment</h4>
                              <div className="flex items-baseline gap-4">
                                 <span className="text-4xl font-bold tracking-tight">{getConfidenceLevel(confidence?.score || 0).risk}</span>
                                 <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">Status Code</span>
                              </div>
                              <div className="mt-8 flex items-center gap-3">
                                 <div className={`h-4 w-4 rounded-full ${getConfidenceLevel(confidence?.score || 0).dot} animate-pulse`}></div>
                                 <p className="text-[11px] font-bold leading-relaxed">{getConfidenceLevel(confidence?.score || 0).desc}</p>
                              </div>
                              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-[1.7] group-hover:rotate-0 duration-700">
                                 <ICONS.Gavel />
                              </div>
                           </div>
                        </div>

                        {/* Core Content */}
                        <div className="prose prose-slate max-w-none mb-20 selection:bg-indigo-100">
                           <div className="flex items-center gap-4 mb-10">
                              <h3 className="text-3xl font-bold legal-serif text-slate-900 m-0">Strategic Decree</h3>
                              <div className="h-px flex-1 bg-slate-100"></div>
                           </div>
                           <div className="whitespace-pre-wrap font-medium text-slate-700 text-lg leading-[2] tracking-tight">
                              {output}
                           </div>
                        </div>

                        {/* Detailed Legal Basis (Previous Expandable Refined) */}
                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                           <div className="flex justify-between items-center relative z-10">
                             <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Statutory Basis & Grounding Report</h4>
                             <span className="text-[8px] font-bold text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 tracking-widest">Full Audit Trace</span>
                           </div>
                           <div className="relative z-10 p-8 bg-white/5 border border-white/5 rounded-[2rem] text-sm leading-[2] text-slate-300 italic font-medium whitespace-pre-wrap">
                              {confidence?.basis}
                           </div>
                           <div className="relative z-10 flex items-center gap-6 pt-4 border-t border-white/5">
                              <div className="flex -space-x-3">
                                 <div className="h-8 w-8 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">SC</div>
                                 <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">HC</div>
                                 <div className="h-8 w-8 rounded-full bg-indigo-900 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">Gaz</div>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sources verified across 1.2M Case Law records.</p>
                           </div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/5 blur-[100px] pointer-events-none"></div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Roadmap' && (
                      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 py-10 max-w-2xl mx-auto space-y-12">
                         <div className="text-center space-y-4 mb-16">
                            <h3 className="text-3xl font-bold legal-serif">Procedural Trajectory</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visualizing the path of litigation</p>
                         </div>
                         
                         <div className="relative space-y-16 pl-10 border-l-2 border-slate-100">
                            {[
                              { step: "Initial Filing & Registry Review", desc: "Alignment of Cause Title and primary grounds as per statutory mandates.", status: "COMPLETE" },
                              { step: "Ex-Parte Arguments / Admission", desc: "Focus on maintainability and establishment of Prima Facie case.", status: "UPCOMING" },
                              { step: "Interim Relief / Stay Application", desc: "Establishing balance of convenience and urgency factors.", status: "CRITICAL" },
                              { step: "Final Disposal & Oral Submission", desc: "Synthesized argument closure grounded in final case citations.", status: "TARGET" }
                            ].map((item, idx) => (
                              <div key={idx} className="relative group">
                                 <div className={`absolute -left-[51px] top-0 h-10 w-10 rounded-2xl flex items-center justify-center ring-8 ring-white shadow-xl transition-all duration-500 group-hover:scale-110 ${
                                   item.status === 'COMPLETE' ? 'bg-emerald-600 text-white' : 
                                   item.status === 'CRITICAL' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
                                 }`}>
                                    {idx + 1}
                                 </div>
                                 <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
                                   item.status === 'CRITICAL' ? 'bg-indigo-50 border-indigo-200 shadow-lg scale-[1.02]' : 'bg-white border-slate-100 group-hover:border-indigo-200 group-hover:shadow-md'
                                 }`}>
                                    <div className="flex justify-between items-start mb-2">
                                       <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.step}</h5>
                                       <span className={`text-[8px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest ${
                                         item.status === 'COMPLETE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                         item.status === 'CRITICAL' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'
                                       }`}>{item.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                         <button className="w-full py-5 bg-white border-2 border-slate-100 rounded-3xl text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all uppercase tracking-widest">
                            Export Procedural Map (PDF)
                         </button>
                      </div>
                    )}

                    {activeTab === 'Precedents' && (
                      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
                         <div className="flex items-center gap-6 mb-12">
                            <h3 className="text-3xl font-bold legal-serif text-slate-900 m-0">Citation Dossier</h3>
                            <div className="h-px flex-1 bg-slate-100"></div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* In a real app, we would parse citations from output. For now, we simulate cards based on mode */}
                            {[
                               { title: "Neeharika Infrastructure v. State of Maharashtra", cite: "2021 SCC OnLine SC 315", court: "Supreme Court", role: "BINDING" },
                               { title: "Satender Kumar Antil v. CBI", cite: "(2022) 10 SCC 51", court: "Supreme Court", role: "CRITICAL" },
                               { title: "Lalita Kumari v. State of U.P.", cite: "(2014) 2 SCC 1", court: "Supreme Court", role: "PROCEDURAL" },
                               { title: "Arnesh Kumar v. State of Bihar", cite: "(2014) 8 SCC 273", court: "Supreme Court", role: "BINDING" }
                            ].map((cite, i) => (
                              <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
                                 <div className="flex justify-between items-start mb-6">
                                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{cite.role}</span>
                                    <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2.5}/></svg>
                                    </div>
                                 </div>
                                 <h5 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">{cite.title}</h5>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">{cite.cite}</p>
                                 <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{cite.court}</span>
                                    <button className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest group-hover:underline">Full Text →</button>
                                 </div>
                              </div>
                            ))}
                         </div>
                         
                         <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-100 flex flex-col md:flex-row items-center gap-10">
                            <div className="h-20 w-20 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center text-3xl">⚠️</div>
                            <div className="flex-1 text-center md:text-left">
                               <h4 className="text-xl font-bold legal-serif text-amber-900 mb-2">Cross-Reference Required</h4>
                               <p className="text-amber-700 text-xs font-medium leading-relaxed">Citations are probabilistic. Verify latest overruled/distinguished status in official High Court Gazette records before formal filing.</p>
                            </div>
                            <button className="px-8 py-4 bg-amber-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Start Verify</button>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
      
      {/* Action Footer */}
      <footer className="shrink-0 flex items-center justify-center py-10 opacity-30">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">Vidhi Neural Engine • Secure Strategic Layer • ISO 27001 Grounded</p>
      </footer>
    </div>
  );
};

export default StrategyAssistant;
