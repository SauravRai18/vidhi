
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Matter } from '../types';
import { getAdvancedResearchStream } from '../services/gemini';
import { documentService } from '../services/documentService';
import { matterService } from '../services/matterService';
import { db } from '../services/db';
import { GenerateContentResponse } from '@google/genai';
import { ICONS } from '../constants';

interface Attachment {
  name: string;
  content: string;
}

const ChatAssistant: React.FC = () => {
  const [activeMatterId, setActiveMatterId] = useState<string>('default');
  const [matters, setMatters] = useState<Matter[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citations, setCitations] = useState<{title: string, uri: string}[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [expandedBasis, setExpandedBasis] = useState<Record<string, boolean>>({});
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMatters(matterService.getMatters());
    const history = db.getChatHistory(activeMatterId);
    if (history.length > 0) {
      setMessages(history);
    } else {
      setMessages([{
        id: 'init',
        role: 'model',
        firmId: db.getFirmId(),
        matterId: activeMatterId,
        content: "Vidhi AI Intelligence Hub Active. Select a Matter or start a generic research session. Attach case files to ground the model in your specific facts.",
        timestamp: Date.now()
      }]);
    }
  }, [activeMatterId]);

  useEffect(() => {
    if (messages.length > 0) {
      db.saveChatHistory(activeMatterId, messages);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const toggleBasis = (msgId: string) => {
    setExpandedBasis(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const parseConfidence = (content: string) => {
    const scoreMatch = content.match(/\[CONFIDENCE_SCORE\]:\s*(\d+)%/);
    const basisMatch = content.match(/\[LEGAL_BASIS\]:\s*([\s\S]*?)$/);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
      basis: basisMatch ? basisMatch[1].trim() : undefined,
      cleanedContent: content.split('[CONFIDENCE_SCORE]')[0].trim()
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      firmId: db.getFirmId(),
      matterId: activeMatterId,
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCitations([]);

    const history = messages.map(m => ({ role: m.role, text: m.content }));
    const docContexts = attachments.map(a => a.content);

    try {
      const stream = await getAdvancedResearchStream(history, input, docContexts.length > 0 ? docContexts : undefined);
      let botResponse = "";
      const botMsgId = `bot_${Date.now()}`;
      
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', firmId: db.getFirmId(), matterId: activeMatterId, content: "", timestamp: Date.now() }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;

        const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          const links = chunks.map((ch: any) => ({
            title: ch.web?.title || 'Case Law Authority',
            uri: ch.web?.uri
          })).filter((l: any) => l.uri);
          
          setCitations(prev => {
            const uris = new Set(prev.map(p => p.uri));
            const unique = links.filter(l => !uris.has(l.uri));
            return [...prev, ...unique];
          });
        }

        if (text) {
          botResponse += text;
          const { score, basis, cleanedContent } = parseConfidence(botResponse);
          
          setMessages(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(m => m.id === botMsgId);
            if (idx !== -1) {
              copy[idx] = { 
                ...copy[idx], 
                content: cleanedContent,
                confidenceScore: score,
                legalBasisSummary: basis
              };
            }
            return copy;
          });
        }
      }
      matterService.updateLastAccessed(activeMatterId);
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'model', firmId: db.getFirmId(), matterId: activeMatterId, content: "Neural synchronization error. Please re-initiate the query.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { label: 'Settled Law', color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500', desc: 'Grounded in binding Supreme Court precedent and clear statutory wording.' };
    if (score >= 70) return { label: 'Persuasive Authority', color: 'text-indigo-600 bg-indigo-50', dot: 'bg-indigo-500', desc: 'Supported by High Court rulings or persuasive interpretations.' };
    if (score >= 40) return { label: 'Argueable Strategy', color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500', desc: 'Involves interpretation of evolving law or complex factual mapping.' };
    return { label: 'Exploratory Logic', color: 'text-rose-600 bg-rose-50', dot: 'bg-rose-500', desc: 'Novel legal theory with limited direct precedent.' };
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 sm:gap-8 animate-in fade-in duration-500 overflow-hidden px-1 sm:px-0">
      <div className="flex-1 flex flex-col bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden relative min-h-0">
        <div className="px-5 sm:px-8 py-4 sm:py-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-white/10 z-10">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
             <div className="hidden xs:flex h-8 w-8 sm:h-10 sm:w-10 bg-indigo-600 rounded-lg sm:rounded-xl items-center justify-center text-base sm:text-xl shadow-lg shrink-0">⚖️</div>
             <div className="min-w-0 flex-1">
                <select 
                  value={activeMatterId}
                  onChange={(e) => setActiveMatterId(e.target.value)}
                  className="bg-transparent text-sm sm:text-lg font-bold outline-none border-none cursor-pointer text-white w-full truncate"
                >
                  <option value="default" className="text-slate-900">General Research Lab</option>
                  {matters.map(m => (
                    <option key={m.id} value={m.id} className="text-slate-900">{m.title}</option>
                  ))}
                </select>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                   <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                   <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] truncate">Neural Jurisprudence Core</span>
                </div>
             </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">Grounding: ENABLED</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-12 bg-slate-50/20 custom-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[95%] xs:max-w-[85%] sm:max-w-[80%] group relative ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-[1.5rem] sm:rounded-[2rem] rounded-tr-none p-4 sm:p-6 shadow-xl shadow-indigo-600/10' 
                  : 'bg-white text-slate-800 rounded-[1.5rem] sm:rounded-[2rem] rounded-tl-none p-5 sm:p-8 shadow-sm border border-slate-100'
              }`}>
                {msg.role === 'model' && msg.content && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => copyToClipboard(msg.content)}
                      className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 border border-slate-100 transition-colors"
                      title="Copy Core Content"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth={2}/></svg>
                    </button>
                  </div>
                )}

                {msg.role === 'model' && msg.confidenceScore !== undefined && msg.confidenceScore >= 90 && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit border border-emerald-100 animate-in fade-in slide-in-from-left-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Verified Statutory Alignment</span>
                    </div>
                )}

                <div className="prose prose-slate prose-sm sm:prose-base max-w-none leading-[1.8] whitespace-pre-wrap font-medium text-inherit">
                  {msg.content}
                </div>
                
                {msg.role === 'model' && msg.confidenceScore !== undefined && (
                  <div className="mt-10 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-3">
                    <div className="bg-slate-50/50 rounded-[2rem] p-5 sm:p-8 border border-slate-200/60 space-y-6 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div className="flex flex-col gap-1 group relative">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 cursor-help">
                                  Intelligence Metric
                                  <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2.5}/></svg>
                                </span>
                            </div>
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Probabilistic Certainty Index</p>
                            
                            {/* Hover Tooltip for Metric Explanation */}
                            <div className="absolute bottom-full left-0 mb-4 w-72 p-5 bg-slate-900 text-white text-[10px] font-medium leading-relaxed rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl scale-95 origin-bottom-left group-hover:scale-100 border border-white/10 backdrop-blur-xl">
                               <div className="flex items-center gap-2 mb-3">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                  <p className="font-bold text-indigo-400 uppercase tracking-widest text-[9px]">Confidence Scoring Logic</p>
                               </div>
                               <p className="mb-2">Our neural engine analyzes three primary vectors to determine this score:</p>
                               <ul className="space-y-1.5 list-disc pl-3 opacity-80">
                                  <li><span className="text-white font-bold">Binding Precedent:</span> Proximity to latest SC/HC rulings.</li>
                                  <li><span className="text-white font-bold">Statutory Clarity:</span> Unambiguity of relevant BNS/BNSS/CPC sections.</li>
                                  <li><span className="text-white font-bold">Fact Alignment:</span> Semantic overlap with attached case documents.</li>
                               </ul>
                            </div>
                         </div>
                         
                         {(() => {
                            const level = getConfidenceLevel(msg.confidenceScore!);
                            return (
                              <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-current/10 ${level.color} shadow-sm group/badge relative transition-all hover:scale-105 cursor-default`}>
                                 <span className={`h-2 w-2 rounded-full ${level.dot} animate-pulse`}></span>
                                 <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">{level.label} • {msg.confidenceScore}%</span>
                                 
                                 <div className="absolute top-full right-0 mt-3 w-56 p-4 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold leading-relaxed rounded-2xl opacity-0 group-hover/badge:opacity-100 transition-all shadow-2xl z-10 pointer-events-none translate-y-2 group-hover/badge:translate-y-0">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-1 w-8 bg-slate-200 rounded-full"></div>
                                        {level.desc}
                                    </div>
                                 </div>
                              </div>
                            );
                         })()}
                      </div>

                      <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner relative">
                           <div 
                             className={`h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.15)] ${
                               msg.confidenceScore! > 85 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                               msg.confidenceScore! > 65 ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' : 
                               msg.confidenceScore! > 40 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'
                             }`} 
                             style={{ width: `${msg.confidenceScore}%` }}
                           />
                        </div>
                        <div className="flex justify-between px-1">
                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Limited Context</span>
                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Settled Jurisprudence</span>
                        </div>
                      </div>
                      
                      {msg.legalBasisSummary && (
                        <div className="pt-4">
                          <button 
                            onClick={() => toggleBasis(msg.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                              expandedBasis[msg.id] 
                                ? 'bg-white border-indigo-200 shadow-md translate-y-[-2px]' 
                                : 'bg-white/40 border-slate-200 hover:bg-white hover:border-indigo-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${expandedBasis[msg.id] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth={2.5}/></svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">Legal Foundation & Precedents</span>
                            </div>
                            <div className={`transition-transform duration-300 ${expandedBasis[msg.id] ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={3} /></svg>
                            </div>
                          </button>
                          
                          {expandedBasis[msg.id] && (
                            <div className="mt-4 p-6 bg-white rounded-3xl border border-indigo-100 shadow-xl animate-in slide-in-from-top-3 duration-500 overflow-hidden relative group/basis">
                               <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600/20 group-hover/basis:bg-indigo-600 transition-colors"></div>
                               <div className="space-y-6">
                                  <div className="flex items-center justify-between">
                                     <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Citations & Statutory Grounding:</span>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(msg.legalBasisSummary || ''); }}
                                        className="text-[8px] font-bold text-slate-300 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1.5"
                                     >
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth={2}/></svg>
                                        Copy Summary
                                     </button>
                                  </div>
                                  <div className="text-[12px] text-slate-700 font-medium leading-[1.8] italic whitespace-pre-wrap pl-2 border-l border-slate-100">
                                     {msg.legalBasisSummary}
                                  </div>
                                  <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                                     <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Research synthesized from verified Indian statutory corpus.</p>
                                  </div>
                               </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className={`text-[8px] sm:text-[9px] mt-6 font-bold opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Secure Neural Terminal
                </div>
              </div>
            </div>
          ))}
          {isLoading && (!messages.length || !messages[messages.length-1].content) && (
            <div className="flex justify-start">
               <div className="bg-white p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] rounded-tl-none shadow-sm border border-slate-100 flex items-center space-x-4">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Counsel is researching statutes...</span>
               </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-8 bg-white border-t border-slate-100 shrink-0">
          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 animate-in slide-in-from-bottom-2">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl group hover:border-indigo-300 transition-colors">
                  <span className="text-indigo-600 mr-2"><ICONS.Attachment /></span>
                  <span className="text-[9px] font-bold text-indigo-900 max-w-[120px] truncate">{file.name}</span>
                  <button onClick={() => removeAttachment(i)} className="ml-2 text-indigo-300 hover:text-red-500 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end space-x-2 sm:space-x-4 bg-slate-50 p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-inner">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
              multiple
              accept=".txt,.pdf"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 sm:p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl sm:rounded-2xl transition-all shadow-sm"
              title="Add Evidence"
            >
              <ICONS.Attachment />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Query statutes, case laws, or map procedures..."
              className="flex-1 p-3 sm:p-4 text-xs sm:text-sm bg-transparent outline-none resize-none h-12 sm:h-16 max-h-32 sm:max-h-48 font-medium placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-slate-900 text-white p-3 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-20"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden xl:flex w-80 shrink-0 flex-col gap-8 h-full">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 h-full flex flex-col overflow-hidden">
           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center shrink-0">
             <span className="h-1 w-6 bg-indigo-500 mr-3 rounded-full"></span> Legal Authority Feed
           </h4>
           <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
             {citations.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-30">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">Research nodes will appear as authority is identified.</p>
               </div>
             ) : citations.map((cite, i) => (
               <a 
                 key={i} 
                 href={cite.uri} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="block p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-400 hover:bg-white transition-all group shadow-sm hover:shadow-md"
               >
                 <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">{cite.title}</h5>
                 <div className="mt-3 flex items-center text-[8px] font-bold text-indigo-500 uppercase tracking-widest opacity-60 group-hover:opacity-100">
                   Primary Source <svg className="ml-1.5 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                 </div>
               </a>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
