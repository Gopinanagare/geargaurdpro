import React, { useMemo } from 'react';

const AuditReport = ({ auditData, onNavigate, onOpenChat, showToast }) => {
  if (!auditData) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 uppercase tracking-widest animate-pulse">Synchronizing with Engine...</p>
      </div>
    );
  }

  const handleExport = () => window.print();

  const copyBOM = () => {
    const rows = ['Name,Designator,Cost,Health,Category'];
    auditData.detected_components?.forEach(c => {
      rows.push(`"${c.name}","${c.designator}",${c.estimated_cost || 0},${c.health || 100},"${c.category || ''}"`);
    });
    navigator.clipboard.writeText(rows.join('\n'));
    showToast?.('BOM copied as CSV');
  };

  const copyRemediation = () => {
    const text = auditData.technical_anomalies?.map((a, i) =>
      `Issue #${i+1}: ${a.issue}\nFix: ${a.fix}`
    ).join('\n\n');
    navigator.clipboard.writeText(text || '');
    showToast?.('Remediations copied');
  };

  const shareSummary = () => {
    const summary = {
      status: auditData.status,
      risk: auditData.risk_score,
      components: auditData.detected_components?.length,
      standard: auditData.compliance_standard,
      cert: auditData.certification_id
    };
    const encoded = btoa(JSON.stringify(summary));
    navigator.clipboard.writeText(`${window.location.origin}?audit=${encoded}`);
    showToast?.('Share link copied');
  };

  const categoryColors = { power: 'text-red-400', logic: 'text-blue-400', sensor: 'text-cyan-400', actuator: 'text-orange-400', protection: 'text-green-400', passive: 'text-zinc-400', connector: 'text-purple-400' };
  const thermalColors = { low: 'bg-green-500', medium: 'bg-amber-400', high: 'bg-red-500' };

  const healthPercent = 100 - (auditData.risk_score || 0);

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24 print:pb-0">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-4 lg:px-6 py-4 sticky top-0 z-50 print:static">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg lg:text-xl font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl lg:text-2xl uppercase leading-none">GEARGUARD PRO</h1>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 print:hidden">
          <div className="hidden lg:flex flex-col items-end border-r border-zinc-800 pr-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">COMPLIANCE</span>
            <span className="text-xs font-mono text-zinc-300 uppercase">{auditData.compliance_standard || 'ISO 13849'}</span>
          </div>
          <button onClick={onOpenChat} className="bg-zinc-900 border border-zinc-800 hover:border-amber-400 transition-all p-2 lg:p-3 rounded-lg group" title="Ask AI">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-amber-400 text-lg lg:text-xl">smart_toy</span>
          </button>
          <button onClick={handleExport} className="bg-zinc-900 border border-zinc-800 hover:border-amber-400 transition-all p-2 lg:p-3 rounded-lg group">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-amber-400 text-lg lg:text-xl">download_for_offline</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8 stagger-children">
        {/* Top Dashboard Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Status + Functional Analysis */}
          <div className="lg:col-span-2 bg-surface-container border border-outline-variant p-6 lg:p-8 rounded-2xl relative overflow-hidden">
            <div className="z-10 relative">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full animate-pulse ${auditData.status === 'Safe' ? 'bg-green-500' : auditData.status === 'Warning' ? 'bg-amber-400' : 'bg-red-500'}`}></span>
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Global Integrity Status</span>
              </div>
              <h2 className={`text-4xl lg:text-6xl font-black uppercase tracking-tighter ${auditData.status === 'Safe' ? 'text-green-500' : auditData.status === 'Warning' ? 'text-amber-400' : 'text-red-500'}`}>
                {auditData.status || 'Warning'}
              </h2>
              <p className="text-sm mt-6 text-on-surface-variant leading-relaxed font-medium uppercase tracking-wide">{auditData.compliance_report}</p>

              <div className="mt-8 p-4 lg:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-amber-400 text-sm">settings_suggest</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Operational Intent</span>
                </div>
                <p className="text-sm font-bold text-amber-400/90 uppercase leading-relaxed">{auditData.functional_analysis || "Interpreting system connections..."}</p>
              </div>

              {auditData.risk_score > 40 && (
                <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl flex items-center gap-4">
                  <span className="material-symbols-outlined text-red-500 text-2xl lg:text-3xl">warning</span>
                  <div>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">SYSTEM OPERATIONAL RISK</p>
                    <p className="text-sm font-bold text-white uppercase">{auditData.operational_warning || 'Fix issues before deployment'}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3 print:hidden z-10 relative flex-wrap">
              <button onClick={handleExport} className="bg-amber-400 text-zinc-950 px-4 lg:px-6 py-3 text-[10px] lg:text-[11px] font-black tracking-widest rounded-xl hover:bg-amber-300 transition-all uppercase shadow-lg shadow-amber-400/20">EXPORT</button>
              <button onClick={copyBOM} className="border border-zinc-700 text-zinc-400 px-4 py-3 text-[10px] lg:text-[11px] font-black tracking-widest rounded-xl hover:border-amber-400/50 hover:text-amber-400 transition-all uppercase">CSV BOM</button>
              <button onClick={copyRemediation} className="border border-zinc-700 text-zinc-400 px-4 py-3 text-[10px] lg:text-[11px] font-black tracking-widest rounded-xl hover:border-amber-400/50 hover:text-amber-400 transition-all uppercase">COPY FIXES</button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"></div>
          </div>

          {/* Integrity Index */}
          <div className="bg-surface-container border border-outline-variant p-8 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 mb-6 uppercase">Forensic Integrity Index</span>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-zinc-900" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                <circle className={auditData.risk_score > 50 ? 'text-red-500' : auditData.risk_score > 30 ? 'text-amber-400' : 'text-green-500'} cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="553" strokeDashoffset={553 - (553 * healthPercent / 100)} strokeWidth="12" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-on-surface">{healthPercent}%</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">HEALTH</span>
              </div>
            </div>
            <div className="mt-6 space-y-2 w-full">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-green-500">STABILITY</span><span>{healthPercent}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${healthPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* MTBF + Power Budget */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-amber-400/20 p-6 rounded-2xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">MTBF</span>
                <span className="material-symbols-outlined text-amber-400">hourglass_empty</span>
              </div>
              <p className="text-3xl font-black text-amber-400 mt-2">{auditData.predictive_mtbf?.hours?.toLocaleString() || '120,500'}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Hours</p>
              <div className="mt-3 p-2 bg-amber-400/5 rounded-lg border border-amber-400/10">
                <p className="text-[10px] font-bold text-amber-400 uppercase">RISK: {auditData.predictive_mtbf?.risk_level || 'LOW'}</p>
              </div>
            </div>
            {auditData.power_budget && (
              <div className="bg-zinc-950 border border-cyan-400/20 p-6 rounded-2xl">
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">POWER BUDGET</span>
                <p className="text-2xl font-black text-cyan-400 mt-2">{auditData.power_budget.total_consumption_watts}W</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] uppercase">
                  <div><span className="text-zinc-600">Peak</span><p className="font-bold text-zinc-300">{auditData.power_budget.peak_watts}W</p></div>
                  <div><span className="text-zinc-600">Efficiency</span><p className="font-bold text-green-400">{auditData.power_budget.efficiency_percent}%</p></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thermal Zones + EMC */}
        {(auditData.thermal_zones || auditData.emc_analysis) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {auditData.thermal_zones?.length > 0 && (
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-red-400">thermostat</span> Thermal Zone Map
                </h3>
                <div className="space-y-3">
                  {auditData.thermal_zones.map((zone, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800">
                      <div className={`w-3 h-8 rounded-full ${thermalColors[zone.risk] || 'bg-zinc-600'}`}></div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-200 uppercase">{zone.zone}</p>
                        <p className="text-[10px] text-zinc-500">{zone.temperature_estimate}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${zone.risk === 'high' ? 'text-red-400 bg-red-400/10' : zone.risk === 'medium' ? 'text-amber-400 bg-amber-400/10' : 'text-green-400 bg-green-400/10'}`}>{zone.risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {auditData.emc_analysis && (
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-purple-400">wifi_tethering</span> EMC/EMI Analysis
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Susceptibility</p>
                    <p className="text-xs text-zinc-300 uppercase">{auditData.emc_analysis.susceptibility}</p>
                  </div>
                  <div className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Emissions</p>
                    <p className="text-xs text-zinc-300 uppercase">{auditData.emc_analysis.emissions}</p>
                  </div>
                  {auditData.emc_analysis.recommendations?.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-purple-400 text-sm mt-0.5">arrow_right</span>
                      <p className="text-xs text-zinc-400 uppercase">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financials + Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-surface-container border border-outline-variant p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">payments</span> BOM Financial Analysis
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Est. Market Value</span>
                <span className="text-2xl font-black text-on-surface">${auditData.financials?.total_est_cost || '0'}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-green-500 uppercase">Optimization Potential</span>
                <span className="text-lg font-black text-green-500">-${auditData.financials?.optimization_saving || '0'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface-container border border-outline-variant p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">inventory_2</span> Component Health
              </h3>
              <button onClick={copyBOM} className="text-[10px] font-bold text-amber-400 uppercase tracking-widest hover:underline print:hidden">EXPORT CSV</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
              {auditData.detected_components?.map((comp, idx) => (
                <div key={idx} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl flex flex-col gap-2 group hover:border-amber-400/30 transition-all print:break-inside-avoid">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg bg-zinc-900 flex-shrink-0 flex items-center justify-center ${categoryColors[comp.category] || 'text-zinc-500'} group-hover:text-amber-400`}>
                      <span className="material-symbols-outlined text-sm">memory</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black uppercase text-zinc-300 truncate">{comp.name}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase truncate">{comp.designator}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                    <p className={`text-[9px] font-black ${(comp.health || 100) > 70 ? 'text-green-500' : 'text-red-500'}`}>{comp.health || 100}% HP</p>
                    {comp.Suggested_Replacement && (
                      <div className="flex flex-col items-end">
                        <p className="text-[7px] text-zinc-600 font-bold uppercase">REPLACE WITH</p>
                        <p className="text-[8px] text-amber-400 font-bold uppercase">{comp.Suggested_Replacement}</p>
                      </div>
                    )}
                    <p className="text-[10px] font-mono text-zinc-500 font-bold">${comp.estimated_cost || '0'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Remediations */}
        <div className="bg-surface-container border border-outline-variant p-8 rounded-2xl">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-black uppercase tracking-tight">Technical Remediations</h3>
            <button onClick={copyRemediation} className="text-[10px] font-bold text-amber-400 uppercase tracking-widest hover:underline print:hidden">COPY ALL</button>
          </div>
          <div className="space-y-6">
            {auditData.technical_anomalies?.map((anomaly, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-zinc-950/30 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all overflow-hidden relative">
                <div className="absolute top-4 right-4">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${anomaly.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/30' : anomaly.severity === 'OPTIMIZATION' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>
                    {anomaly.severity || 'WARNING'}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-500"></span>
                    <span className="text-[10px] font-black tracking-widest uppercase text-red-500">ANOMALY #{idx + 1}</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-200 leading-relaxed break-words whitespace-pre-wrap">{anomaly.issue}</p>
                </div>
                <div className="space-y-3 md:border-l md:border-zinc-800 md:pl-8">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-green-500"></span>
                    <span className="text-[10px] font-black tracking-widest uppercase text-green-500">REMEDIATION</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed break-words whitespace-pre-wrap">{anomaly.fix || 'System redesign required.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate */}
        <div className="bg-zinc-950 border-2 border-amber-400/20 p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10 text-center md:text-left">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-amber-400">CERTIFICATE OF SAFETY COMPLIANCE</h3>
            <p className="text-sm text-zinc-500 uppercase tracking-widest leading-loose">
              THIS SYSTEM HAS BEEN AUDITED BY THE GEARGUARD PRO v5.0 NEURAL ENGINE UNDER {auditData.compliance_standard || 'ISO 13849'}.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-30 pt-4 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/UL_Mark.svg" className="h-10" alt="UL" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/CE_mark.svg" className="h-10" alt="CE" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-amber-400/20 z-10 w-48 h-48">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://gearguard.ai/verify/${auditData.certification_id}`} className="w-full h-full" alt="QR" />
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(251,191,36,0.05),transparent)]"></div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-3 print:hidden justify-center">
          <button onClick={onOpenChat} className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-400/20 transition-all">
            <span className="material-symbols-outlined text-sm">smart_toy</span> Ask AI About This Audit
          </button>
          <button onClick={() => onNavigate('maintenance')} className="flex items-center gap-2 border border-zinc-800 text-zinc-400 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-amber-400/30 hover:text-amber-400 transition-all">
            <span className="material-symbols-outlined text-sm">build</span> Generate Maintenance Plan
          </button>
          <button onClick={() => onNavigate('analyze')} className="flex items-center gap-2 border border-zinc-800 text-zinc-400 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-amber-400/30 hover:text-amber-400 transition-all">
            <span className="material-symbols-outlined text-sm">refresh</span> New Scan
          </button>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-3 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50 print:hidden">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">center_focus_weak</span>
          <span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Analyze</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-[9px] uppercase font-semibold tracking-wider mt-1">Archive</span>
        </button>
      </nav>
    </div>
  );
};

export default AuditReport;
