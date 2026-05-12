import React, { useMemo } from 'react';

const Dashboard = ({ onNavigate, historyData = [] }) => {
  const stats = useMemo(() => {
    const total = historyData.length;
    const safe = historyData.filter(h => h.status === 'Safe').length;
    const warning = historyData.filter(h => h.status === 'Warning').length;
    const critical = historyData.filter(h => h.status === 'Critical').length;
    const avgRisk = total ? Math.round(historyData.reduce((s, h) => s + (h.risk_score || 0), 0) / total) : 0;
    const avgHealth = 100 - avgRisk;
    const totalComponents = historyData.reduce((s, h) => s + (h.detected_components?.length || 0), 0);
    return { total, safe, warning, critical, avgRisk, avgHealth, totalComponents };
  }, [historyData]);

  return (
    <div className="bg-background text-on-background h-screen flex flex-col font-inter overflow-hidden">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-3 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl uppercase leading-none">GEARGUARD AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Engine v5.0</span>
            <span className="text-[9px] font-bold text-green-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full overflow-hidden flex flex-col gap-4">
        {/* Primary Action: New Scan (Large & Intuitive) */}
        <section 
          onClick={() => onNavigate('analyze')} 
          className="bg-amber-400 border border-amber-500 p-8 rounded-3xl flex flex-col justify-center items-center text-center group cursor-pointer active:scale-[0.98] transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] flex-shrink-0 relative overflow-hidden"
        >
          {/* Subtle background animation or icon */}
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-zinc-950 text-[120px]">analytics</span>
          </div>
          
          <div className="relative z-10">
            <span className="material-symbols-outlined text-zinc-950 text-6xl mb-4 group-hover:scale-110 transition-transform">add_circle</span>
            <h3 className="text-3xl font-black text-zinc-950 mb-2 uppercase tracking-tighter">START NEW AUDIT SCAN</h3>
            <p className="text-zinc-900/70 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
              Ready to verify system safety? Upload your schematic and logic for an instant AI-powered compliance check.
            </p>
            <div className="mt-8 px-10 py-3 bg-zinc-950 text-amber-400 rounded-full text-xs font-black tracking-[0.2em] group-hover:bg-zinc-900 transition-colors uppercase shadow-xl">
              LAUNCH ANALYZER
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
          {/* Global Safety Health Score (Condensed) */}
          <section className="md:col-span-4 bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between min-h-0">
            <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 mb-2 uppercase">SAFETY HEALTH SCORE</h2>
            <p className="text-[9px] text-zinc-600 uppercase tracking-tight mb-4">Real-time aggregate reliability metrics across all systems.</p>
            <div className="flex flex-col items-center gap-4 flex-1 justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-zinc-800" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className={stats.avgHealth > 70 ? 'text-green-500' : stats.avgHealth > 40 ? 'text-amber-400' : 'text-red-500'} cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * stats.avgHealth / 100)} strokeWidth="8" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-on-surface">{stats.avgHealth || '--'}</span>
                  <span className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase">{stats.avgHealth > 70 ? 'NOMINAL' : stats.avgHealth > 40 ? 'CAUTION' : 'CRITICAL'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50 text-center">
                  <p className="text-[8px] font-bold text-zinc-500 uppercase mb-0.5">SAFE</p>
                  <p className="font-mono text-sm text-green-400">{stats.safe}</p>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50 text-center">
                  <p className="text-[8px] font-bold text-zinc-500 uppercase mb-0.5">ALERTS</p>
                  <p className="font-mono text-sm text-red-400">{stats.critical + stats.warning}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Features Grid */}
          <section className="md:col-span-3 grid grid-rows-2 gap-3 min-h-0">
            {[
              { icon: 'build', label: 'Maintenance', desc: 'Manage repair schedules and parts.', view: 'maintenance', color: 'text-cyan-400 bg-cyan-400/5 border-cyan-400/20' },
              { icon: 'menu_book', label: 'Knowledge', desc: 'Access component datasheets and guides.', view: 'knowledge', color: 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' },
            ].map(card => (
              <button key={card.view} onClick={() => onNavigate(card.view)} className={`p-4 rounded-2xl border transition-all hover:bg-zinc-900 text-left flex flex-col justify-center gap-1 ${card.color}`}>
                <span className="material-symbols-outlined text-xl">{card.icon}</span>
                <p className="text-[10px] font-black uppercase tracking-tight">{card.label}</p>
                <p className="text-[8px] text-zinc-500 uppercase tracking-wider">{card.desc}</p>
              </button>
            ))}
          </section>

          {/* Recent Activity (Limit to 2) */}
          <section className="md:col-span-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
            <div className="px-5 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/30 flex-shrink-0">
              <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">RECENT ACTIVITY</h2>
              <button onClick={() => onNavigate('history')} className="text-amber-400 text-[10px] font-bold tracking-widest hover:underline uppercase">ARCHIVE</button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-zinc-800/30">
              {historyData.length > 0 ? (
                historyData.slice(0, 2).map((item, idx) => (
                  <div key={item.id || idx} onClick={() => onNavigate('report', item)} className="px-5 py-3 flex items-center gap-3 hover:bg-zinc-900 transition-colors cursor-pointer">
                    <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${item.status === 'Safe' ? 'bg-green-500' : item.status === 'Warning' ? 'bg-amber-400' : 'bg-red-500'}`}></div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold uppercase truncate">Audit #{item.id?.toString().slice(-6) || idx + 1}</p>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase truncate">{item.date} • {item.timestamp}</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase flex-shrink-0 ${item.status === 'Safe' ? 'border-green-500/30 text-green-500' : item.status === 'Warning' ? 'border-amber-400/30 text-amber-400' : 'border-red-500/30 text-red-500'}`}>
                      {item.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 opacity-30">
                  <span className="material-symbols-outlined text-2xl mb-2">folder_off</span>
                  <p className="text-[10px] uppercase font-bold tracking-widest">No Recent Audits</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 w-full grid grid-cols-3 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-2.5 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span><span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">center_focus_weak</span><span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Analyze</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span><span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
