
import React, { useState, useEffect } from 'react';
import { AppView, User, UserRole } from './types';
import { authService } from './services/auth';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/Login';
import PersonaSelector from './pages/PersonaSelector';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import Summarizer from './pages/Summarizer';
import DraftingRoom from './pages/DraftingRoom';
import MattersPage from './pages/Matters';
import BoardTracker from './pages/BoardTracker';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Legal from './pages/Legal';
import Billing from './pages/Billing';
import LearningHub from './pages/LearningHub';
import MootToolkit from './pages/MootToolkit';

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
        setCurrentView(getRoleHome(session.role));
      }
    }
  }, []);

  const getRoleHome = (role: UserRole): AppView => {
    switch(role) {
      case 'Citizen': return AppView.PUBLIC_HOME;
      case 'Student': return AppView.STUDENT_HOME;
      case 'Junior_Advocate': return AppView.JUNIOR_HOME;
      case 'Senior_Advocate': return AppView.SENIOR_HOME;
      case 'Startup_Founder': return AppView.STARTUP_HOME;
      case 'In_House_Counsel': return AppView.INHOUSE_HOME;
      default: return AppView.PUBLIC_HOME;
    }
  };

  const isDashboardView = (view: AppView) => {
    return [
      AppView.PUBLIC_HOME,
      AppView.STUDENT_HOME,
      AppView.JUNIOR_HOME,
      AppView.SENIOR_HOME,
      AppView.STARTUP_HOME,
      AppView.INHOUSE_HOME
    ].includes(view);
  };

  const handleLogin = (userData: User) => {
    localStorage.setItem('v_os_session', JSON.stringify(userData));
    setUser(userData);
    
    if (!userData.isSetupComplete) {
      setCurrentView(AppView.PERSONA_SELECTOR);
    } else {
      setCurrentView(getRoleHome(userData.role));
    }
  };

  const handleSetupComplete = async (metadata: any) => {
    if (user) {
      const updated = await authService.updateProfile({ ...metadata, isSetupComplete: true });
      setUser(updated);
      setCurrentView(getRoleHome(updated.role));
    }
  };

  const navigateTo = (view: AppView) => setCurrentView(view);

  if (currentView === AppView.LOGIN) return <LoginPage onLogin={handleLogin} />;
  
  if (currentView === AppView.PERSONA_SELECTOR) {
    return (
      <div className="h-screen bg-slate-50 overflow-y-auto">
        <PersonaSelector onSetupComplete={handleSetupComplete} setView={navigateTo} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-inter text-slate-900">
      <div className="w-80 shrink-0 hidden lg:block">
        <Sidebar currentView={currentView} setView={navigateTo} user={user} onLogout={() => {authService.logout(); setUser(null); setCurrentView(AppView.LOGIN);}} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 shrink-0 z-30 shadow-sm">
           <div className="flex items-center space-x-4">
              {!isDashboardView(currentView) && (
                <button 
                  onClick={() => user && navigateTo(getRoleHome(user.role))}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={3} /></svg>
                  Home
                </button>
              )}
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 sm:px-4 py-2 rounded-xl border border-slate-100 truncate max-w-[120px] sm:max-w-none">
                {user?.role.replace('_', ' ')} Workspace
              </span>
           </div>
           <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                 <p className="text-[10px] font-bold text-slate-900 leading-none">{user?.name}</p>
                 <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Enterprise Session</p>
              </div>
              <button onClick={() => setCurrentView(AppView.PROFILE)} className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold hover:bg-slate-200 transition-colors">
                 {user?.name?.charAt(0)}
              </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {isDashboardView(currentView) && (
              <Dashboard user={user} setView={navigateTo} />
            )}

            {currentView === AppView.DOC_INTELLIGENCE && <Summarizer />}
            {currentView === AppView.DRAFTING_STUDIO && <DraftingRoom />}
            {currentView === AppView.RESEARCH_HUB && <ChatAssistant />}

            {currentView === AppView.STUDENT_BARE_ACTS && <LearningHub />}
            {currentView === AppView.STUDENT_MOOT && <MootToolkit />}
            {currentView === AppView.INHOUSE_MATTERS && <MattersPage />}
            {currentView === AppView.JUNIOR_PROCEDURES && <BoardTracker />}
            
            {currentView === AppView.PROFILE && <Profile />}
            {currentView === AppView.SETTINGS && <Settings />}
            {currentView === AppView.PRIVACY && <Privacy />}
            {currentView === AppView.LEGAL_TERMS && <Legal />}
            {currentView === AppView.BILLING && <Billing />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
