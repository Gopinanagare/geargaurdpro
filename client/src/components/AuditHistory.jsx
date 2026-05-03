import React from 'react';

const AuditHistory = ({ historyData, onNavigate }) => {
  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      {/* TopAppBar */}
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKaTnpgpRoadPFdgYNfMFJ12A5PAdbGG58_JnBXsxBPoMjC8A_vZLM_AUc-Nq7wkezk633McmkPYsp2LSPqjcXhE3wyRdyDWkLi-jb49vQWwY4HXCq5girQPJt8eBS7XvWcDiLL6PpzwOtkFflar6Ox5EJzchrSg4K9dz_JmHs4pB2srVrUePzZj5PQMxpvGO3L-ZndaDVJdJPDR3jAa9CRQ1yc_hczqU1jdikukHH_AVimymwEKwaSAvlUdfFWiS0cjSvB6n12CE" 
              alt="Logo"
            />
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl uppercase">GEARGUARD AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-500 uppercase">AUDIT HISTORY LOG</span>
          <button className="material-symbols-outlined text-amber-400 hover:bg-zinc-900 transition-colors p-2 rounded">notifications</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-tight">Audit Archive</h2>
            <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">Reviewing {historyData?.length || 0} recent scans</p>
          </div>
          <button 
            onClick={() => onNavigate('analyze')}
            className="bg-amber-400 text-zinc-950 px-6 py-2 text-[12px] font-bold tracking-widest rounded hover:bg-amber-300 transition-all uppercase"
          >
            NEW SCAN
          </button>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded overflow-hidden">
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
                          <img src={item.sourceImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Audit Source" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded flex items-center justify-center border ${item.status === 'Safe' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
                        <span className="material-symbols-outlined">
                          {item.status === 'Safe' ? 'verified' : 'warning'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-mono text-sm uppercase">Audit #{item.id?.toString().slice(-6) || idx + 1}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">
                        {item.date} • {item.timestamp}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">RISK SCORE</p>
                      <p className={`text-lg font-bold ${item.risk_score > 50 ? 'text-amber-400' : 'text-green-500'}`}>{item.risk_score}/100</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">COMPONENTS</p>
                      <p className="text-sm font-mono text-on-surface">{item.detected_components?.length || 0} DETECTED</p>
                    </div>
                    <button className="material-symbols-outlined text-zinc-500 group-hover:text-amber-400 transition-colors">chevron_right</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">folder_off</span>
              <h3 className="text-xl font-bold text-zinc-700 uppercase">No History Found</h3>
              <p className="text-sm text-zinc-600 max-w-xs mt-2 uppercase tracking-wide">
                Initialize a vision scan in the Analyze section to populate the archive.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Simplified Navigation */}
      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-2 items-center bg-zinc-900 pb-safe border-t border-zinc-800 z-50">
        <button 
          onClick={() => onNavigate('analyze')}
          className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800"
        >
          <span className="material-symbols-outlined">center_focus_weak</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">Analyze</span>
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-3 transition-all"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">History Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default AuditHistory;
