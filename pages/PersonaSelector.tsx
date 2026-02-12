
import React from 'react';
import { UserRole, AppView, User } from '../types';
import { authService } from '../services/auth';

const personas = [
  { role: 'Citizen', icon: '👨‍👩‍👧‍👦', title: 'Public & Beginner', desc: 'Simple help for FIRs, Consumer complaints, and Rent issues.' },
  { role: 'Student', icon: '🎓', title: 'Law Student', desc: 'Moot court prep, Judgment briefs, and Concept explainer.' },
  { role: 'Junior_Advocate', icon: '💼', title: 'Junior Advocate', desc: 'Procedural guides, Filing help, and Practice management.' },
  { role: 'Senior_Advocate', icon: '🏛️', title: 'Senior / Law Firm', desc: 'Enterprise management, Strategic Lab, and advanced Drafting.' },
  { role: 'Startup_Founder', icon: '🚀', title: 'Startup & MSME', desc: 'Contract review, GST/ROC compliance, and Labour laws.' }
];

const PersonaSelector: React.FC<{ onPersonaChange: (role: UserRole) => void }> = ({ onPersonaChange }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 legal-serif mb-4">Choose Your Path</h2>
        <p className="text-slate-500 font-medium">Select a persona to optimize the Vidhi AI OS for your specific needs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {personas.map((p) => (
          <button
            key={p.role}
            onClick={() => onPersonaChange(p.role as UserRole)}
            className="flex flex-col items-start p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-400 hover:-translate-y-2 transition-all group text-left"
          >
            <span className="text-5xl mb-6 group-hover:scale-110 transition-transform">{p.icon}</span>
            <h3 className="text-2xl font-bold text-slate-900 legal-serif mb-3">{p.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">{p.desc}</p>
            <span className="mt-auto text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              Launch Workspace <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={3}/></svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;
