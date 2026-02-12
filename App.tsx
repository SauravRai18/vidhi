
import React, { useState, useEffect } from 'react';
import { AppView, User, UserRole } from './types';
import { authService } from './services/auth';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/Login';
import PersonaSelector from './pages/PersonaSelector';
import Dashboard from './pages/Dashboard';
import DocumentIntelligence from './pages/Summarizer';
import DraftingStudio from './pages/DraftingRoom';
import ChatAssistant from './pages/ChatAssistant';
import MattersPage from './pages/Matters';
import BoardTracker from './pages/BoardTracker';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session);
      if (!session.isSetupComplete) {
        setCurrentView(AppView.PERSONA_SELECTOR);
      } else {
        setCurrentView(getDefaultViewForRole(session.role));
      }
    }
  }, []);

  const getDefaultViewForRole = (role: UserRole): AppView => {
    switch (role) {
      case 'Citizen': return AppView.PUBLIC_HOME;
      case 'Student': return AppView.STUDENT_HOME;
      case 'Junior_Advocate': return AppView.JUNIOR_HOME;
      case 'Senior_Advocate': return AppView.SENIOR_HOME;
      case 'Startup_Founder': return AppView.STARTUP_HOME;
      case 'In_House_Counsel': return AppView.INHOUSE_HOME;
      default: return AppView.LOGIN;
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (!userData.isSetupComplete) {
      setCurrentView(AppView.PERSONA_SELECTOR);
    } else {
      setCurrentView(getDefaultViewForRole(userData.role));
    }
  };

  const handleSetupComplete = async (metadata: any) => {
    if (user) {
      const updated = await authService.updateProfile({ 
        ...metadata, 
        isSetupComplete: true 
      });
      setUser(updated);
      setCurrentView(getDefaultViewForRole(updated.role));
    }
  };

  const navigateTo = (view: AppView) => setCurrentView(view);

  if (currentView === AppView.LOGIN) return <LoginPage onLogin={handleLogin} />;
  
  if (currentView === AppView.PERSONA_SELECTOR) {
    return <div className="h-screen bg-slate-50"><PersonaSelector onSetupComplete={handleSetupComplete} /></div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <div className="w-80 shrink-0">
        <Sidebar 
          currentView={currentView} 
          setView={navigateTo} 
          user={user} 
          onLogout={() => { authService.logout(); setUser(null); setCurrentView(AppView.LOGIN); }} 
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
           <div className="flex items-center space-x-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                {user?.role.replace('_', ' ')} MODE
              </span>
           </div>
           <div className="flex items-center space-x-3">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-900">{user?.name}</p>
                 <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Active Session</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                 {user?.name.charAt(0)}
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {/* Generic Core Modules with Role Context */}
            {currentView === AppView.DOC_INTELLIGENCE && <DocumentIntelligence />}
            {currentView === AppView.DRAFTING_STUDIO && <DraftingStudio />}
            {currentView === AppView.RESEARCH_HUB && <ChatAssistant />}
            
            {/* Dynamic Role-Based Dashboards */}
            {(
              currentView === AppView.PUBLIC_HOME || 
              currentView === AppView.STUDENT_HOME || 
              currentView === AppView.JUNIOR_HOME || 
              currentView === AppView.SENIOR_HOME || 
              currentView === AppView.STARTUP_HOME || 
              currentView === AppView.INHOUSE_HOME
            ) && <Dashboard user={user} setView={navigateTo} />}

            {/* Sub-Views */}
            {currentView === AppView.INHOUSE_MATTERS && <MattersPage />}
            {currentView === AppView.JUNIOR_PROCEDURES && <BoardTracker />}
            {/* Additional page wiring for other tabs can go here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
