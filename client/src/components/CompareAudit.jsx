import React, { useState, useRef } from 'react';
import axios from 'axios';

const CompareAudit = ({ onNavigate, showToast }) => {
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [result, setResult] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState(null);
  const fileRefA = useRef(null);
  const fileRefB = useRef(null);

  const handleUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const runComparison = async () => {
    if (!imageA || !imageB) return;
    setIsComparing(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/compare', { imageA, imageB });
      setResult(response.data);
      showToast?.('Comparison complete');
    } catch (err) {
      setError(err.response?.status === 429 ? 'Rate limit reached. Wait and retry.' : 'Comparison failed.');
    } finally {
      setIsComparing(false);
    }
  };

  const impactColor = { positive: 'text-green-400', negative: 'text-red-400', neutral: 'text-zinc-400' };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white font-bold">compare</span>
          </div>
          <div>
            <h1 className="text-purple-400 font-black tracking-tighter text-2xl uppercase leading-none">DIFF AUDIT</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">Multi-Schematic Comparison Engine</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Upload Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { img: imageA, set: setImageA, ref: fileRefA, label: 'DESIGN A', sub: 'Original / Baseline' },
            { img: imageB, set: setImageB, ref: fileRefB, label: 'DESIGN B', sub: 'Revision / Updated' },
          ].map((slot, i) => (
            <div key={i} onClick={() => slot.ref.current.click()} className={`border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative ${slot.img ? 'border-purple-400/50 bg-zinc-900/30' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}>
              {slot.img ? (
                <>
                  <img src={slot.img} className="w-full h-full object-contain" alt={slot.label} />
                  <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-purple-400 text-3xl mb-2">upload_file</span>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">REPLACE</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-4xl text-zinc-700 group-hover:text-purple-400 transition-colors mb-4">add_photo_alternate</span>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{slot.label}</p>
                  <p className="text-[10px] text-zinc-600 uppercase mt-1">{slot.sub}</p>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-zinc-950/80 px-3 py-1 rounded-lg">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{slot.label}</span>
              </div>
              <input type="file" ref={slot.ref} onChange={handleUpload(slot.set)} className="hidden" accept="image/*" />
            </div>
          ))}
        </div>

        <button onClick={runComparison} disabled={!imageA || !imageB || isComparing} className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${(!imageA || !imageB || isComparing) ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-400 hover:-translate-y-1'}`}>
          {isComparing ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Comparing Designs...</>
          ) : (
            <><span className="material-symbols-outlined">compare_arrows</span> Run Diff Audit</>
          )}
        </button>

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
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">Comparison Summary</h3>
              <p className="text-sm text-zinc-400 uppercase leading-relaxed">{result.summary}</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Safer Design:</span>
                <span className={`text-lg font-black uppercase ${result.safer_design === 'Equal' ? 'text-amber-400' : 'text-green-500'}`}>
                  {result.safer_design === 'Equal' ? 'Both Equal' : `Design ${result.safer_design}`}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-2 uppercase">{result.safety_reasoning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Design A Exclusive */}
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Only in Design A
                </h4>
                <div className="space-y-3">
                  {result.design_a_exclusive?.map((item, i) => (
                    <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                      <p className="text-xs font-bold text-zinc-200 uppercase">{item.component} ({item.designator})</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{item.impact}</p>
                    </div>
                  ))}
                  {(!result.design_a_exclusive || result.design_a_exclusive.length === 0) && <p className="text-xs text-zinc-600 uppercase">No exclusive components</p>}
                </div>
              </div>

              {/* Design B Exclusive */}
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span> Only in Design B
                </h4>
                <div className="space-y-3">
                  {result.design_b_exclusive?.map((item, i) => (
                    <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                      <p className="text-xs font-bold text-zinc-200 uppercase">{item.component} ({item.designator})</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{item.impact}</p>
                    </div>
                  ))}
                  {(!result.design_b_exclusive || result.design_b_exclusive.length === 0) && <p className="text-xs text-zinc-600 uppercase">No exclusive components</p>}
                </div>
              </div>
            </div>

            {/* Modifications */}
            {result.modifications?.length > 0 && (
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Modifications Detected</h4>
                <div className="space-y-3">
                  {result.modifications.map((mod, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                      <span className={`material-symbols-outlined text-sm ${impactColor[mod.safety_impact]}`}>
                        {mod.safety_impact === 'positive' ? 'trending_up' : mod.safety_impact === 'negative' ? 'trending_down' : 'trending_flat'}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-200 uppercase">{mod.component}</p>
                        <p className="text-[10px] text-zinc-500">{mod.change}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${impactColor[mod.safety_impact]}`}>{mod.safety_impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cost + Migration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-950 border border-purple-400/20 p-6 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Cost Comparison</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] text-zinc-500 uppercase">Design A</p><p className="text-xl font-black text-zinc-200">${result.cost_difference?.design_a_cost}</p></div>
                  <div><p className="text-[10px] text-zinc-500 uppercase">Design B</p><p className="text-xl font-black text-zinc-200">${result.cost_difference?.design_b_cost}</p></div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] text-green-500 uppercase font-bold">Savings: ${result.cost_difference?.savings}</p>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Recommendation</h4>
                <p className="text-sm text-amber-400 uppercase font-bold leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-4 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">center_focus_weak</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Analyze</span>
        </button>
        <button onClick={() => onNavigate('compare')} className="flex flex-col items-center justify-center text-purple-400 bg-purple-400/5 py-3 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">compare</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Compare</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span><span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default CompareAudit;
