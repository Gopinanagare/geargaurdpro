import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CircuitAnalysis from './components/CircuitAnalysis';
import AuditReport from './components/AuditReport';
import AuditHistory from './components/AuditHistory';

const App = () => {
  const [currentView, setCurrentView] = useState('analyze');
  const [auditData, setAuditData] = useState(null);
  const [history, setHistory] = useState([]);

  const handleNavigate = (view, data = null) => {
    if (data) setAuditData(data);
    setCurrentView(view);
  };

  const handleAnalysisComplete = (data) => {
    const historyItem = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };
    setAuditData(data);
    setHistory(prev => [historyItem, ...prev]);
    setCurrentView('report');
  };

  const renderView = () => {
    switch (currentView) {
      case 'analyze':
        return <CircuitAnalysis onNavigate={handleNavigate} onAnalysisComplete={handleAnalysisComplete} />;
      case 'report':
        return <AuditReport onNavigate={handleNavigate} auditData={auditData} />;
      case 'history':
        return <AuditHistory onNavigate={handleNavigate} historyData={history} />;
      default:
        return <CircuitAnalysis onNavigate={handleNavigate} onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {renderView()}
    </div>
  );
};

export default App;
