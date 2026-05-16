import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CircuitAnalysis from './components/CircuitAnalysis';
import AuditReport from './components/AuditReport';
import AuditHistory from './components/AuditHistory';
import AIChatPanel from './components/AIChatPanel';
import MaintenancePlanner from './components/MaintenancePlanner';
import KnowledgeBase from './components/KnowledgeBase';
import CodeAuditor from './components/CodeAuditor';


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

  const [toastMessage, setToastMessage] = useState(null);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gearguard_history', JSON.stringify(history.slice(0, 50)));
    } catch { /* quota exceeded, ignore */ }
  }, [history]);



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

  const handleUpdateAudit = useCallback((updatedData) => {
    setAuditData(updatedData);
    setHistory(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
    showToast('Maintenance plan saved to audit');
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
      case 'maintenance':
        return <MaintenancePlanner 
          onNavigate={handleNavigate} 
          auditData={auditData} 
          historyData={history}
          onUpdateAudit={handleUpdateAudit}
          showToast={showToast} 
        />;
      case 'knowledge':
        return <KnowledgeBase onNavigate={handleNavigate} showToast={showToast} />;
      case 'code_audit':
        return <CodeAuditor onNavigate={handleNavigate} showToast={showToast} />;
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



      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] animate-slide-in">
          <div className="bg-zinc-900 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-xl shadow-2xl shadow-amber-400/10 flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            {toastMessage}
          </div>
        </div>
      )}


    </div>
  );
};

export default App;
