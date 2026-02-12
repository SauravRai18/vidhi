
import React, { useState } from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate different roles based on email for dev testing
    const isAdmin = email.includes('admin');
    const isStudent = email.includes('student');

    onLogin({
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: isAdmin ? 'System Administrator' : isStudent ? 'Rahul Student' : 'Adv. Rajesh Kumar',
      email: email || 'user@vidhi.ai',
      firmName: isAdmin ? 'Vidhi AI Corporate' : isStudent ? 'NLSIU' : 'Kumar & Associates',
      firmId: isAdmin ? 'firm_admin' : isStudent ? 'firm_nlsiu' : 'firm_rajesh',
      role: isAdmin ? 'Admin' : isStudent ? 'Student' : 'Senior_Advocate',
      tier: 'PRO',
      isSetupComplete: true, // Default to true to allow immediate dashboard access in demo
      usage: {
        researchCredits: 42,
        draftsCreated: 156,
        maxResearchCredits: 100
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 overflow-hidden font-inter">
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 text-white bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10">
          <div className="mb-10 bg-white p-4 rounded-3xl w-fit shadow-2xl shadow-indigo-500/20">
            <ICONS.Gavel />
          </div>
          <h1 className="text-6xl xl:text-7xl font-bold mb-8 tracking-tighter legal-serif leading-none">Vidhi AI</h1>
          <p className="text-2xl text-slate-400 max-w-lg leading-relaxed font-light">
            The intelligent operating system for the modern <span className="text-white font-medium italic decoration-indigo-500 underline underline-offset-8">Indian Advocate</span>.
          </p>
          
          <div className="mt-16 space-y-8">
            <div className="flex items-start space-x-6">
              <div className="mt-1 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg">Grounded Intelligence</p>
                <p className="text-slate-500 text-sm leading-relaxed">RAG-powered research with verified SC/HC citations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="mt-1 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                <svg className="h-6 w-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .155 17.834 4.9a2 2 0 011.166 1.8v10.155a2 2 0 01-1.166 1.8l-7.834 4.745-7.834-4.745a2 2 0 01-1.166-1.8V6.7a2 2 0 011.166-1.8zM10 3.326L3.924 7l6.076 3.674L16.076 7 10 3.326z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg">BNS Protocol</p>
                <p className="text-slate-500 text-sm leading-relaxed">Seamlessly map old IPC/CrPC sections to new statutes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-12 flex justify-center">
             <div className="flex items-center space-x-3">
               <div className="bg-slate-900 p-2 rounded-xl text-white">
                 <ICONS.Gavel />
               </div>
               <span className="text-3xl font-bold text-slate-900 legal-serif">Vidhi AI</span>
             </div>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">SaaS Portal</h2>
          <p className="text-slate-500 mb-10 font-medium">Enterprise workspace for legal professionals.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Counsel ID (Email)</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@firm.in"
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:outline-none transition-all font-medium text-slate-900"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Key</label>
                <a href="#" className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">Recovery</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:outline-none transition-all font-medium text-slate-900"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Initialize Workspace
            </button>
          </form>

          <div className="mt-12 text-center">
             <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em] mb-4">Certified Practice Management</p>
             <div className="flex justify-center space-x-6 grayscale opacity-30">
                <span className="text-[10px] font-bold">DIGITAL INDIA</span>
                <span className="text-[10px] font-bold">BAR COUNCIL COMPLIANT</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
