
import React from 'react';
import { AppView, User, UserRole } from '../types';
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
    const role = user.role;
    switch (role) {
      case 'Citizen':
        return [
          { view: AppView.PUBLIC_HOME, label: 'Legal Help Desk', icon: ICONS.Dashboard },
          { view: AppView.DOC_INTELLIGENCE, label: 'Analyze Document', icon: ICONS.Summarize },
          { view: AppView.DRAFTING_STUDIO, label: 'Draft Complaint', icon: ICONS.Draft },
        ];
      case 'Student':
        return [
          { view: AppView.STUDENT_HOME, label: 'Study Assistant', icon: ICONS.Dashboard },
          { view: AppView.STUDENT_BRIEFS, label: 'Case Briefs', icon: ICONS.Summarize },
          { view: AppView.STUDENT_MOOT, label: 'Moot Toolkit', icon: ICONS.Gavel },
          { view: AppView.STUDENT_BARE_ACTS, label: 'Bare Acts', icon: ICONS.Books },
        ];
      case 'Junior_Advocate':
        return [
          { view: AppView.JUNIOR_HOME, label: 'AI Associate', icon: ICONS.Dashboard },
          { view: AppView.DRAFTING_STUDIO, label: 'Drafting Room', icon: ICONS.Draft },
          { view: AppView.JUNIOR_PROCEDURES, label: 'Procedure Map', icon: ICONS.Academic },
          { view: AppView.JUNIOR_FILING, label: 'Filing Help', icon: ICONS.Upload },
        ];
      case 'Senior_Advocate':
        return [
          { view: AppView.SENIOR_HOME, label: 'Firm Dashboard', icon: ICONS.Dashboard },
          { view: AppView.RESEARCH_HUB, label: 'Strategic RAG', icon: ICONS.Chat },
          { view: AppView.DRAFTING_STUDIO, label: 'Adv. Drafting', icon: ICONS.Draft },
          { view: AppView.SENIOR_INSIGHTS, label: 'Judge Insights', icon: ICONS.Gavel },
        ];
      case 'Startup_Founder':
        return [
          { view: AppView.STARTUP_HOME, label: 'Business Health', icon: ICONS.Dashboard },
          { view: AppView.STARTUP_CONTRACTS, label: 'Contract AI', icon: ICONS.Summarize },
          { view: AppView.STARTUP_COMPLIANCE, label: 'Compliance Board', icon: ICONS.Academic },
        ];
      case 'In_House_Counsel':
        return [
          { view: AppView.INHOUSE_HOME, label: 'Legal Ops HQ', icon: ICONS.Dashboard },
          { view: AppView.INHOUSE_MATTERS, label: 'Matter Tracking', icon: ICONS.Summarize },
          { view: AppView.INHOUSE_EXPOSURE, label: 'Exposure Audit', icon: ICONS.Gavel },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400 border-r border-slate-800">
      <div className="p-8 flex items-center space-x-4">
        <div className="bg-white p-2 rounded-xl text-slate-900 shadow-xl">
          <ICONS.Gavel />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tight legal-serif">Vidhi AI</span>
          <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Neural OS</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar py-6">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-6 px-4">
          {user.role.replace('_', ' ')} Workspace
        </p>
        {getNavItems().map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              currentView === item.view 
                ? 'bg-indigo-600 text-white shadow-xl' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon />
            <span className="font-bold text-xs tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
          <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <p className="text-[10px] font-bold text-white truncate">{user.name}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{user.tier}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-3 text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          <ICONS.Logout />
          <span>Exit Workspace</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
