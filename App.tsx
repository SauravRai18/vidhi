
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, User, UserRole } from './types';
import { authService } from './services/auth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import Summarizer from './pages/Summarizer';
import DraftingRoom from './pages/DraftingRoom';
import StudentDashboard from './pages/StudentDashboard';
import LearningHub from './pages/LearningHub';
import MootToolkit from './pages/MootToolkit';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import MattersPage from './pages/Matters';
import BoardTracker from './pages/BoardTracker';
import ComplianceHub from './pages/ComplianceHub';
import StrategyAssistant from './pages/StrategyAssistant';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Legal from './pages/Legal';
import FounderAdmin from './pages/FounderAdmin';
import Billing from './pages/Billing';
import PersonaSelector from './pages/PersonaSelector';
import CitizenHub from './pages/CitizenHub';
import JuniorWorkspace from './pages/JuniorWorkspace';
import StartupLab from './pages/StartupLab';
import ContractReview from './pages/ContractReview';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session);
      // Force persona selection if the role is the default 'Advocate' which we want to refine
      if (session.role === 'Advocate' as any) {
        setCurrentView(AppView.PERSONA_SELECTOR);
      } else {
        setCurrentView(AppView.DASHBOARD);
      }
    }
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handlePersonaChange = async (role: UserRole) => {
    if (user) {
      const updated = await authService.updateProfile({ role });
      setUser(updated);
      navigateTo(AppView.DASHBOARD);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.role === 'Advocate' as any) {
      setCurrentView(AppView.PERSONA_SELECTOR);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  if (currentView === AppView.LOGIN) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-inter text-slate-900">
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar currentView={currentView} setView={navigateTo} user={user} onLogout={() => {authService.logout(); setUser(null); navigateTo(AppView.LOGIN);}} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div className="hidden xs:flex items-center gap-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">{user?.role.replace('_', ' ')} MODE</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-[9px] font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user?.tier} PLAN</p>
             </div>
             <button onClick={() => navigateTo(AppView.PROFILE)} className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                {user?.name.charAt(0)}
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-50/50 relative">
          <div className="max-w-7xl mx-auto h-full">
            {currentView === AppView.PERSONA_SELECTOR && <PersonaSelector onPersonaChange={handlePersonaChange} />}
            {currentView === AppView.DASHBOARD && <Dashboard user={user} setView={navigateTo} />}
            {currentView === AppView.CHAT && <ChatAssistant />}
            {currentView === AppView.SUMMARIZE && <Summarizer />}
            {currentView === AppView.DRAFT && <DraftingRoom />}
            {currentView === AppView.MATTERS && <MattersPage />}
            {currentView === AppView.HEARINGS && <BoardTracker />}
            {currentView === AppView.COMPLIANCE && <ComplianceHub />}
            {currentView === AppView.STRATEGY && <StrategyAssistant />}
            {currentView === AppView.STUDENT_DASHBOARD && <StudentDashboard user={user} setView={navigateTo} />}
            {currentView === AppView.LEARNING_HUB && <LearningHub />}
            {currentView === AppView.MOOT_TOOLKIT && <MootToolkit />}
            {currentView === AppView.CITIZEN_HUB && <CitizenHub setView={navigateTo} />}
            {currentView === AppView.JUNIOR_WORKSPACE && <JuniorWorkspace />}
            {currentView === AppView.STARTUP_LAB && <StartupLab />}
            {currentView === AppView.CONTRACT_REVIEW && <ContractReview />}
            {currentView === AppView.PROFILE && <Profile />}
            {currentView === AppView.SETTINGS && <Settings />}
            {currentView === AppView.PRIVACY && <Privacy />}
            {currentView === AppView.LEGAL_TERMS && <Legal />}
            {currentView === AppView.BILLING && <Billing />}
            {currentView === AppView.FOUNDER_ADMIN && <FounderAdmin />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
