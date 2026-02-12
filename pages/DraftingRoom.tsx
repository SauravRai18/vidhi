
import React, { useState, useEffect } from 'react';
import { generateEnterpriseDraft, getReliefIntelligence } from '../services/gemini';
import { matterService } from '../services/matterService';
import { db } from '../services/db';
import { Matter, Draft } from '../types';
import { ICONS } from '../constants';

const DraftingRoom: React.FC = () => {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [activeMatterId, setActiveMatterId] = useState<string>('default');
  const [formData, setFormData] = useState({
    type: 'Bail Application (Sec 439 BNSS)',
    parties: '',
    subject: '',
    details: '',
    court: 'Delhi High Court'
  });
  const [draft, setDraft] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [intelligence, setIntelligence] = useState<string | null>(null);

  useEffect(() => {
    setMatters(matterService.getMatters());
  }, []);

  const handleGenerate = async () => {
    setIsProcessing(true);
    const result = await generateEnterpriseDraft(formData);
    const text = result || '';
    setDraft(text);
    setIsProcessing(false);

    const newDraft: Draft = {
      id: `dr_${Math.random().toString(36).substr(2, 9)}`,
      matterId: activeMatterId,
      firmId: db.getFirmId(),
      title: formData.type,
      type: formData.type,
      content: text,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    db.saveDraft(newDraft);
    setDraftId(newDraft.id);
    matterService.updateLastAccessed(activeMatterId);
  };

  const getIntelligence = async () => {
    if (!formData.details) return;
    setIsProcessing(true);
    const res = await getReliefIntelligence(formData.details, formData.court);
    setIntelligence(res || "Unable to generate intelligence.");
    setIsProcessing(false);
  };

  const handleManualSave = () => {
    if (!draft || !draftId) return;
    const existingDraft = db.getDrafts().find(d => d.id === draftId);
    if (existingDraft) {
      const updated: Draft = {
        ...existingDraft,
        content: draft,
        updatedAt: Date.now(),
        version: existingDraft.version + 1
      };
      db.saveDraft(updated);
      alert("Draft version " + updated.version + " saved to cloud.");
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 legal-serif">Drafting Studio</h2>
          <p className="text-slate-500 font-medium">Court-compliant pleading generator with statutory intelligence.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={getIntelligence}
             className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
           >Section Intelligence</button>
           <button 
             onClick={handleManualSave}
             className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xl"
           >Save Draft</button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
           {/* Form */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Matter Context</label>
                <select 
                  value={activeMatterId}
                  onChange={(e) => setActiveMatterId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                >
                  <option value="default">General Case</option>
                  {matters.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurisdiction</label>
                <input 
                  type="text" 
                  value={formData.court}
                  onChange={(e) => setFormData({...formData, court: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Pleading Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none"
                >
                  <option>Bail Application (Sec 439 BNSS)</option>
                  <option>Writ Petition (Art 226)</option>
                  <option>Civil Suit (Recovery)</option>
                  <option>Rejoinder / Reply</option>
                  <option>Vaklatnama & Affidavit</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Facts of Case</label>
                <textarea 
                  rows={6}
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  placeholder="Summarize facts to generate mapping..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200"
              >
                {isProcessing ? "Processing..." : "Generate Master Draft"}
              </button>
           </div>

           {/* AI Intelligence Card */}
           {intelligence && (
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl animate-in slide-in-from-bottom-4">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Statutory Strategy</h4>
                <div className="prose prose-invert prose-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {intelligence}
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-8 flex flex-col space-y-4 overflow-hidden">
           <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-900"></div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="flex-1 p-12 sm:p-20 overflow-y-auto bg-white font-serif text-sm sm:text-base leading-[2] text-slate-800 whitespace-pre-wrap selection:bg-indigo-100 custom-scrollbar border-none resize-none outline-none"
                placeholder="Initialize Parameters to Begin Court Drafting"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DraftingRoom;
