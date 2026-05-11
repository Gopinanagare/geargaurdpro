import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIChatPanel = ({ auditData, onClose, sourceImage }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Audit loaded — ${auditData?.detected_components?.length || 0} components detected with risk score ${auditData?.risk_score || 0}/100. Ask me anything about this audit.`, severity: 'info' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const suggestedQuestions = [
    "What's the most critical component?",
    "How can I reduce the risk score?",
    "What's the cheapest fix?",
    "Explain the circuit topology",
    "Is this safe for production?",
  ];

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        question,
        auditContext: auditData,
        image: sourceImage
      });

      const data = response.data;
      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.answer || data.toString(),
        severity: data.severity || 'info',
        references: data.references,
        followups: data.suggested_followups
      }]);
    } catch (error) {
      const msg = error.response?.status === 429
        ? 'Rate limit reached. Wait a moment before asking again.'
        : 'Failed to reach AI engine. Check your connection.';
      setMessages(prev => [...prev, { role: 'ai', text: msg, severity: 'warning' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const severityColors = {
    info: 'border-l-cyan-400',
    warning: 'border-l-amber-400',
    critical: 'border-l-red-500'
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg z-[100] animate-slide-in flex flex-col">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" onClick={onClose}></div>

      <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-400 text-lg">smart_toy</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">AI Advisor</h3>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Context-aware audit Q&A</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-zinc-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-amber-400/10 border border-amber-400/20 text-zinc-200'
                  : `bg-zinc-900 border border-zinc-800 border-l-2 ${severityColors[msg.severity] || ''} text-zinc-300`
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.references?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">References</p>
                    {msg.references.map((ref, i) => (
                      <p key={i} className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">link</span> {ref}
                      </p>
                    ))}
                  </div>
                )}
                {msg.followups?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.followups.map((fq, i) => (
                      <button key={i} onClick={() => sendMessage(fq)} className="text-[10px] font-bold text-amber-400/70 bg-amber-400/5 border border-amber-400/10 px-2 py-1 rounded-lg hover:bg-amber-400/10 transition-all uppercase">
                        {fq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} className="text-[10px] font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg hover:border-amber-400/30 hover:text-amber-400 transition-all uppercase tracking-wider">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the audit..."
              disabled={isLoading}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-amber-400/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-amber-400 text-zinc-950 px-4 rounded-xl font-black text-sm hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
