
import React from 'react';
import { AppView, User } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case 'Citizen':
        return [
          { view: AppView.PUBLIC_HOME, label: 'Legal Help Desk', icon: ICONS.Chat },
          { view: AppView.DOC_INTELLIGENCE, label: 'Analyze Document', icon: ICONS.Summarize },
          { view: AppView.DRAFTING_STUDIO, label: 'Draft Complaint', icon: ICONS.Draft },
          { view: AppView.PUBLIC_CASE_TRACKER, label: 'Track My Case', icon: ICONS.Gavel },
          { view: AppView.PUBLIC_DOCS, label: 'My Documents', icon: ICONS.Upload },
        ];
      case 'Student':
        return [
          { view: AppView.STUDENT_HOME, label: 'Study Assistant', icon: ICONS.Academic },
          { view: AppView.STUDENT_BRIEFS, label: 'Brief Generator', icon: ICONS.Summarize },
          { view: AppView.STUDENT_BARE_ACTS, label: 'Bare Act Explorer', icon: ICONS.Books },
          { view: AppView.STUDENT_MOOT, label: 'Moot Toolkit', icon: ICONS.Gavel },
          { view: AppView.DRAFTING_STUDIO, label: 'Note Drafting', icon: ICONS.Draft },
        ];
      case 'Junior_Advocate':
        return [
          { view: AppView.JUNIOR_HOME, label: 'Junior Associate', icon: ICONS.Chat },
          { view: AppView.DRAFTING_STUDIO, label: 'Drafting Room', icon: ICONS.Draft },
          { view: AppView.JUNIOR_PROCEDURES, label: 'Procedure Hub', icon: ICONS.Academic },
          { view: AppView.JUNIOR_FILING, label: 'Filing Assistant', icon: ICONS.Upload },
          { view: AppView.JUNIOR_HEARING_PREP, label: 'Hearing Prep', icon: ICONS.Gavel },
        ];
      case 'Senior_Advocate':
        return [
          { view: AppView.SENIOR_HOME, label: 'Firm Command', icon: ICONS.Dashboard },
          { view: AppView.RESEARCH_HUB, label: 'Strategic Brain', icon: ICONS.Chat },
          { view: AppView.DRAFTING_STUDIO, label: 'Advanced Drafting', icon: ICONS.Draft },
          { view: AppView.SENIOR_TEAM, label: 'Team Portal', icon: ICONS.Academic },
          { view: AppView.SENIOR_INSIGHTS, label: 'Judge Insights', icon: ICONS.Gavel },
        ];
      case 'Startup_Founder':
        return [
          { view: AppView.STARTUP_HOME, label: 'Legal Health', icon: ICONS.Dashboard },
          { view: AppView.STARTUP_CONTRACT_AI, label: 'Contract AI', icon: ICONS.Summarize },
          { view: AppView.STARTUP_COMPLIANCE, label: 'Compliance Lab', icon: ICONS.Academic },
          { view: AppView.DRAFTING_STUDIO, label: 'Document Lab', icon: ICONS.Draft },
        ];
      case 'In_House_Counsel':
        return [
          { view: AppView.INHOUSE_HOME, label: 'Legal Ops Home', icon: ICONS.Dashboard },
          { view: AppView.INHOUSE_MATTERS, label: 'Matter Registry', icon: ICONS.Summarize },
          { view: AppView.INHOUSE_EXPOSURE, label: 'Risk Dashboard', icon: ICONS.Gavel },
          { view: AppView.RESEARCH_HUB, label: 'Legal Knowledge', icon: ICONS.Chat },
        ];
      default:
        return [
          { view: AppView.PUBLIC_HOME, label: 'Dashboard', icon: ICONS.Dashboard }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400 border-r border-slate-800 shadow-2xl">
      <div className="p-8 flex items-center space-x-4 mb-4">
        <div className="bg-white p-2 rounded-xl text-slate-900 shadow-lg">
          <ICONS.Gavel />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tight legal-serif">Vidhi AI</span>
          <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Enterprise OS</span>
        </div>
      </div>

      <div className="px-8 py-4 mb-6">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Workspace</p>
          <p className="text-xs font-bold text-indigo-400 truncate">{user.role.replace('_', ' ')}</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
              currentView === item.view 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon />
            <span className="font-bold text-xs tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl bg-white/5 text-slate-500 hover:text-red-400 transition-colors uppercase text-[10px] font-bold tracking-widest"
        >
          <ICONS.Logout />
          <span>Exit OS</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
