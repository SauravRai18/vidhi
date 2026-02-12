
import React, { useState } from 'react';
import { studentExplainConcept } from '../services/gemini';
import { ICONS } from '../constants';

const LearningHub: React.FC = () => {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!concept.trim()) return;
    setIsLoading(true);
    const result = await studentExplainConcept(concept);
    setExplanation(result || '');
    setIsLoading(false);
  };

  const suggestions = ['Res Judicata', 'Mens Rea', 'Locus Standi', 'Doctrine of Pith and Substance', 'Adverse Possession'];

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 legal-serif">Concept Explainer</h2>
          <p className="text-slate-500 font-medium">Simplified Indian Law concepts for Students & Academics.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identify Concept</h3>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., Explain Section 498A IPC vs BNS provisions..."
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all resize-none h-40"
            />
            <button
              onClick={handleExplain}
              disabled={isLoading || !concept.trim()}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98] disabled:opacity-30"
            >
              {isLoading ? "Consulting AI Mentor..." : "Generate Explanation"}
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Quick Topics</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setConcept(s)}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
           {!explanation && !isLoading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-6 opacity-20">
                <ICONS.Books />
                <p className="text-xs font-bold uppercase tracking-[0.4em]">Academic Guidance Awaiting Input</p>
             </div>
           ) : isLoading ? (
             <div className="flex-1 p-16 space-y-8 animate-pulse">
                <div className="h-8 bg-slate-100 rounded-xl w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-50 rounded w-full"></div>
                  <div className="h-4 bg-slate-50 rounded w-full"></div>
                  <div className="h-4 bg-slate-50 rounded w-4/5"></div>
                </div>
                <div className="h-40 bg-slate-50 rounded-[2rem]"></div>
             </div>
           ) : (
             <div className="flex-1 p-10 sm:p-16 overflow-y-auto custom-scrollbar prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:legal-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose prose-p:font-medium selection:bg-indigo-100">
               <div className="whitespace-pre-wrap">{explanation}</div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
