
import React, { useState } from 'react';
import { authService } from '../services/auth';

const Settings: React.FC = () => {
  const user = authService.getSession();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      alert("Password updated successfully across all Vidhi endpoints.");
      setPasswords({ current: '', next: '', confirm: '' });
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header>
        <h2 className="text-4xl font-bold text-slate-900 legal-serif">System Settings</h2>
        <p className="text-slate-500 font-medium">Configure account security, session persistence, and global preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security Section */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900">Account Security</h3>
           </div>

           <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Master Key</label>
                 <input 
                    type="password" 
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                 />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Master Key</label>
                 <input 
                    type="password" 
                    value={passwords.next}
                    onChange={e => setPasswords({ ...passwords, next: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                 />
              </div>
              <button 
                disabled={isUpdating || !passwords.next}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30"
              >
                 {isUpdating ? "Securing..." : "Update Master Key"}
              </button>
           </form>

           <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-bold text-slate-900">Two-Factor Auth</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Biometric / Authenticator</p>
                 </div>
                 <div className="h-6 w-12 bg-slate-200 rounded-full relative p-1 cursor-not-allowed">
                    <div className="h-4 w-4 bg-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Sessions Section */}
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">💻</div>
                 <h3 className="text-xl font-bold text-slate-900">Active Sessions</h3>
              </div>

              <div className="space-y-4">
                 <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-emerald-900">Current Device (v3.5 OS)</p>
                       <p className="text-[10px] font-bold text-emerald-500 uppercase">Last Active: Now</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 </div>
                 <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl opacity-60">
                    <p className="text-sm font-bold text-slate-700">Mobile Terminal (Delhi)</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active 2 hours ago</p>
                 </div>
              </div>

              <button className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all">
                 Kill All Remote Sessions
              </button>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-xl font-bold legal-serif mb-4">Enterprise Usage</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                       <span className="text-slate-400">Research Credits</span>
                       <span>{user?.usage.researchCredits} / {user?.usage.maxResearchCredits}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(user?.usage.researchCredits! / user?.usage.maxResearchCredits!) * 100}%` }}></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest text-center">Auto-renewing on 1st of next month.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
