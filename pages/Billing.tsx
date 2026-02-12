
import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import { authService } from '../services/auth';

const Billing: React.FC = () => {
  const user = authService.getSession();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(user?.tier || 'BASIC');

  const plans = [
    {
      id: 'STUDENT',
      name: 'Academic',
      price: '₹499',
      period: 'per year',
      features: ['Judgment Summarizer', 'Concept Explainer', 'Moot Toolkit', '50 Credits/mo'],
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'BASIC',
      name: 'Solo Advocate',
      price: '₹1,999',
      period: 'per month',
      features: ['Matter Workspace', 'AI Drafting (Standard)', 'BNS Mapping', '200 Credits/mo'],
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'PRO',
      name: 'Senior Counsel',
      price: '₹4,999',
      period: 'per month',
      features: ['Strategic Research', 'Advanced Drafting', 'Full Court Templates', '1,000 Credits/mo'],
      color: 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200'
    },
    {
      id: 'ENTERPRISE',
      name: 'Law Firm',
      price: 'Custom',
      period: 'Contact Us',
      features: ['Firm-wide Knowledge Base', 'Multi-user Collaboration', 'Audit Logs', 'Unlimited Credits'],
      color: 'bg-slate-900 text-white'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-bold text-slate-900 legal-serif tracking-tight">Enterprise Infrastructure</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">Choose a subscription tier that powers your legal intelligence. All plans are GST-compliant and support secure firm isolation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`flex flex-col rounded-[3.5rem] p-10 border border-slate-100 transition-all ${
              selectedPlan === plan.id ? 'ring-4 ring-indigo-500/20 scale-105 shadow-2xl' : 'bg-white hover:border-indigo-300'
            } ${plan.color.includes('bg-indigo-600') || plan.color.includes('bg-slate-900') ? plan.color : 'bg-white'}`}
          >
            <div className="mb-10">
               <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ${
                 plan.color.includes('bg-indigo-600') || plan.color.includes('bg-slate-900') ? 'bg-white/10' : 'bg-slate-100 text-slate-500'
               }`}>
                 {plan.name}
               </span>
               <div className="mt-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-xs font-bold opacity-50 block mt-1 tracking-widest uppercase">{plan.period}</span>
               </div>
            </div>

            <ul className="flex-1 space-y-5 mb-10">
               {plan.features.map(f => (
                 <li key={f} className="flex items-center gap-3 text-xs font-bold leading-relaxed">
                   <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} /></svg>
                   {f}
                 </li>
               ))}
            </ul>

            <button 
              onClick={() => setSelectedPlan(plan.id as SubscriptionTier)}
              className={`w-full py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
                plan.color.includes('text-white') ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-900 text-white'
              }`}
            >
              {user?.tier === plan.id ? 'Current Plan' : 'Upgrade Workspace'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
         <div className="flex-1">
            <h4 className="text-2xl font-bold legal-serif mb-2">Usage Intelligence</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">You have utilized <span className="text-slate-900 font-bold">{user?.usage.researchCredits}</span> of <span className="text-slate-900 font-bold">{user?.usage.maxResearchCredits}</span> high-accuracy research credits for the current billing cycle.</p>
         </div>
         <div className="w-full md:w-96">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(user?.usage.researchCredits! / user?.usage.maxResearchCredits!) * 100}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 text-center">Renewal on 1st {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(undefined, { month: 'long' })}</p>
         </div>
      </div>
    </div>
  );
};

export default Billing;
