import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintenancePlanner = ({ onNavigate, auditData, historyData, onUpdateAudit, showToast }) => {
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userQuestion, setUserQuestion] = useState('');

  // When selectedAudit changes, update the local schedule
  useEffect(() => {
    if (selectedAudit) {
      setSchedule(selectedAudit.maintenance_plan || null);
    }
  }, [selectedAudit]);

  const generateSchedule = async (e) => {
    if (e) e.preventDefault();
    if (!selectedAudit) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/maintenance', { 
        auditData: selectedAudit,
        userRequest: userQuestion || "General reliability maintenance"
      });
      const newSchedule = response.data;
      setSchedule(newSchedule);
      
      // Save back to audit data in history
      if (onUpdateAudit) {
        onUpdateAudit({
          ...selectedAudit,
          maintenance_plan: newSchedule
        });
      }
    } catch (err) {
      setError(err.response?.status === 429 ? 'Rate limit reached. Wait and retry.' : 'Failed to generate maintenance plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const priorityColors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-400', low: 'bg-green-500' };
  const priorityText = { critical: 'text-red-400', high: 'text-orange-400', medium: 'text-amber-400', low: 'text-green-400' };

  const copySchedule = () => {
    if (!schedule) return;
    const text = schedule.schedule?.map((t, i) => `${i + 1}. [${t.priority.toUpperCase()}] ${t.task} — ${t.timeline} — ${t.estimated_hours}h — $${t.estimated_cost}`).join('\n');
    navigator.clipboard.writeText(text || '');
    showToast?.('Schedule copied to clipboard');
  };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg lg:text-xl font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl lg:text-2xl uppercase leading-none">GEARGUARD PRO</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={copySchedule} disabled={!schedule} className="bg-zinc-900 border border-zinc-800 hover:border-cyan-400 transition-all p-2 lg:p-3 rounded-lg group disabled:opacity-30">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-cyan-400 text-lg lg:text-xl">content_copy</span>
          </button>
          <button onClick={generateSchedule} disabled={isLoading || !selectedAudit} className="bg-zinc-900 border border-zinc-800 hover:border-cyan-400 transition-all p-2 lg:p-3 rounded-lg group disabled:opacity-40">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-cyan-400 text-lg lg:text-xl">refresh</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-8">
        {/* LIST VIEW: Show all audits */}
        {!selectedAudit && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">Maintenance Archive</h2>
                <p className="text-xs lg:text-sm text-zinc-500 uppercase tracking-widest mt-1">Select an audit to manage its strategic maintenance plan</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 self-start">
                <span className="text-[10px] font-black text-zinc-500 uppercase">Total Audits</span>
                <span className="text-amber-400 font-bold">{historyData?.length || 0}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyData?.map((item, idx) => (
                <div key={item.id} className="bg-surface-container border border-outline-variant p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/30 transition-all group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-amber-400 transition-colors">
                        <span className="material-symbols-outlined">analytics</span>
                      </div>
                      <span className="text-[9px] font-black px-2 py-1 bg-zinc-950 text-zinc-500 rounded border border-zinc-900">{item.timestamp}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-zinc-200 uppercase truncate">{item.compliance_standard || 'STANDARD AUDIT'}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">ID: {item.certification_id?.substring(0, 15)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.maintenance_plan ? 'bg-green-500' : 'bg-zinc-700'}`}></span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {item.maintenance_plan ? 'PLAN GENERATED' : 'PLAN PENDING'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAudit(item)}
                    className={`mt-8 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${item.maintenance_plan ? 'bg-zinc-900 text-amber-400 border border-amber-400/20 hover:bg-amber-400 hover:text-zinc-950' : 'bg-amber-400 text-zinc-950 hover:bg-amber-300'}`}
                  >
                    {item.maintenance_plan ? 'SEE MAINTENANCE' : 'GENERATE PLAN'}
                  </button>
                </div>
              ))}
              {(!historyData || historyData.length === 0) && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
                  <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">history</span>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">No historical audits found</p>
                  <button onClick={() => onNavigate('analyze')} className="mt-6 bg-amber-400 text-zinc-950 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-300">Run First Audit</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PLAN MODE: Show prompt or results for the selected audit */}
        {selectedAudit && !schedule && !isLoading && (
          <div className="space-y-6">
            <button onClick={() => { setSelectedAudit(null); setSchedule(null); }} className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-amber-400 uppercase tracking-widest transition-colors mb-4">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Archive
            </button>
            <div className="max-w-2xl mx-auto py-12 px-6 bg-zinc-950/50 border border-zinc-900 rounded-3xl text-center space-y-6">
              <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-amber-400 text-3xl">question_mark</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Maintenance Inquiry</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{selectedAudit.compliance_standard} // {selectedAudit.certification_id}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">What audits maintenance do you want for this specific system?</p>
              
              <form onSubmit={generateSchedule} className="space-y-4">
                <textarea 
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g., Generate a 12-month reliability plan focusing on thermal stress..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 focus:border-amber-400/50 outline-none h-32 resize-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-amber-400 text-zinc-950 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/10"
                >
                  GENERATE STRATEGIC PLAN
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedAudit && isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-sm text-zinc-500 uppercase tracking-widest animate-pulse text-center">
              Generating predictive maintenance schedule for<br/>
              <span className="text-amber-400 font-black mt-1 inline-block">{selectedAudit.certification_id}</span>
            </p>
          </div>
        )}

        {selectedAudit && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm font-bold text-red-400 uppercase">{error}</p>
            <button onClick={() => setSelectedAudit(null)} className="ml-auto text-[10px] font-black text-zinc-500 hover:underline uppercase">Go Back</button>
          </div>
        )}

        {selectedAudit && schedule && (
          <div className="space-y-8 animate-fade-in-up">
            <button onClick={() => { setSelectedAudit(null); setSchedule(null); }} className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-amber-400 uppercase tracking-widest transition-colors mb-4">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Archive
            </button>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container border border-outline-variant p-4 lg:p-6 rounded-2xl text-center">
                <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Tasks</p>
                <p className="text-2xl lg:text-3xl font-black text-cyan-400 mt-2">{schedule.schedule?.length || 0}</p>
              </div>
              <div className="bg-surface-container border border-outline-variant p-4 lg:p-6 rounded-2xl text-center">
                <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Hours</p>
                <p className="text-2xl lg:text-3xl font-black text-on-surface mt-2">{schedule.total_estimated_hours || 0}</p>
              </div>
              <div className="bg-surface-container border border-outline-variant p-4 lg:p-6 rounded-2xl text-center">
                <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Cost</p>
                <p className="text-2xl lg:text-3xl font-black text-amber-400 mt-2">${schedule.total_estimated_cost || 0}</p>
              </div>
              <div className="bg-surface-container border border-outline-variant p-4 lg:p-6 rounded-2xl text-center">
                <p className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Health Score</p>
                <p className="text-2xl lg:text-3xl font-black text-green-400 mt-2">{schedule.overall_maintenance_health || 0}%</p>
              </div>
            </div>

            {/* Critical Action */}
            {schedule.next_critical_action && (
              <div className="bg-red-500/5 border-2 border-red-500/20 p-6 rounded-2xl flex items-center gap-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">priority_high</span>
                <div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Next Critical Action</p>
                  <p className="text-sm font-bold text-zinc-200 uppercase mt-1">{schedule.next_critical_action}</p>
                </div>
              </div>
            )}

            {/* Task Timeline (Gantt-style) */}
            <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-500">Maintenance Timeline</h3>
              <div className="space-y-4">
                {schedule.schedule?.map((task, i) => (
                  <div key={i} className="flex items-stretch gap-4 group">
                    {/* Priority Bar */}
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${priorityColors[task.priority]} flex-shrink-0`}></div>
                      {i < (schedule.schedule.length - 1) && <div className="w-0.5 flex-1 bg-zinc-800 mt-1"></div>}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6 border-b border-zinc-900 group-last:border-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-zinc-200 uppercase">{task.task}</p>
                          <p className="text-[10px] text-zinc-500 mt-1 uppercase">{task.timeline}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${priorityText[task.priority]} bg-zinc-900`}>{task.priority}</span>
                          {task.downtime_required && (
                            <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded uppercase">Downtime</span>
                          )}
                        </div>
                      </div>

                      {/* Gantt Bar */}
                      <div className="mt-3 w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${priorityColors[task.priority]} opacity-60`} style={{ width: `${Math.min(100, (task.estimated_hours / (schedule.total_estimated_hours || 1)) * 100 * 3)}%` }}></div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-[10px] uppercase">
                        <span className="text-zinc-500"><span className="font-bold text-zinc-300">{task.estimated_hours}h</span> duration</span>
                        <span className="text-zinc-500"><span className="font-bold text-amber-400">${task.estimated_cost}</span> cost</span>
                      </div>

                      {task.components_affected?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.components_affected.map((c, j) => (
                            <span key={j} className="text-[9px] font-bold text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded uppercase">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

export default MaintenancePlanner;
