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
    <div className="bg-background text-on-background min-h-screen flex flex-col font-inter">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-3 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl uppercase">GEARGUARD AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Engine v5.0</span>
            <span className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>
          <button className="text-zinc-500 hover:bg-zinc-900 transition-colors p-2 rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            {stats.critical > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-zinc-950"></span>}
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 pb-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 stagger-children">
          {/* Global Safety Score */}
          <section className="md:col-span-8 bg-surface-container border border-outline-variant p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant mb-6 uppercase">GLOBAL SAFETY HEALTH SCORE</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-zinc-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className={stats.avgHealth > 70 ? 'text-green-500' : stats.avgHealth > 40 ? 'text-amber-400' : 'text-red-500'} cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset={552.92 - (552.92 * stats.avgHealth / 100)} strokeWidth="12" strokeLinecap="round"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl md:text-5xl font-bold text-on-surface">{stats.avgHealth || '--'}</span>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{stats.avgHealth > 70 ? 'NOMINAL' : stats.avgHealth > 40 ? 'CAUTION' : 'CRITICAL'}</span>
                  </div>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 border-l-2 border-green-500 rounded-r-xl">
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-1 uppercase">SAFE AUDITS</p>
                      <p className="font-mono text-xl text-green-400">{stats.safe}</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 border-l-2 border-amber-400 rounded-r-xl">
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-1 uppercase">WARNINGS</p>
                      <p className="font-mono text-xl text-amber-400">{stats.warning}</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 border-l-2 border-red-500 rounded-r-xl">
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-1 uppercase">CRITICAL</p>
                      <p className="font-mono text-xl text-red-400">{stats.critical}</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 border-l-2 border-cyan-400 rounded-r-xl">
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-1 uppercase">COMPONENTS</p>
                      <p className="font-mono text-xl text-cyan-400">{stats.totalComponents}</p>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {stats.total === 0 ? 'No audits performed yet. Start a scan to populate your dashboard.' : `${stats.total} audit${stats.total > 1 ? 's' : ''} performed. Average health: ${stats.avgHealth}%.`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Action */}
          <section onClick={() => onNavigate('analyze')} className="md:col-span-4 bg-primary-container border border-primary-container p-6 rounded-2xl flex flex-col justify-center items-center text-center group cursor-pointer active:opacity-90 transition-all hover:-translate-y-1">
            <span className="material-symbols-outlined text-on-primary-container text-5xl mb-4">center_focus_weak</span>
            <h3 className="text-2xl font-bold text-on-primary-container mb-2">NEW SCAN</h3>
            <p className="text-sm text-on-primary-container/80 max-w-[200px]">Initiate AI-powered hardware audit with thermal & EMC analysis.</p>
            <div className="mt-6 px-6 py-2 border-2 border-on-primary-container/20 rounded-xl text-[12px] font-bold tracking-widest text-on-primary-container group-hover:bg-on-primary-container group-hover:text-primary-container transition-colors uppercase">START SCAN</div>
          </section>

          {/* Feature Cards */}
          <section className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'compare', label: 'Diff Audit', desc: 'Compare schematics', view: 'compare', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
              { icon: 'build', label: 'Maintenance', desc: 'Predictive schedule', view: 'maintenance', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
              { icon: 'menu_book', label: 'Knowledge', desc: 'Component database', view: 'knowledge', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
              { icon: 'history', label: 'Archive', desc: `${stats.total} audits`, view: 'history', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
            ].map(card => (
              <button key={card.view} onClick={() => onNavigate(card.view)} className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 text-left ${card.color}`}>
                <span className="material-symbols-outlined text-2xl mb-3">{card.icon}</span>
                <p className="text-sm font-black uppercase tracking-tight">{card.label}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{card.desc}</p>
              </button>
            ))}
          </section>

          {/* Recent Activity */}
          <section className="md:col-span-12 bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase">RECENT AUDIT ACTIVITY</h2>
              <button onClick={() => onNavigate('history')} className="text-amber-400 text-[10px] font-bold tracking-widest hover:underline uppercase">VIEW ALL</button>
            </div>
            {historyData.length > 0 ? (
              <div className="divide-y divide-outline-variant/30">
                {historyData.slice(0, 5).map((item, idx) => (
                  <div key={item.id || idx} onClick={() => onNavigate('report', item)} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer">
                    <div className={`w-2 h-10 rounded-full ${item.status === 'Safe' ? 'bg-green-500' : item.status === 'Warning' ? 'bg-amber-400' : 'bg-red-500'}`}></div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold uppercase">Audit #{item.id?.toString().slice(-6) || idx + 1}</p>
                      <p className="font-mono text-[11px] text-zinc-500 uppercase">{item.date} • {item.timestamp}</p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-[10px] text-zinc-500 uppercase">Components</p>
                      <p className="text-sm font-mono">{item.detected_components?.length || 0}</p>
                    </div>
                    <div className={`px-3 py-1 rounded border text-[10px] font-bold uppercase ${item.status === 'Safe' ? 'border-green-500/30 bg-green-500/10 text-green-500' : item.status === 'Warning' ? 'border-amber-400/30 bg-amber-400/10 text-amber-400' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-zinc-800 mb-3">folder_off</span>
                <p className="text-sm text-zinc-600 uppercase tracking-wide">No audits yet — start your first scan</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-4 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-3 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">center_focus_weak</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Analyze</span>
        </button>
        <button onClick={() => onNavigate('compare')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">compare</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Compare</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
