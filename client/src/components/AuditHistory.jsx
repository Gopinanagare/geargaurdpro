import React from 'react';

const AuditHistory = ({ historyData, onNavigate, onClearHistory }) => {
  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-4 lg:px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg lg:text-xl font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl lg:text-2xl uppercase">GEARGUARD PRO</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-500">{historyData?.length || 0} Records</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight">Audit Archive</h2>
            <p className="text-xs lg:text-sm text-zinc-500 uppercase tracking-widest mt-1">Reviewing {historyData?.length || 0} recent scans</p>
          </div>
          <div className="flex gap-2">
            {historyData?.length > 0 && (
              <button onClick={onClearHistory} className="border border-red-500/30 text-red-400 px-4 py-2 text-[10px] lg:text-[11px] font-bold tracking-widest rounded-xl hover:bg-red-500/10 transition-all uppercase">
                Clear All
              </button>
            )}
            <button onClick={() => onNavigate('analyze')} className="bg-amber-400 text-zinc-950 px-4 lg:px-6 py-2 text-[11px] lg:text-[12px] font-bold tracking-widest rounded-xl hover:bg-amber-300 transition-all uppercase whitespace-nowrap">
              NEW SCAN
            </button>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
          {historyData && historyData.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {historyData.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => onNavigate('report', item)}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-zinc-900 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      {item.sourceImage && (
                        <div className="w-16 h-10 rounded border border-zinc-700 overflow-hidden hidden sm:block">
                          <img src={item.sourceImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Source" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.status === 'Safe' ? 'bg-green-500/10 border-green-500/30 text-green-500' : item.status === 'Warning' ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                        <span className="material-symbols-outlined">
                          {item.status === 'Safe' ? 'verified' : item.status === 'Warning' ? 'warning' : 'error'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-mono text-sm uppercase">Audit #{item.id?.toString().slice(-6) || idx + 1}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">{item.date} • {item.timestamp}</p>
                      {item.standard && <p className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">{item.standard}</p>}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">RISK</p>
                      <p className={`text-lg font-bold ${(item.risk_score || 0) > 50 ? 'text-red-400' : (item.risk_score || 0) > 30 ? 'text-amber-400' : 'text-green-500'}`}>{item.risk_score}/100</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">COMPONENTS</p>
                      <p className="text-sm font-mono text-on-surface">{item.detected_components?.length || 0}</p>
                    </div>
                    <span className="material-symbols-outlined text-zinc-500 group-hover:text-amber-400 transition-colors">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">folder_off</span>
              <h3 className="text-xl font-bold text-zinc-700 uppercase">No History Found</h3>
              <p className="text-sm text-zinc-600 max-w-xs mt-2 uppercase tracking-wide">Initialize a scan to populate the archive.</p>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-4 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">memory</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Hardware</span>
        </button>
        <button onClick={() => onNavigate('code_audit')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-cyan-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">code</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Code</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-3 transition-all">
          <span className="material-symbols-outlined text-lg">history</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default AuditHistory;
