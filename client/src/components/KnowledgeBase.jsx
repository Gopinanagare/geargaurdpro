import React, { useState } from 'react';
import axios from 'axios';

const KnowledgeBase = ({ onNavigate, showToast }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gearguard_kb_recent') || '[]'); } catch { return []; }
  });

  const search = async (searchQuery) => {
    const q = searchQuery || query.trim();
    if (!q || isSearching) return;
    setIsSearching(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/knowledge', { componentName: q, query: q });
      setResult(response.data);
      const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('gearguard_kb_recent', JSON.stringify(updated));
    } catch (err) {
      setError(err.response?.status === 429 ? 'Rate limit reached. Wait and retry.' : 'Knowledge lookup failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const suggestions = ['ESP32', 'Relay 24V', '555 Timer', 'LM7805', 'MOSFET IRF540', 'Capacitor 100uF', 'Arduino Nano', 'PLC Siemens S7'];

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-xl font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-2xl uppercase leading-none">GEARGUARD AI</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="Search any component, IC, sensor..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>
          <button onClick={() => search()} disabled={!query.trim() || isSearching} className="bg-emerald-500 text-white px-6 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            {isSearching ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span> : 'Search'}
          </button>
        </div>

        {/* Suggestions */}
        {!result && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Popular Components</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s); search(s); }} className="text-[11px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:border-emerald-400/30 hover:text-emerald-400 transition-all uppercase tracking-wider">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {recentSearches.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => { setQuery(s); search(s); }} className="text-[11px] font-bold text-zinc-500 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg hover:text-emerald-400 transition-all uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">history</span> {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm font-bold text-red-400 uppercase">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-surface-container border border-outline-variant p-8 rounded-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-emerald-400 uppercase">{result.component_name}</h2>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{result.description}</p>
                </div>
                {result.market_price && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Market Price</p>
                    <p className="text-xl font-black text-on-surface">${result.market_price.min} - ${result.market_price.max}</p>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              {result.specifications && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                  {Object.entries(result.specifications).map(([key, val]) => val && (
                    <div key={key} className="bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">{key.replace(/_/g, ' ')}</p>
                      <p className="text-xs font-bold text-zinc-200 mt-1 uppercase">{val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Failure Modes */}
            {result.failure_modes?.length > 0 && (
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-red-400">report_problem</span> Failure Modes
                </h3>
                <div className="space-y-3">
                  {result.failure_modes.map((fm, i) => (
                    <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-zinc-200 uppercase">{fm.mode}</p>
                        <span className="text-[10px] font-black text-amber-400 uppercase">{fm.probability}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2">{fm.prevention}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {result.alternatives?.length > 0 && (
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-cyan-400">swap_horiz</span> Compatible Alternatives
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.alternatives.map((alt, i) => (
                    <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:border-emerald-400/30 transition-all cursor-pointer" onClick={() => { setQuery(alt.name); search(alt.name); }}>
                      <p className="text-xs font-bold text-zinc-200 uppercase">{alt.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{alt.compatibility}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">{alt.price_range}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications + Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.applications?.length > 0 && (
                <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Industrial Applications</h3>
                  <div className="space-y-2">
                    {result.applications.map((app, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-sm">arrow_right</span>
                        <p className="text-xs text-zinc-400 uppercase">{app}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.safety_certifications?.length > 0 && (
                <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Safety Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.safety_certifications.map((cert, i) => (
                      <span key={i} className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg uppercase">{cert}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setResult(null)} className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-emerald-400 transition-all">← Back to Search</button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-3 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">center_focus_weak</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Analyze</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default KnowledgeBase;
