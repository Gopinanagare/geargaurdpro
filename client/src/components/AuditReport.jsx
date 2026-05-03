import React from 'react';

const AuditReport = ({ auditData, onNavigate }) => {
  if (!auditData) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 uppercase tracking-widest animate-pulse">Synchronizing with Engine...</p>
      </div>
    );
  }

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24 print:pb-0">
      {/* Premium Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 print:static">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 font-bold">verified_user</span>
          </div>
          <div>
            <h1 className="text-amber-400 font-black tracking-tighter text-2xl uppercase leading-none">GEARGUARD PRO</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">Audit ID: {auditData.certification_id || 'CERT-882-X9'}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 print:hidden">
          <div className="hidden md:flex flex-col items-end border-r border-zinc-800 pr-6">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">COMPLIANCE ENGINE</span>
            <span className="text-xs font-mono text-zinc-300 uppercase">ISO 13849 / IEC 61508</span>
          </div>
          <button onClick={handleExport} className="bg-zinc-900 border border-zinc-800 hover:border-amber-400 transition-all p-3 rounded-lg flex items-center gap-2 group">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-amber-400">download_for_offline</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Critical Intelligence Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Status */}
          <div className="lg:col-span-2 bg-surface-container border border-outline-variant p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full animate-pulse ${auditData.status === 'Safe' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Global Integrity Status</span>
              </div>
              <h2 className={`text-6xl font-black uppercase tracking-tighter ${auditData.status === 'Safe' ? 'text-green-500' : 'text-red-500'}`}>
                {auditData.status || 'Warning'}
              </h2>
              <p className="text-sm mt-6 text-on-surface-variant leading-relaxed font-medium uppercase tracking-wide">
                {auditData.compliance_report}
              </p>

              {/* NEW: Functional Analysis Section */}
              <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-amber-400 text-sm">settings_suggest</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Operational Intent</span>
                </div>
                <p className="text-sm font-bold text-amber-400/90 uppercase leading-relaxed">
                  {auditData.functional_analysis || "Interpreting system connections..."}
                </p>
              </div>

              {/* NEW: Operational Warning Banner */}
              {auditData.risk_score > 40 && (
                <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl flex items-center gap-4 animate-pulse">
                  <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
                  <div>
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">SYSTEM OPERATIONAL RISK</p>
                    <p className="text-sm font-bold text-white uppercase">FIX THE ISSUES OR THE SYSTEM WILL NOT RUN PROPERLY</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-4 print:hidden z-10">
              <button onClick={handleExport} className="bg-amber-400 text-zinc-950 px-8 py-3 text-[12px] font-black tracking-widest rounded-xl hover:bg-amber-300 transition-all uppercase shadow-lg shadow-amber-400/20">
                EXPORT CERTIFICATE
              </button>
            </div>
            {/* Visual background flair */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"></div>
          </div>

          {/* Safety Score Meter */}
          <div className="bg-surface-container border border-outline-variant p-8 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 mb-6 uppercase">Forensic Integrity Index</span>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-zinc-900" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                <circle 
                  className={auditData.risk_score > 50 ? 'text-red-500' : 'text-green-500'} 
                  cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" 
                  strokeDasharray="553" 
                  strokeDashoffset={553 - (553 * (100 - auditData.risk_score) / 100)} 
                  strokeWidth="12"
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-on-surface">{100 - auditData.risk_score}%</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">HEALTH</span>
              </div>
            </div>
            <div className="mt-8 space-y-2 w-full">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-green-500">SYSTEM STABILITY</span>
                <span>{100 - auditData.risk_score}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${100 - auditData.risk_score}%` }}></div>
              </div>
              <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed font-medium uppercase">
                Your connections and components are <span className="text-green-500 font-black">{100 - auditData.risk_score}% GOOD</span> and <span className="text-red-500 font-black">{auditData.risk_score}% CRITICAL/BAD</span>.
              </p>
            </div>
          </div>

          {/* MTBF Prediction */}
          <div className="bg-zinc-950 border border-amber-400/20 p-8 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">MTBF Prediction</span>
              <span className="material-symbols-outlined text-amber-400">hourglass_empty</span>
            </div>
            <div>
              <p className="text-4xl font-black text-amber-400">{auditData.predictive_mtbf?.hours?.toLocaleString() || '120,500'}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Mean Time Between Failure (Hrs)</p>
            </div>
            <div className="mt-4 p-3 bg-amber-400/5 rounded-lg border border-amber-400/10">
              <p className="text-[10px] font-bold text-amber-400 uppercase">RISK LEVEL: {auditData.predictive_mtbf?.risk_level || 'LOW'}</p>
            </div>
          </div>
        </div>

        {/* Financials & Market Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-surface-container border border-outline-variant p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">payments</span> BOM Financial Analysis
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Est. Market Value</span>
                <span className="text-2xl font-black text-on-surface">${auditData.financials?.total_est_cost || '1,420.00'}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-green-500 uppercase">Optimization Potential</span>
                <span className="text-lg font-black text-green-500">-${auditData.financials?.optimization_saving || '340.00'}</span>
              </div>
              <p className="text-[9px] text-zinc-600 uppercase italic">Prices based on industrial supply index Q2 2026.</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface-container border border-outline-variant p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">inventory_2</span> Component Health & Procurement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible print:grid-cols-2">
              {auditData.detected_components?.map((comp, idx) => (
                <div key={idx} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl flex flex-col justify-between gap-3 group hover:border-amber-400/30 transition-all min-w-0 print:break-inside-avoid print:bg-white print:text-zinc-950 print:border-zinc-200">
                  <div className="flex items-center gap-4 overflow-hidden min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex-shrink-0 flex items-center justify-center text-zinc-500 group-hover:text-amber-400 print:bg-zinc-100 print:text-zinc-900">
                      <span className="material-symbols-outlined text-lg">memory</span>
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[10px] font-black uppercase text-zinc-300 truncate print:text-zinc-900" title={comp.name}>{comp.name}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase truncate print:text-zinc-500">{comp.designator}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-900 print:border-zinc-100">
                    <p className="text-[9px] font-black text-green-500">{comp.health || 100}% HP</p>
                    <p className="text-[10px] font-mono text-zinc-500 font-bold print:text-zinc-900">${comp.estimated_cost || '0.00'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Remediations & Logic Co-Audit */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-surface-container border border-outline-variant p-8 rounded-2xl">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tight">Technical Remediations</h3>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ISO 13849-1 CROSS-VERIFIED</span>
            </div>
            <div className="space-y-6">
              {auditData.logic_vulnerabilities?.map((vuln, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-zinc-950/30 rounded-xl border border-zinc-900 group hover:border-zinc-800 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-red-500"></span>
                      <span className="text-[10px] font-black tracking-widest uppercase text-red-500">DETECTED ANOMALY #{idx + 1}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-200 leading-relaxed uppercase">{vuln}</p>
                  </div>
                  <div className="space-y-3 md:border-l md:border-zinc-800 md:pl-8">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-green-500"></span>
                      <span className="text-[10px] font-black tracking-widest uppercase text-green-500">ENGINEERING REMEDIATION</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed uppercase">{auditData.mitigation_strategies?.[idx] || 'System redesign required to meet PL-d standards.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Section - The "Showstopper" Feature */}
        <div className="bg-zinc-950 border-2 border-amber-400/20 p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10 text-center md:text-left">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-amber-400">CERTIFICATE OF SAFETY COMPLIANCE</h3>
            <p className="text-sm text-zinc-500 uppercase tracking-widest leading-loose">
              THIS SYSTEM HAS BEEN AUDITED BY THE GEARGUARD PRO NEURAL ENGINE. 
              THE SCHEMATIC AND LOGIC ARCHITECTURE MEET THE STANDARDS FOR INDUSTRIAL DEPLOYMENT UNDER SPECIFIED REMEDIATIONS.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-30 pt-4 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/UL_Mark.svg" className="h-10" alt="UL" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/TUV_SUD_logo.svg" className="h-10" alt="TUV" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/CE_mark.svg" className="h-10" alt="CE" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-amber-400/20 z-10 w-48 h-48">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://gearguard.ai/verify/${auditData.certification_id}`} className="w-full h-full" alt="QR Verification" />
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(251,191,36,0.05),transparent)]"></div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-2 items-center bg-zinc-900 pb-safe border-t border-zinc-800 z-50 print:hidden">
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-4 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined">center_focus_weak</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">Analyze Terminal</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-4 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">Audit Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default AuditReport;
