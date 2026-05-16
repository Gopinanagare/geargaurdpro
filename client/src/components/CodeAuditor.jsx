import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const CodeAuditor = ({ onNavigate, showToast }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.zip')) {
        setErrorMessage('Please upload a .zip file.');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('File exceeds 50MB limit.');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
      setSelectedFile(file);
      setAuditResult(null);
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setErrorMessage(null);
    setAuditResult(null);
    
    const phases = [
      'Extracting Archives',
      'Mapping File Tree',
      'Identifying Languages',
      'Structural Pattern Analysis',
      'Forensic Code Inspection',
      'Workflow Logic Reconstruction',
      'Market Opportunity Mapping',
      'Profit Potential Estimation',
      'Finalizing Business Strategy'
    ];
    
    let phaseIdx = 0;
    setScanPhase(phases[0]);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 0.5;
        const newPhaseIdx = Math.min(Math.floor(next / (100 / phases.length)), phases.length - 1);
        if (newPhaseIdx !== phaseIdx) {
          phaseIdx = newPhaseIdx;
          setScanPhase(phases[phaseIdx]);
        }
        if (next >= 98) {
          clearInterval(interval);
          return 98;
        }
        return next;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append('projectZip', selectedFile);

      const response = await axios.post('/api/code-audit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      clearInterval(interval);
      setScanProgress(100);
      setScanPhase('Analysis Complete');
      
      setTimeout(() => {
        setIsScanning(false);
        setAuditResult(response.data);
        showToast('Codebase Audit Complete');
      }, 800);
    } catch (error) {
      clearInterval(interval);
      setIsScanning(false);
      setScanProgress(0);
      const msg = error.response?.status === 429 
        ? 'Rate limit reached. Wait and retry.'
        : 'Forensic Engine failed. Check server status.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-4 lg:px-6 py-3 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg font-bold">code</span>
          </div>
          <h1 className="text-cyan-400 font-black tracking-tighter text-xl uppercase leading-none">CODEBASE AUDITOR</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">CODE ANALYZER v1.0</span>
            <span className="text-[9px] font-bold text-cyan-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span> ONLINE
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto lg:overflow-hidden pb-24 lg:pb-4">
        {/* Left Side: Upload & Progress */}
        <div className="lg:col-span-4 space-y-6 flex flex-col lg:overflow-y-auto pr-0 lg:pr-2">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">Project Ingestion</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide leading-relaxed">Upload a .zip file of your project code for deep architectural and business analysis.</p>
          </div>

          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className={`relative border-2 border-dashed transition-all cursor-pointer group rounded-2xl h-40 flex flex-col items-center justify-center overflow-hidden flex-shrink-0
              ${selectedFile ? 'border-cyan-400/50 bg-cyan-400/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}
            `}
          >
            {selectedFile ? (
              <div className="text-center p-4">
                <span className="material-symbols-outlined text-cyan-400 text-4xl mb-2">zip_box</span>
                <p className="text-xs font-bold text-zinc-300 uppercase truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <div className="mt-3 px-3 py-1 bg-zinc-800 rounded-full text-[8px] font-bold text-cyan-400 uppercase tracking-widest">READY TO SCAN</div>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl text-zinc-600 group-hover:text-cyan-400 transition-colors">upload</span>
                </div>
                <p className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 uppercase tracking-widest">Select Project ZIP</p>
                <p className="text-[9px] text-zinc-600 uppercase mt-1">Maximum size 50MB</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".zip" />
          </div>

          {/* Scan Progress */}
          {isScanning && (
            <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{scanPhase}</p>
                <p className="text-xl font-black text-cyan-400 font-mono">{Math.round(scanProgress)}%</p>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 rounded-full" 
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="text-[8px] text-zinc-500 font-bold uppercase">Threads: <span className="text-zinc-300">Active</span></div>
                <div className="text-[8px] text-zinc-500 font-bold uppercase text-right">Enc: <span className="text-zinc-300">UTF-8</span></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-lg">error</span>
              <p className="text-[10px] font-bold text-red-400 uppercase leading-tight">{errorMessage}</p>
            </div>
          )}

          <button 
            onClick={startAnalysis}
            disabled={!selectedFile || isScanning}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl
              ${!selectedFile || isScanning 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-cyan-400 text-zinc-950 hover:bg-cyan-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-cyan-400/20'}
            `}
          >
            {isScanning ? (
              <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
            )}
            {isScanning ? 'ANALYZING...' : 'INITIATE CODE AUDIT'}
          </button>
        </div>

        {/* Right Side: Analysis Results */}
        <div className="lg:col-span-8 bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full relative">
          {!auditResult && !isScanning ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-4xl text-zinc-700">source</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-500">Awaiting Code Ingestion</h3>
              <p className="text-[10px] text-zinc-700 mt-3 uppercase tracking-widest max-w-xs leading-loose">
                Upload your project zip to see architecture, workflow, and financial potential.
              </p>
            </div>
          ) : isScanning ? (
            <div className="h-full flex flex-col items-center justify-center p-12 space-y-6">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-400/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-b-4 border-cyan-400 animate-spin"></div>
                  </div>
                  <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-3xl text-cyan-400 animate-pulse">neurology</span>
               </div>
               <div className="text-center">
                 <p className="text-xs font-black text-cyan-400 uppercase tracking-widest animate-pulse">Deep Learning Model Processing</p>
                 <p className="text-[10px] text-zinc-600 uppercase mt-2">Correlating code patterns with market data...</p>
               </div>
            </div>
          ) : (
            <div id="audit-report-content" className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Project Header */}
              <div className="border-b border-zinc-800 pb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-tighter">{auditResult.project_name}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">language</span> {auditResult.primary_language}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">account_tree</span> {auditResult.architecture_type}
                    </span>
                  </div>
                </div>
                <div className="bg-cyan-400/10 border border-cyan-400/30 px-4 py-2 rounded-xl text-right">
                  <p className="text-[8px] font-bold text-zinc-500 uppercase">Est. Valuation</p>
                  <p className="text-lg font-black text-cyan-400 leading-none">{auditResult.business_opportunity?.estimated_valuation || 'TBD'}</p>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Purpose & Workflow */}
                <section className="space-y-4">
                  <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-sm">target</span> Core Purpose
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{auditResult.purpose}</p>
                  </div>
                  <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-sm">rebase_edit</span> System Workflow
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">{auditResult.workflow}</p>
                  </div>
                </section>

                {/* Business Opportunity */}
                <section className="space-y-4">
                  <div className="bg-cyan-400/5 p-5 rounded-2xl border border-cyan-400/20">
                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">payments</span> Business Potential
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Market Fit</p>
                        <p className="text-xs text-zinc-300 font-medium">{auditResult.business_opportunity?.market_fit}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Earning Pot.</p>
                          <p className="text-xs text-green-400 font-bold">{auditResult.business_opportunity?.earning_potential}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Profit Model</p>
                          <p className="text-xs text-cyan-400 font-bold">{auditResult.business_opportunity?.profit_model}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-sm">inventory_2</span> Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {auditResult.tech_stack?.map((tech, i) => (
                        <span key={i} className="text-[9px] font-bold text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">{tech}</span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Suggestions */}
              <section className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-sm">lightbulb</span> Strategic Suggestions
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {auditResult.suggestions?.map((sug, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></span>
                      <p className="text-xs text-zinc-500 leading-tight">{sug}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 w-full grid grid-cols-4 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-cyan-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">memory</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Hardware</span>
        </button>
        <button onClick={() => onNavigate('code_audit')} className="flex flex-col items-center justify-center text-cyan-400 bg-cyan-400/5 py-2.5 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">code</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Code Audit</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-cyan-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Archive</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
};

export default CodeAuditor;
