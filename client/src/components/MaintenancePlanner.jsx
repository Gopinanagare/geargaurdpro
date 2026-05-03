import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintenancePlanner = ({ onNavigate, auditData, showToast }) => {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (auditData && !schedule) generateSchedule();
  }, [auditData]);

  const generateSchedule = async () => {
    if (!auditData) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/maintenance', { auditData });
      setSchedule(response.data);
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
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white font-bold">build</span>
          </div>
          <div>
            <h1 className="text-cyan-400 font-black tracking-tighter text-2xl uppercase leading-none">MAINTENANCE</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">Predictive Scheduling Engine</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={copySchedule} className="bg-zinc-900 border border-zinc-800 hover:border-cyan-400 transition-all p-3 rounded-lg group">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-cyan-400">content_copy</span>
          </button>
          <button onClick={generateSchedule} disabled={isLoading || !auditData} className="bg-zinc-900 border border-zinc-800 hover:border-cyan-400 transition-all p-3 rounded-lg group disabled:opacity-40">
            <span className="material-symbols-outlined text-zinc-500 group-hover:text-cyan-400">refresh</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {!auditData && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">engineering</span>
            <h3 className="text-xl font-bold text-zinc-600 uppercase">No Audit Data</h3>
            <p className="text-sm text-zinc-700 mt-2 uppercase tracking-wide">Run an audit first to generate a maintenance plan.</p>
            <button onClick={() => onNavigate('analyze')} className="mt-6 bg-cyan-500 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">Run Audit First</button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-sm text-zinc-500 uppercase tracking-widest animate-pulse">Generating predictive maintenance schedule...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm font-bold text-red-400 uppercase">{error}</p>
          </div>
        )}

        {schedule && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Tasks</p>
                <p className="text-3xl font-black text-cyan-400 mt-2">{schedule.schedule?.length || 0}</p>
              </div>
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Hours</p>
                <p className="text-3xl font-black text-on-surface mt-2">{schedule.total_estimated_hours || 0}</p>
              </div>
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Cost</p>
                <p className="text-3xl font-black text-amber-400 mt-2">${schedule.total_estimated_cost || 0}</p>
              </div>
              <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Health Score</p>
                <p className="text-3xl font-black text-green-400 mt-2">{schedule.overall_maintenance_health || 0}%</p>
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

      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-4 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-3 hover:text-amber-400 transition-all border-r border-zinc-800">
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

export default MaintenancePlanner;
