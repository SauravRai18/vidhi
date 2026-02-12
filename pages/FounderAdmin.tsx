
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const FounderAdmin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.founder.getPlatformStats().then(data => {
      setStats(data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-20 text-center text-slate-400">Loading Platform Intelligence...</div>;
  if (!stats) return <div className="p-20 text-center text-red-500">Access Denied: Founder Level Required</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-900 legal-serif tracking-tight">Ecosystem Command</h1>
        <p className="text-slate-500 font-medium">Global platform health and tenant lifecycle monitoring.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Registered Firms', val: stats.totalFirms, color: 'text-indigo-600' },
          { label: 'Licensed Counsels', val: stats.totalUsers, color: 'text-emerald-600' },
          { label: 'Active 60m Sessions', val: stats.activeSessions, color: 'text-amber-600' }
        ].map(card => (
          <div key={card.label} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{card.label}</p>
            <p className={`text-5xl font-bold mt-4 ${card.color}`}>{card.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold legal-serif">Real-time Platform Audit</h3>
            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-4 py-2 rounded-xl uppercase tracking-widest">Streaming Logs</span>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-3 pr-4 custom-scrollbar">
            {stats.recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-center gap-6 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-24 shrink-0 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-indigo-400">{log.action}</p>
                  <p className="text-[10px] text-slate-400">Firm: {log.firmId} • User: {log.userId}</p>
                </div>
                {log.metadata && (
                  <div className="text-[9px] font-mono opacity-30 text-emerald-400">
                    {JSON.stringify(log.metadata).slice(0, 40)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default FounderAdmin;
