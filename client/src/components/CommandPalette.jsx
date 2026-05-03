import React, { useState, useRef, useEffect } from 'react';

const COMMANDS = [
  { id: 'analyze', icon: 'center_focus_weak', label: 'New Audit Scan', desc: 'Upload schematic for analysis', view: 'analyze' },
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', desc: 'Global safety overview', view: 'dashboard' },
  { id: 'compare', icon: 'compare', label: 'Diff Audit', desc: 'Compare two schematics', view: 'compare' },
  { id: 'maintenance', icon: 'build', label: 'Maintenance Planner', desc: 'Generate predictive schedule', view: 'maintenance' },
  { id: 'knowledge', icon: 'menu_book', label: 'Knowledge Base', desc: 'Search component database', view: 'knowledge' },
  { id: 'history', icon: 'history', label: 'Audit Archive', desc: 'View past audit results', view: 'history' },
  { id: 'report', icon: 'assessment', label: 'Last Report', desc: 'View most recent audit report', view: 'report' },
];

const CommandPalette = ({ onNavigate, onClose, currentView }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(search.toLowerCase())
  );

  const execute = (cmd) => {
    onNavigate(cmd.view);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && filtered.length > 0) execute(filtered[0]);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <span className="material-symbols-outlined text-zinc-600">search</span>
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
          <span className="text-[10px] font-bold text-zinc-700 bg-zinc-900 px-2 py-0.5 rounded">ESC</span>
        </div>

        {/* Commands */}
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar py-2">
          {filtered.map(cmd => (
            <button
              key={cmd.id}
              onClick={() => execute(cmd)}
              className={`w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-zinc-900 transition-colors ${currentView === cmd.view ? 'bg-zinc-900' : ''}`}
            >
              <span className={`material-symbols-outlined text-lg ${currentView === cmd.view ? 'text-amber-400' : 'text-zinc-600'}`}>{cmd.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-zinc-200 uppercase">{cmd.label}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{cmd.desc}</p>
              </div>
              {currentView === cmd.view && <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase">Active</span>}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-zinc-600 uppercase">No matching commands</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 flex justify-between items-center">
          <p className="text-[9px] text-zinc-700 uppercase tracking-widest">GearGuard Command Palette</p>
          <div className="flex gap-2 text-[9px] text-zinc-700">
            <span className="bg-zinc-900 px-1.5 py-0.5 rounded">↑↓</span> Navigate
            <span className="bg-zinc-900 px-1.5 py-0.5 rounded">↵</span> Select
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
