import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CircuitAnalysis from './components/CircuitAnalysis';
import AuditReport from './components/AuditReport';
import AuditHistory from './components/AuditHistory';
import AIChatPanel from './components/AIChatPanel';
import CompareAudit from './components/CompareAudit';
import MaintenancePlanner from './components/MaintenancePlanner';
import KnowledgeBase from './components/KnowledgeBase';
import CommandPalette from './components/CommandPalette';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [auditData, setAuditData] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('gearguard_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showChat, setShowChat] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gearguard_history', JSON.stringify(history.slice(0, 50)));
    } catch { /* quota exceeded, ignore */ }
  }, [history]);

  // Keyboard shortcut: Ctrl+K for command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleNavigate = useCallback((view, data = null) => {
    if (data) setAuditData(data);
    setCurrentView(view);
    if (view !== 'report') setShowChat(false);
  }, []);

  const handleAnalysisComplete = useCallback((data) => {
    const historyItem = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };
    setAuditData(data);
    setHistory(prev => [historyItem, ...prev]);
    setCurrentView('report');
    showToast('Audit complete — report generated');
  }, [showToast]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('gearguard_history');
    showToast('Audit archive cleared');
  }, [showToast]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} historyData={history} />;
      case 'analyze':
        return <CircuitAnalysis onNavigate={handleNavigate} onAnalysisComplete={handleAnalysisComplete} />;
      case 'report':
        return <AuditReport onNavigate={handleNavigate} auditData={auditData} onOpenChat={() => setShowChat(true)} showToast={showToast} />;
      case 'history':
        return <AuditHistory onNavigate={handleNavigate} historyData={history} onClearHistory={handleClearHistory} />;
      case 'compare':
        return <CompareAudit onNavigate={handleNavigate} showToast={showToast} />;
      case 'maintenance':
        return <MaintenancePlanner onNavigate={handleNavigate} auditData={auditData} showToast={showToast} />;
      case 'knowledge':
        return <KnowledgeBase onNavigate={handleNavigate} showToast={showToast} />;
      default:
        return <Dashboard onNavigate={handleNavigate} historyData={history} />;
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen relative">
      {renderView()}

      {/* AI Chat Slide-Over Panel */}
      {showChat && auditData && (
        <AIChatPanel 
          auditData={auditData} 
          onClose={() => setShowChat(false)} 
          sourceImage={auditData?.sourceImage}
        />
      )}

      {/* Command Palette (Ctrl+K) */}
      {showCommandPalette && (
        <CommandPalette 
          onNavigate={handleNavigate} 
          onClose={() => setShowCommandPalette(false)}
          currentView={currentView}
        />
      )}

      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] animate-slide-in">
          <div className="bg-zinc-900 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-xl shadow-2xl shadow-amber-400/10 flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Ctrl+K Hint */}
      <div className="fixed bottom-4 right-4 z-50 print:hidden">
        <button 
          onClick={() => setShowCommandPalette(true)}
          className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm text-zinc-600 hover:text-amber-400 hover:border-amber-400/30 transition-all px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider flex items-center gap-2"
        >
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[9px]">Ctrl</span>
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[9px]">K</span>
          <span className="uppercase font-bold">Command</span>
        </button>
      </div>
    </div>
  );
};

export default App;
