
import React, { useState, useEffect } from 'react';
import { knowledgeBase } from '../services/knowledgeBase';
import { LegalDocument } from '../types';

const AdminPage: React.FC = () => {
  const [docs, setDocs] = useState<LegalDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState<{
    category: LegalDocument['type'];
    tags: string;
  }>({
    category: 'Pleading',
    tags: ''
  });

  const refreshDocs = () => {
    setDocs(knowledgeBase.getAll());
  };

  useEffect(() => {
    refreshDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const tagList = uploadData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      await knowledgeBase.ingest(file, uploadData.category, tagList);
      refreshDocs();
      setUploadData({ ...uploadData, tags: '' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently remove this intelligence node from your firm's private RAG?")) {
      knowledgeBase.delete(id);
      refreshDocs();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 legal-serif">Intelligence Management</h1>
          <p className="text-slate-500 font-medium">Manage RAG ingestion pipelines, firm templates, and localized legal datasets.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
              Private Firm RAG: ACTIVE
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingestion Configuration</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intelligence Category</label>
                <select 
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm"
                >
                  <option value="Pleading">Firm Template / Draft</option>
                  <option value="Judgment">Past Internal Judgment</option>
                  <option value="Research">Strategic Research Paper</option>
                  <option value="Statute">Regional Statute / Act</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semantic Tags (CSV)</label>
                <input 
                  type="text" 
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                  placeholder="e.g. Land Law, RERA, 2024"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="block w-full cursor-pointer">
                  <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group relative overflow-hidden">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors">
                      <svg className="h-8 w-8 text-slate-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2.5}/></svg>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Ingest intelligence node</p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed uppercase tracking-widest">PDF or TXT required</p>
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  </div>
                </label>

                {isUploading && (
                  <div className="p-6 bg-indigo-50 rounded-2xl flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-3 text-indigo-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">
                      <span className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                      <span>Neural Mapping Active</span>
                    </div>
                    <p className="text-[10px] text-indigo-400 leading-relaxed font-bold italic">Chunking data and building semantic embeddings for firm-private retrieval...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">Firm Privacy Shield</h4>
             <p className="text-xs text-slate-400 leading-relaxed mb-6">Internal documents are processed in a secure shard. They are <span className="text-white font-bold">never</span> shared with the global knowledge base or used to train public models.</p>
             <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Hardware Isolation Confirmed</span>
             </div>
             <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-900 flex items-center gap-3">
                 <span className="h-4 w-1 bg-indigo-600 rounded-full"></span> Private Knowledge Base
               </h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{docs.length} Active Intelligence Nodes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-10 py-5">Source Material</th>
                    <th className="px-10 py-5">Context / Tags</th>
                    <th className="px-10 py-5">Origin</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {docs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            doc.firmId === 'global' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2.5}/></svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{doc.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-wrap gap-1.5">
                          {doc.metadata.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-tighter">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${
                          doc.firmId === 'global' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {doc.firmId === 'global' ? 'Platform Global' : 'Firm Private'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${doc.status === 'Indexed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${
                            doc.status === 'Indexed' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        {doc.firmId !== 'global' && (
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
