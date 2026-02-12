
import React, { useState } from 'react';
import { User, AppView, LearningPath } from '../types';

interface StudentDashboardProps {
  user: User | null;
  setView: (view: AppView) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, setView }) => {
  const [paths] = useState<LearningPath[]>([
    { id: '1', subject: 'Constitution of India', progress: 65, totalModules: 12, lastTopic: 'Writ Jurisdictions' },
    { id: '2', subject: 'BNS (Criminal Law)', progress: 20, totalModules: 15, lastTopic: 'General Exceptions' },
    { id: '3', subject: 'Civil Procedure Code', progress: 45, totalModules: 10, lastTopic: 'Res Judicata' },
    { id: '4', subject: 'Evidence Act (BSA)', progress: 10, totalModules: 8, lastTopic: 'Relevancy of Facts' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-1 sm:px-0">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                Academic Command Center
             </span>
             <span className="text-slate-300 hidden xs:inline">•</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xs:inline">
                Phase 1 Preparation
             </span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-slate-900 legal-serif tracking-tight pt-2">Learning Hub</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Academic Status: <span className="text-slate-900 font-bold">{user?.collegeName || 'National Law School'}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center">
             <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Study Streak</p>
             <p className="text-base sm:text-lg font-bold text-orange-500">🔥 7 Days</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Concept Explainer', icon: '📖', view: AppView.STUDENT_BARE_ACTS, desc: 'Query AI Mentor' },
          { label: 'Case Summaries', icon: '📝', view: AppView.DOC_INTELLIGENCE, desc: 'Ratio extractions' },
          { label: 'Moot Toolkit', icon: '⚖️', view: AppView.STUDENT_MOOT, desc: 'Prep memorials' },
          { label: 'Research Bot', icon: '🤖', view: AppView.RESEARCH_HUB, desc: 'AI research node' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => setView(action.view)}
            className="flex flex-col items-start p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 transition-all hover:shadow-2xl hover:border-indigo-400 hover:scale-[1.02] active:scale-95 bg-white group text-left"
          >
            <span className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-900 uppercase tracking-widest mb-0.5 sm:mb-1">{action.label}</span>
            <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium line-clamp-1">{action.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
        <div className="lg:col-span-8 space-y-8 sm:space-y-10">
          <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 sm:px-10 py-5 sm:py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
                <h4 className="font-bold text-slate-800 flex items-center uppercase tracking-widest text-[10px] sm:text-[11px]">
                  <span className="h-4 w-1 bg-indigo-600 rounded-full mr-3 sm:mr-4"></span> Active Learning Paths
                </h4>
             </div>
             <div className="p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {paths.map(path => (
                  <div key={path.id} className="p-6 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 hover:border-indigo-300 transition-all group cursor-pointer" onClick={() => setView(AppView.STUDENT_BARE_ACTS)}>
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <h5 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight truncate mr-2">{path.subject}</h5>
                      <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl uppercase tracking-widest shrink-0">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full mb-6 sm:mb-8 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]" style={{ width: `${path.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                        Module: <span className="text-slate-600 truncate inline-block max-w-[80px] sm:max-w-[120px] ml-1">{path.lastTopic}</span>
                      </div>
                      <button className="text-indigo-600 font-bold text-[9px] sm:text-xs group-hover:underline uppercase tracking-widest shrink-0">Study →</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 sm:space-y-10">
           <div className="bg-indigo-600 rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-[9px] sm:text-[10px] font-bold text-indigo-200 uppercase tracking-[0.3em] mb-6 sm:mb-8">Exam Countdown</h4>
                 <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 bg-white/10 rounded-2xl sm:rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                       <p className="text-sm sm:text-base font-bold">Judiciary Service 2024</p>
                       <p className="text-[8px] sm:text-[10px] opacity-60 uppercase mt-1 sm:mt-2 font-bold tracking-widest">Oct 2024 • Phase I Prelims</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-white/10 rounded-2xl sm:rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                       <p className="text-sm sm:text-base font-bold">AILET / CLAT (PG)</p>
                       <p className="text-[8px] sm:text-[10px] opacity-60 uppercase mt-1 sm:mt-2 font-bold tracking-widest">Nov 2024 • Preparation Active</p>
                    </div>
                 </div>
                 <button className="w-full mt-8 sm:mt-10 py-4 sm:py-5 bg-white text-indigo-600 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xl hover:bg-slate-50 transition-all active:scale-95">View Prep Schedule</button>
              </div>
              <div className="absolute -bottom-16 sm:-bottom-20 -right-16 sm:-right-20 h-48 sm:h-64 w-48 sm:w-64 bg-white/5 rounded-full blur-[60px] sm:blur-[80px]"></div>
           </div>

           <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] shadow-sm">
              <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 sm:mb-8 flex items-center">
                 <span className="h-4 w-1 bg-amber-500 rounded-full mr-3 sm:mr-4"></span> Landmark Ingestion
              </h4>
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-colors cursor-pointer" onClick={() => setView(AppView.DOC_INTELLIGENCE)}>
                <h5 className="font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-indigo-600 transition-colors leading-tight text-sm sm:text-base">S.R. Bommai v. Union of India</h5>
                <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed mb-4 sm:mb-6 font-medium">Critical analysis of Art. 356 and Federalism. Basic Structure doctrine revisited.</p>
                <button className="text-indigo-600 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest hover:underline decoration-indigo-200">Start Analysis →</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
