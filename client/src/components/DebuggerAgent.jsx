import React, { useState, useRef } from 'react';
import axios from 'axios';

const DebuggerAgent = ({ onNavigate, showToast }) => {
  const [problem, setProblem] = useState('');
  const [image, setImage] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const startDiagnosis = async () => {
    if (!problem.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/debugger', { problem: problem.trim(), image, conversation: [] });
      setDiagnosis(res.data);
      setConversation([{ role: 'user', text: problem.trim() }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Diagnosis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const answerQuestion = async (questionText, answer) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    const newConv = [...conversation, { role: 'agent', text: questionText }, { role: 'user', text: answer }];
    setConversation(newConv);
    try {
      const res = await axios.post('/api/debugger', { problem: problem.trim(), image, conversation: newConv });
      setDiagnosis(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Follow-up failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setProblem('');
    setImage(null);
    setConversation([]);
    setDiagnosis(null);
    setError(null);
  };

  const probColor = { HIGH: 'text-red-400 bg-red-400/10 border-red-400/20', MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20', LOW: 'text-green-400 bg-green-400/10 border-green-400/20' };
  const stageIcon = { investigating: 'search', narrowing: 'filter_alt', resolved: 'check_circle' };
  const stageColor = { investigating: 'text-cyan-400', narrowing: 'text-amber-400', resolved: 'text-green-400' };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-red-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg lg:text-xl font-bold">bug_report</span>
          </div>
          <h1 className="text-red-400 font-black tracking-tighter text-xl lg:text-2xl uppercase leading-none">GEARGUARD PRO</h1>
        </div>
        {diagnosis && (
          <button onClick={reset} className="bg-zinc-900 border border-zinc-800 hover:border-red-400 transition-all px-3 py-1.5 rounded-lg">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">New Session</span>
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6">
        {/* INPUT PHASE */}
        {!diagnosis && !isLoading && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-400 text-4xl">troubleshoot</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">Live Troubleshooter</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Describe the problem. AI will diagnose it step by step.</p>
            </div>

            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Motor starts but stops after 5 seconds, overload relay trips intermittently..."
              className="w-full h-28 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 focus:border-red-400/50 outline-none resize-none placeholder:text-zinc-700"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => fileRef.current?.click()} className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-red-400/30 rounded-xl p-3 flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-zinc-500 text-sm">add_photo_alternate</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {image ? '✓ Image Attached' : 'Attach Schematic (Optional)'}
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              <button
                onClick={startDiagnosis}
                disabled={!problem.trim()}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${!problem.trim() ? 'bg-zinc-800 text-zinc-600' : 'bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/20'}`}
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>START DIAGNOSIS
              </button>
            </div>

            {image && (
              <div className="relative">
                <img src={image} alt="Attached" className="w-full max-h-48 object-contain rounded-xl border border-zinc-800" />
                <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-zinc-950 rounded-full p-1 border border-zinc-800">
                  <span className="material-symbols-outlined text-zinc-500 text-sm">close</span>
                </button>
              </div>
            )}

            <div>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Common Problems</p>
              <div className="flex flex-wrap gap-2">
                {['Motor won\'t start', 'PLC fault light blinking', 'Relay chattering', 'Fuse keeps blowing', 'Intermittent power loss', 'Display shows error code', 'Overheating detected', 'Emergency stop stuck'].map((s, i) => (
                  <button key={i} onClick={() => setProblem(s)} className="text-[9px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg hover:border-red-400/30 hover:text-red-400 transition-all uppercase">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-sm text-zinc-500 uppercase tracking-widest animate-pulse">
              {conversation.length > 1 ? 'Analyzing your answers...' : 'Starting diagnostic scan...'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm font-bold text-red-400 uppercase">{error}</p>
          </div>
        )}

        {/* DIAGNOSIS RESULTS */}
        {diagnosis && !isLoading && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Status Bar */}
            <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <span className={`material-symbols-outlined text-2xl ${stageColor[diagnosis.diagnosis_stage] || 'text-zinc-500'}`}>
                {stageIcon[diagnosis.diagnosis_stage] || 'help'}
              </span>
              <div className="flex-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Stage: {diagnosis.diagnosis_stage?.toUpperCase()}
                </p>
                <p className="text-sm font-bold text-zinc-200 mt-1">{diagnosis.current_assessment}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-on-surface">{diagnosis.confidence || 0}%</p>
                <p className="text-[8px] font-bold text-zinc-600 uppercase">Confidence</p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${diagnosis.confidence > 80 ? 'bg-green-500' : diagnosis.confidence > 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                style={{ width: `${diagnosis.confidence || 0}%` }}
              />
            </div>

            {/* Possible Causes */}
            {diagnosis.possible_causes?.length > 0 && (
              <div className="bg-surface-container border border-outline-variant p-5 rounded-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-amber-400">psychology</span> Possible Causes
                </h3>
                <div className="space-y-3">
                  {diagnosis.possible_causes.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border flex-shrink-0 mt-0.5 ${probColor[c.probability] || probColor.LOW}`}>
                        {c.probability}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-zinc-200 uppercase">{c.cause}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">{c.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diagnostic Questions */}
            {diagnosis.diagnosis_stage !== 'resolved' && diagnosis.questions?.length > 0 && (
              <div className="bg-surface-container border border-outline-variant p-5 rounded-2xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-cyan-400">quiz</span> Answer These to Narrow Down
                </h3>
                <div className="space-y-3">
                  {diagnosis.questions.map((q) => (
                    <div key={q.id} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                      <p className="text-sm font-bold text-zinc-200 mb-1">{q.question}</p>
                      <p className="text-[9px] text-zinc-600 mb-3 italic">{q.why}</p>
                      <div className="flex gap-2">
                        <button onClick={() => answerQuestion(q.question, 'Yes')} className="flex-1 py-2.5 bg-green-500/10 border border-green-500/30 rounded-lg text-[10px] font-black text-green-400 uppercase tracking-widest hover:bg-green-500/20 transition-all">
                          ✓ Yes
                        </button>
                        <button onClick={() => answerQuestion(q.question, 'No')} className="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-all">
                          ✗ No
                        </button>
                        <button onClick={() => answerQuestion(q.question, 'Not sure')} className="py-2.5 px-4 bg-zinc-800/50 border border-zinc-700 rounded-lg text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">
                          ?
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESOLVED — Fix Instructions */}
            {diagnosis.fix && (
              <div className="bg-green-500/5 border-2 border-green-500/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-400 text-3xl">build_circle</span>
                  <div>
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Solution Found</p>
                    <p className="text-lg font-black text-zinc-200 uppercase">{diagnosis.fix.title}</p>
                  </div>
                </div>

                {diagnosis.fix.safety_warning && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                    <p className="text-[10px] font-bold text-red-400 uppercase">{diagnosis.fix.safety_warning}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Step-by-Step Fix</p>
                  {diagnosis.fix.steps?.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800">
                      <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">{i + 1}</span>
                      <p className="text-xs text-zinc-300">{step}</p>
                    </div>
                  ))}
                </div>

                {diagnosis.fix.parts_needed?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Parts Needed</p>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.fix.parts_needed.map((p, i) => (
                        <span key={i} className="text-[9px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-lg uppercase">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {diagnosis.fix.estimated_time && (
                  <p className="text-[10px] text-zinc-500"><span className="font-bold text-zinc-300">Estimated Time:</span> {diagnosis.fix.estimated_time}</p>
                )}
              </div>
            )}

            {/* Conversation Trail */}
            {conversation.length > 1 && (
              <details className="group">
                <summary className="text-[9px] font-black text-zinc-600 uppercase tracking-widest cursor-pointer hover:text-zinc-400 transition-colors">
                  Diagnostic Trail ({Math.floor(conversation.length / 2)} rounds)
                </summary>
                <div className="mt-3 space-y-1.5 max-h-40 overflow-y-auto">
                  {conversation.map((m, i) => (
                    <div key={i} className={`text-[10px] px-3 py-1.5 rounded-lg ${m.role === 'user' ? 'bg-zinc-900 text-zinc-300 ml-8' : 'bg-red-500/5 text-red-300 mr-8'}`}>
                      <span className="font-black uppercase text-[8px] text-zinc-600">{m.role}: </span>{m.text}
                    </div>
                  ))}
                </div>
              </details>
            )}
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

export default DebuggerAgent;
