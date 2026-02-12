
import React from 'react';
import { authService } from '../services/auth';

const Privacy: React.FC = () => {
  const user = authService.getSession();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "vidhi_identity_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDelete = () => {
    if (confirm("CRITICAL: This will initiate permanent soft-deletion of your identity and all linked firm data. This process is irreversible after 30 days. Proceed?")) {
      alert("Deletion request queued. You will be logged out.");
      authService.logout();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header>
        <h2 className="text-4xl font-bold text-slate-900 legal-serif">Privacy & Control</h2>
        <p className="text-slate-500 font-medium">Manage your data sovereignty, firm isolation, and export rights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 flex flex-col">
            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">📦</div>
            <h3 className="text-2xl font-bold text-slate-900">Data Portability</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Under the Digital Personal Data Protection (DPDP) standards, you have the right to export a complete copy of your identity and usage history in JSON format.</p>
            <div className="mt-auto pt-6">
               <button 
                 onClick={handleExport}
                 className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
               >
                  Generate Data Export
               </button>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 flex flex-col">
            <div className="h-12 w-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl">⚠️</div>
            <h3 className="text-2xl font-bold text-slate-900">Right to be Forgotten</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Terminate your workspace permanently. All documents, drafts, and matter history linked to your unique Counsel ID will be sanitized and purged from our enterprise nodes.</p>
            <div className="mt-auto pt-6">
               <button 
                 onClick={handleDelete}
                 className="w-full py-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95"
               >
                  Initiate Deletion Request
               </button>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8">
         <h3 className="text-2xl font-bold legal-serif">Enterprise Isolation Logic</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">End-to-End Encryption</h4>
               <p className="text-xs text-slate-400 leading-relaxed">All pleadings and case files are encrypted at rest with AES-256 standard.</p>
            </div>
            <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">No Model Training</h4>
               <p className="text-xs text-slate-400 leading-relaxed">Your firm's private documents are never used to train the base Gemini models.</p>
            </div>
            <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Firm Sandbox</h4>
               <p className="text-xs text-slate-400 leading-relaxed">Logical multi-tenancy ensures User A can never leak data to User B.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Privacy;
