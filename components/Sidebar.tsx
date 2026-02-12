
import React, { useState, useRef, useEffect } from 'react';
import { AppView, User } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavItems = () => {
    switch (user?.role) {
      case 'Citizen':
        return [
          { view: AppView.CITIZEN_HUB, label: 'Legal Self-Service', icon: ICONS.Books },
          { view: AppView.CHAT, label: 'Ask a Law Question', icon: ICONS.Chat },
          { view: AppView.DRAFT, label: 'Simple Complaints', icon: ICONS.Draft },
        ];
      case 'Student':
        return [
          { view: AppView.STUDENT_DASHBOARD, label: 'Learning Hub', icon: ICONS.Dashboard },
          { view: AppView.LEARNING_HUB, label: 'Concept Explainer', icon: ICONS.Books },
          { view: AppView.SUMMARIZE, label: 'Case briefs', icon: ICONS.Summarize },
          { view: AppView.MOOT_TOOLKIT, label: 'Moot Room', icon: ICONS.Gavel },
        ];
      case 'Startup_Founder':
        return [
          { view: AppView.STARTUP_LAB, label: 'Business Health', icon: ICONS.Dashboard },
          { view: AppView.CONTRACT_REVIEW, label: 'AI Contract Audit', icon: ICONS.Summarize },
          { view: AppView.COMPLIANCE, label: 'GST/ROC Board', icon: ICONS.Dashboard },
        ];
      case 'Junior_Advocate':
        return [
          { view: AppView.JUNIOR_WORKSPACE, label: 'Launchpad', icon: ICONS.Dashboard },
          { view: AppView.CHAT, label: 'Procedural Search', icon: ICONS.Chat },
          { view: AppView.DRAFT, label: 'Court Formats', icon: ICONS.Draft },
          { view: AppView.HEARINGS, label: 'My Board', icon: ICONS.Gavel },
        ];
      default: // Senior Advocate / Law Firm
        return [
          { view: AppView.DASHBOARD, label: 'Firm Command', icon: ICONS.Dashboard },
          { view: AppView.MATTERS, label: 'Matter Registry', icon: ICONS.Summarize },
          { view: AppView.STRATEGY, label: 'Tactical Lab', icon: ICONS.Academic },
          { view: AppView.DRAFT, label: 'Drafting Studio', icon: ICONS.Draft },
          { view: AppView.HEARINGS, label: 'Master Board', icon: ICONS.Gavel },
        ];
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400 border-r border-slate-800 transition-all duration-500">
      <div className="p-8 flex items-center space-x-4 mb-8">
        <div className="bg-white p-3 rounded-2xl text-slate-900 shadow-2xl">
          <ICONS.Gavel />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white tracking-tight legal-serif">Vidhi AI</span>
          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.4em]">Indian Legal OS</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
        <div className="mb-4 px-6">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{user?.role.replace('_', ' ')} Workspace</p>
        </div>
        {getNavItems().map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center space-x-4 px-6 py-4.5 rounded-[1.5rem] transition-all duration-300 group ${
              currentView === item.view 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon />
            <span className="font-bold text-sm whitespace-nowrap tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-6 border-t border-slate-800/50" ref={dropdownRef}>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-4 p-4 bg-white/5 rounded-[2rem] border border-white/5 cursor-pointer hover:bg-white/10 transition-all"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase">{user?.tier}</p>
          </div>
        </div>
        
        {isDropdownOpen && (
          <div className="absolute bottom-24 left-6 right-6 bg-white rounded-3xl shadow-2xl py-3 border border-slate-200 z-50">
             <button onClick={() => setView(AppView.PERSONA_SELECTOR)} className="w-full text-left px-6 py-3 hover:bg-slate-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest">Switch Workspace Mode</button>
             <button onClick={() => setView(AppView.PROFILE)} className="w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 font-bold text-[10px] uppercase tracking-widest">Profile</button>
             <button onClick={onLogout} className="w-full text-left px-6 py-3 hover:bg-red-50 text-red-600 font-bold text-[10px] uppercase tracking-widest">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
