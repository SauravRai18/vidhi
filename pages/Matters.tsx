
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../services/db';
import { api } from '../services/api';
import { matterService } from '../services/matterService';
import { knowledgeBase } from '../services/knowledgeBase';
import { documentService } from '../services/documentService';
import { Matter, Client, LegalDocument, Draft, Hearing } from '../types';
import { ICONS } from '../constants';

const MattersPage: React.FC = () => {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const [newMatter, setNewMatter] = useState({
    title: '',
    clientId: '',
    court: 'High Court of Delhi',
    caseNumber: '',
    tags: ''
  });

  const refresh = () => {
    setMatters(db.getMatters());
    setClients(db.getClients());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = () => {
    if (!newMatter.title || !newMatter.clientId) return;
    const tagList = newMatter.tags.split(',').map(t => t.trim()).filter(t => t !== '');
    matterService.createMatter({
      ...newMatter,
      tags: tagList.length > 0 ? tagList : ['Active']
    });
    refresh();
    setShowModal(false);
    setNewMatter({ title: '', clientId: '', court: 'High Court of Delhi', caseNumber: '', tags: '' });
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    matters.forEach(m => m.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [matters]);

  const filtered = matters.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                         m.caseNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || m.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (selectedMatter) {
    return <MatterDetail matter={selectedMatter} onBack={() => { setSelectedMatter(null); refresh(); }} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 legal-serif tracking-tight">Practice Registry</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Enterprise dossier management for active litigation.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-[1.2rem] font-bold text-xs sm:text-sm shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
        >
          New Matter File
        </button>
      </header>

      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 space-y-4">
           <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                 <input 
                   type="text" 
                   placeholder="Search dossiers..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full pl-12 sm:pl-14 pr-6 sm:pr-8 py-3 sm:py-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                 />
                 <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2.5} /></svg>
                 </div>
              </div>
           </div>
           
           {allTags.length > 0 && (
             <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Filter:</span>
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${!selectedTag ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${selectedTag === tag ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    {tag}
                  </button>
                ))}
             </div>
           )}
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 sm:px-10 py-4 sm:py-5">Matter Identity</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5">Client / Mandate</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5">Jurisdiction</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5">Status</th>
                <th className="px-6 sm:px-10 py-4 sm:py-5">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => (
                <tr 
                  key={m.id} 
                  onClick={() => setSelectedMatter(m)}
                  className="hover:bg-indigo-50/50 transition-all group cursor-pointer"
                >
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                     <div className="flex flex-col gap-1">
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">{m.title}</p>
                        <div className="flex flex-wrap items-center gap-2">
                           <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.caseNumber || 'NO_REF_ASSIGNED'}</span>
                           {m.tags?.map(t => (
                             <span key={t} className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">{t}</span>
                           ))}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                     <p className="text-xs sm:text-sm font-bold text-slate-700">{clients.find(c => c.id === m.clientId)?.name || 'Direct Mandate'}</p>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                     <p className="text-[10px] sm:text-xs font-bold text-slate-500">{m.court}</p>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                     <span className={`text-[8px] sm:text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest ${
                       m.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                     }`}>
                       {m.status.replace('_', ' ')}
                     </span>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                     <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update recorded</p>
                     <p className="text-[10px] sm:text-xs font-bold text-slate-900">{new Date(m.updatedAt).toLocaleDateString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
              <div className="p-6 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl sm:text-2xl font-bold text-slate-900 legal-serif">Registration</h3>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                 </button>
              </div>
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                 <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formal Title</label>
                    <input 
                      type="text" 
                      value={newMatter.title}
                      onChange={(e) => setNewMatter({...newMatter, title: e.target.value})}
                      placeholder="e.g. State vs. XYZ"
                      className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all text-xs sm:text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign Client</label>
                    <select 
                      value={newMatter.clientId}
                      onChange={(e) => setNewMatter({...newMatter, clientId: e.target.value})}
                      className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:bg-white font-bold text-xs sm:text-sm"
                    >
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forum</label>
                      <input 
                        type="text" 
                        value={newMatter.court}
                        onChange={(e) => setNewMatter({...newMatter, court: e.target.value})}
                        className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none font-bold text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case No.</label>
                      <input 
                        type="text" 
                        value={newMatter.caseNumber}
                        onChange={(e) => setNewMatter({...newMatter, caseNumber: e.target.value})}
                        className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none font-bold text-xs sm:text-sm"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={newMatter.tags}
                      onChange={(e) => setNewMatter({...newMatter, tags: e.target.value})}
                      placeholder="e.g. Criminal, Urgent, Bail"
                      className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:bg-white font-bold text-xs sm:text-sm"
                    />
                 </div>
              </div>
              <div className="p-6 sm:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-6">
                 <button onClick={() => setShowModal(false)} className="flex-1 font-bold text-slate-400 uppercase text-[10px] sm:text-xs tracking-widest hover:text-slate-600 transition-colors py-3">Cancel</button>
                 <button onClick={handleCreate} className="flex-[2] py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold shadow-2xl hover:bg-indigo-600 transition-all text-xs sm:text-sm">Initialize Dossier</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MatterDetail: React.FC<{ matter: Matter, onBack: () => void }> = ({ matter, onBack }) => {
  const [currentMatter, setCurrentMatter] = useState<Matter>(matter);
  const [docs, setDocs] = useState<LegalDocument[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [activeTab, setActiveTab] = useState<'Dossier' | 'Evidence' | 'Pleadings' | 'Board'>('Dossier');
  
  // Modals for linking existing files
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showLinkDocModal, setShowLinkDocModal] = useState(false);
  const [showLinkDraftModal, setShowLinkDraftModal] = useState(false);
  
  const [unlinkedDocs, setUnlinkedDocs] = useState<LegalDocument[]>([]);
  const [unlinkedDrafts, setUnlinkedDrafts] = useState<Draft[]>([]);
  
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    setDocs(db.documents.all().filter(d => d.matterId === matter.id));
    setDrafts(db.getDrafts(matter.id));
    setHearings(db.getHearings(matter.id).sort((a, b) => a.date - b.date));
    
    setUnlinkedDocs(db.getUnlinkedDocuments());
    setUnlinkedDrafts(db.getUnlinkedDrafts());
  };

  useEffect(() => {
    refreshData();
  }, [matter.id]);

  const consolidatedActivity = useMemo(() => {
    const activity = [
      ...docs.map(d => ({ type: 'DOC', date: d.createdAt, data: d, label: 'Document Linked' })),
      ...drafts.map(d => ({ type: 'DRAFT', date: d.updatedAt, data: d, label: 'Pleading Modified' })),
      ...hearings.map(h => ({ type: 'HEARING', date: h.date, data: h, label: 'Hearing Listed' }))
    ];
    return activity.sort((a, b) => b.date - a.date);
  }, [docs, drafts, hearings]);

  const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const doc = await knowledgeBase.ingest(file, 'Evidence', ['Manual_Link', ...currentMatter.tags]);
      await api.matters.linkDocument(currentMatter.id, doc.id);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const linkExistingDoc = async (docId: string) => {
    await api.matters.linkDocument(currentMatter.id, docId);
    refreshData();
    setShowLinkDocModal(false);
  };

  const linkExistingDraft = async (draftId: string) => {
    await api.matters.linkDraft(currentMatter.id, draftId);
    refreshData();
    setShowLinkDraftModal(false);
  };

  const handleCreateDraft = () => {
    if (!newDraftTitle.trim()) return;
    const newDraft: Draft = {
      id: `dr_${Math.random().toString(36).substr(2, 9)}`,
      matterId: currentMatter.id,
      firmId: db.getFirmId(),
      title: newDraftTitle,
      type: 'Linked Draft',
      content: "Initialized from Matter Registry. Proceed to Drafting Studio for AI generation.",
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    db.saveDraft(newDraft);
    setShowDraftModal(false);
    setNewDraftTitle('');
    refreshData();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-700 pb-20 px-1 sm:px-0">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-3 text-indigo-600 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:-translate-x-2 transition-transform">
           <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={3} /></svg>
           Registry Feed
        </button>
        <div className="flex items-center gap-4">
           <div className="text-right hidden xs:block">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Associated Nodes</p>
              <p className="text-xs font-bold text-slate-900">{docs.length + drafts.length + hearings.length} Items Indexed</p>
           </div>
           <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              {docs.length + drafts.length}
           </div>
        </div>
      </div>

      {/* Matter Identity Header */}
      <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap gap-3 items-center">
               <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest">{currentMatter.court}</span>
               <span className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/10 ${
                 currentMatter.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
               }`}>{currentMatter.status}</span>
               <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">{currentMatter.caseNumber || 'DOCKET_PENDING'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold legal-serif leading-tight">{currentMatter.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
               {currentMatter.tags?.map(t => (
                 <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/5 text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-tight">
                    {t}
                 </span>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150">
            <ICONS.Gavel />
         </div>
         <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm overflow-x-auto no-scrollbar">
         {['Dossier', 'Evidence', 'Pleadings', 'Board'].map((tab: any) => (
            <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 min-w-[100px] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                 activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
               }`}
            >
               {tab} {tab === 'Evidence' && `(${docs.length})`} {tab === 'Pleadings' && `(${drafts.length})`}
            </button>
         ))}
      </div>

      <div className="min-h-[500px]">
         {activeTab === 'Dossier' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
               {/* Unified Master Timeline */}
               <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                     <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Consolidated Activity</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                     {consolidatedActivity.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                           <p className="text-4xl mb-6">📂</p>
                           <p className="text-[11px] font-bold uppercase tracking-[0.4em]">Empty Digital Dossier</p>
                        </div>
                     ) : consolidatedActivity.map((act, idx) => (
                        <div key={idx} className="flex gap-8 relative group">
                           <div className="shrink-0 mt-1 relative z-10">
                              <div className={`h-4 w-4 rounded-full ring-4 ring-white shadow-sm transition-all duration-300 ${
                                 act.type === 'HEARING' ? 'bg-amber-500' : act.type === 'DOC' ? 'bg-indigo-500' : 'bg-emerald-500'
                              }`}></div>
                              {idx < consolidatedActivity.length - 1 && <div className="absolute top-6 left-2 w-0.5 h-[calc(100%+2.5rem)] bg-slate-100"></div>}
                           </div>
                           <div className="flex-1 pb-4">
                              <div className="flex justify-between items-start mb-2">
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(act.date).toLocaleDateString()}</span>
                                 <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                                    act.type === 'HEARING' ? 'text-amber-600 bg-amber-50' : act.type === 'DOC' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'
                                 }`}>{act.type}</span>
                              </div>
                              <p className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{(act.data as any).title || (act.data as any).purpose}</p>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{act.label}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Quick Insights Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Metadata</h4>
                     <div className="space-y-4">
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Accessed</p>
                           <p className="text-xs font-bold text-slate-800">{new Date(currentMatter.lastAccessedAt).toLocaleString()}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Creation Date</p>
                           <p className="text-xs font-bold text-slate-800">{new Date(currentMatter.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
                  <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                     <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">Linking Strategy</h4>
                     <p className="text-xs font-bold leading-relaxed opacity-80 mb-6">Link documents from the Firm Library or assimilate generated drafts to keep this dossier audit-ready.</p>
                     <div className="flex gap-3">
                        <button onClick={() => setActiveTab('Evidence')} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all">Assign Docs</button>
                        <button onClick={() => setActiveTab('Pleadings')} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all">Link Drafts</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'Evidence' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-900 legal-serif">Associated Evidence Nodes</h4>
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setShowLinkDocModal(true)}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                     >Link Firm Document</button>
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                     >
                        {isProcessing ? 'Processing...' : 'Upload New Node'}
                     </button>
                     <input type="file" ref={fileInputRef} onChange={handleAddDocument} className="hidden" accept=".txt,.pdf" />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {docs.length === 0 ? (
                     <div className="col-span-full py-20 text-center opacity-30 italic">No evidence nodes assigned to this matter.</div>
                  ) : docs.map(d => (
                     <div key={d.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-400 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                              <ICONS.Summarize />
                           </div>
                           <span className="text-[8px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded uppercase">{d.type}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-relaxed">{d.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Indexed {new Date(d.createdAt).toLocaleDateString()}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeTab === 'Pleadings' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-900 legal-serif">Litigation Drafts & Pleadings</h4>
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setShowLinkDraftModal(true)}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                     >Link Orphan Draft</button>
                     <button 
                        onClick={() => setShowDraftModal(true)}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                     >Initialize New Draft</button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drafts.length === 0 ? (
                     <div className="col-span-full py-20 text-center opacity-30 italic">No pleadings associated yet.</div>
                  ) : drafts.map(d => (
                     <div key={d.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-400 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                              <ICONS.Draft />
                           </div>
                           <span className="text-[8px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase">V{d.version}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-relaxed">{d.title}</p>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Updated {new Date(d.updatedAt).toLocaleDateString()}</span>
                           <button className="text-[9px] font-bold text-emerald-600 uppercase hover:underline">Edit Studio →</button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeTab === 'Board' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-900 legal-serif">Listed Hearings</h4>
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">+ List New Date</button>
               </div>
               <div className="space-y-4">
                  {hearings.length === 0 ? (
                     <div className="py-20 text-center opacity-30 italic">No board dates listed for this matter.</div>
                  ) : hearings.map(h => (
                     <div key={h.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all">
                        <div className="flex items-center gap-8">
                           <div className="text-center w-14">
                              <p className="text-2xl font-bold text-slate-900">{new Date(h.date).getDate()}</p>
                              <p className="text-[10px] font-bold text-indigo-500 uppercase">{new Date(h.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800">{h.purpose}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{h.bench || 'Bench TBA'} • Court Room {h.courtRoom || '--'}</p>
                           </div>
                        </div>
                        <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Prep Brief →</button>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      {/* Initialize Draft Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 sm:p-10 space-y-8 border border-white/20 animate-in zoom-in-95">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 legal-serif">Initialize Draft</h3>
                <button onClick={() => setShowDraftModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                </button>
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pleading Title</label>
                 <input 
                    type="text" 
                    value={newDraftTitle}
                    onChange={(e) => setNewDraftTitle(e.target.value)}
                    placeholder="e.g. Interim Bail Application"
                    className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:bg-white font-bold transition-all text-xs sm:text-sm"
                 />
              </div>
              <button 
                onClick={handleCreateDraft}
                className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all text-xs sm:text-sm"
              >
                Create Pleading Shell
              </button>
           </div>
        </div>
      )}

      {/* Link Existing Document Modal */}
      {showLinkDocModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl font-bold text-slate-900 legal-serif">Firm Knowledge Pool</h3>
                 <button onClick={() => setShowLinkDocModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                 </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-6 space-y-3 custom-scrollbar">
                 {unlinkedDocs.length === 0 ? (
                    <p className="text-center py-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No unassigned documents in Firm Store</p>
                 ) : unlinkedDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-400 transition-all group">
                       <div className="min-w-0 flex-1 pr-4">
                          <p className="text-xs font-bold text-slate-800 truncate">{doc.title}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{doc.type} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                       </div>
                       <button 
                         onClick={() => linkExistingDoc(doc.id)}
                         className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                       >
                         Link
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Link Existing Draft Modal */}
      {showLinkDraftModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl font-bold text-slate-900 legal-serif">Orphaned Drafts</h3>
                 <button onClick={() => setShowLinkDraftModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                 </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-6 space-y-3 custom-scrollbar">
                 {unlinkedDrafts.length === 0 ? (
                    <p className="text-center py-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No unassigned drafts found</p>
                 ) : unlinkedDrafts.map(draft => (
                    <div key={draft.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-emerald-400 transition-all group">
                       <div className="min-w-0 flex-1 pr-4">
                          <p className="text-xs font-bold text-emerald-900 truncate">{draft.title}</p>
                          <p className="text-[8px] font-bold text-emerald-400 uppercase mt-1">Version {draft.version} • {new Date(draft.createdAt).toLocaleDateString()}</p>
                       </div>
                       <button 
                         onClick={() => linkExistingDraft(draft.id)}
                         className="px-4 py-2 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-md hover:bg-emerald-700 transition-colors"
                       >
                         Assimilate
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MattersPage;
