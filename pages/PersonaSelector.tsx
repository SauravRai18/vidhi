
import React, { useState } from 'react';
import { UserRole, PracticeArea, CourtLevel, AppView } from '../types';

interface PersonaOption {
  role: UserRole;
  icon: string;
  title: string;
  desc: string;
}

const personas: PersonaOption[] = [
  { role: 'Citizen', icon: '👨‍👩‍👧‍👦', title: 'Public & Beginner', desc: 'Simple help for FIRs, Consumer complaints, and Rent issues.' },
  { role: 'Student', icon: '🎓', title: 'Law Student', desc: 'Moot court prep, Judgment briefs, and Concept explainer.' },
  { role: 'Junior_Advocate', icon: '💼', title: 'Junior Advocate', desc: 'Procedural guides, Filing help, and Practice management.' },
  { role: 'Senior_Advocate', icon: '🏛️', title: 'Senior / Law Firm', desc: 'Enterprise management, Strategic Lab, and advanced Drafting.' },
  { role: 'Startup_Founder', icon: '🚀', title: 'Startup & MSME', desc: 'Contract review, GST/ROC compliance, and Labour laws.' },
  { role: 'In_House_Counsel', icon: '🏢', title: 'In-House Team', desc: 'Matter tracking, exposure dashboard, and contract lifecycle.' }
];

const PersonaSelector: React.FC<{ 
  onSetupComplete: (data: any) => void,
  setView: (view: AppView) => void
}> = ({ onSetupComplete, setView }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [metadata, setMetadata] = useState({
    city: '',
    experienceYears: 0,
    practiceArea: 'Civil' as PracticeArea,
    courtLevel: 'High_Court' as CourtLevel,
    firmName: ''
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Citizen') {
      onSetupComplete({ role, isSetupComplete: true });
    } else {
      setStep(2);
    }
  };

  const handleFinalize = () => {
    onSetupComplete({
      role: selectedRole,
      ...metadata,
      isSetupComplete: true
    });
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
      {step === 1 ? (
        <div className="w-full">
          <div className="mb-8">
            <button 
              onClick={() => setView(AppView.LOGIN)}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3}/></svg> 
              Back to Login
            </button>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 legal-serif mb-4">Initialize Your Workspace</h2>
            <p className="text-slate-500 font-medium">Choose your professional path to calibrate the AI Legal Intelligence layer.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {personas.map((p) => (
              <button
                key={p.role}
                onClick={() => handleRoleSelect(p.role)}
                className="flex flex-col items-start p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-400 hover:-translate-y-2 transition-all group text-left relative overflow-hidden"
              >
                <span className="text-5xl mb-6 group-hover:scale-110 transition-transform">{p.icon}</span>
                <h3 className="text-2xl font-bold text-slate-900 legal-serif mb-3">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">{p.desc}</p>
                <span className="mt-auto text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  Select Profile <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={3}/></svg>
                </span>
                <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-50/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden p-10 sm:p-16 animate-in slide-in-from-right-10">
          <button onClick={() => setStep(1)} className="mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3}/></svg> Go Back
          </button>
          
          <h2 className="text-3xl font-bold text-slate-900 legal-serif mb-2">Professional Context</h2>
          <p className="text-slate-500 font-medium mb-10">Help Vidhi AI understand your jurisdiction and expertise level.</p>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base City</label>
                  <input 
                    type="text" 
                    value={metadata.city}
                    onChange={e => setMetadata({...metadata, city: e.target.value})}
                    placeholder="e.g. New Delhi"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years of Practice</label>
                  <input 
                    type="number" 
                    value={metadata.experienceYears}
                    onChange={e => setMetadata({...metadata, experienceYears: parseInt(e.target.value)})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Practice Area</label>
               <select 
                 value={metadata.practiceArea}
                 onChange={e => setMetadata({...metadata, practiceArea: e.target.value as PracticeArea})}
                 className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
               >
                 {['Criminal', 'Civil', 'Corporate', 'Family', 'Taxation', 'GST', 'Labour', 'Intellectual Property'].map(pa => (
                   <option key={pa} value={pa}>{pa}</option>
                 ))}
               </select>
            </div>

            <div className="space-y-2">
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Typical Forum / Court Level</label>
               <div className="grid grid-cols-2 gap-3">
                 {['District', 'High_Court', 'Supreme_Court', 'Tribunal'].map(lvl => (
                   <button
                     key={lvl}
                     type="button"
                     onClick={() => setMetadata({...metadata, courtLevel: lvl as CourtLevel})}
                     className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                       metadata.courtLevel === lvl ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                     }`}
                   >
                     {lvl.replace('_', ' ')}
                   </button>
                 ))}
               </div>
            </div>

            {(selectedRole === 'Senior_Advocate' || selectedRole === 'Junior_Advocate') && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Firm / Chamber Name</label>
                <input 
                  type="text" 
                  value={metadata.firmName}
                  onChange={e => setMetadata({...metadata, firmName: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white font-bold"
                />
              </div>
            )}

            <button 
              onClick={handleFinalize}
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 mt-4"
            >
               LAUNCH SECURE OS WORKSPACE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;
