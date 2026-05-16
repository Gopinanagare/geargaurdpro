import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

const COMPLIANCE_STANDARDS = [
  { id: 'ISO 13849', label: 'ISO 13849', desc: 'Safety of Machinery' },
  { id: 'IEC 61508', label: 'IEC 61508', desc: 'Functional Safety' },
  { id: 'IEC 62443', label: 'IEC 62443', desc: 'Industrial Cybersecurity' },
  { id: 'NFPA 79', label: 'NFPA 79', desc: 'Electrical Standard for Machines' },
  { id: 'UL 508A', label: 'UL 508A', desc: 'Industrial Control Panels' },
];

const CircuitAnalysis = ({ onNavigate, onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [logicText, setLogicText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('ISO 13849');
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Web Speech API setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setLogicText(prev => prev + (prev ? '\n' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) {
      setErrorMessage('Voice input not supported in this browser.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('File exceeds 50MB limit.');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Paste from clipboard
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const startAnalysis = async () => {
    if (!selectedImage && !logicText) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setErrorMessage(null);
    
    const phases = [
      'Initializing Neural Net',
      'Deep Pixel Forensic Scan',
      'Tracing Power Rails',
      'Isolating Logic Nodes',
      'Thermal Zone Mapping',
      'EMC/EMI Analysis',
      'Redundancy Verification',
      `${selectedStandard} Compliance Check`,
      'Calculating MTBF',
      'Generating Certificate'
    ];
    
    let phaseIdx = 0;
    setScanPhase(phases[0]);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 0.8;
        const newPhaseIdx = Math.min(Math.floor(next / (100 / phases.length)), phases.length - 1);
        if (newPhaseIdx !== phaseIdx) {
          phaseIdx = newPhaseIdx;
          setScanPhase(phases[phaseIdx]);
        }
        if (next >= 95) {
          clearInterval(interval);
          return 95;
        }
        return next;
      });
    }, 60);

    try {
      const response = await axios.post('/api/audit', {
        image: selectedImage,
        text: logicText,
        complianceStandard: selectedStandard,
      });
      
      clearInterval(interval);
      setScanProgress(100);
      setScanPhase('Audit Complete');
      
      setTimeout(() => {
        if (onAnalysisComplete) {
          onAnalysisComplete({ 
            ...response.data, 
            sourceImage: selectedImage, 
            logicInput: logicText,
            standard: selectedStandard,
          });
        }
      }, 600);
    } catch (error) {
      clearInterval(interval);
      setIsScanning(false);
      setScanProgress(0);
      const msg = error.response?.status === 429 
        ? 'Rate limit reached — free tier allows 15 req/min. Wait and retry.'
        : 'Analysis Engine failed. Check API configuration.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-4 lg:px-6 py-3 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 text-lg font-bold">shield</span>
          </div>
          <h1 className="text-amber-400 font-black tracking-tighter text-xl uppercase leading-none">GEARGUARD PRO</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">ENGINE STATUS</span>
            <span className="text-[9px] font-bold text-green-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> OPERATIONAL
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto lg:overflow-hidden pb-24 lg:pb-4">
        {/* Left Side: Input Controls */}
        <div className="lg:col-span-5 space-y-4 flex flex-col lg:overflow-y-auto pr-0 lg:pr-2 lg:custom-scrollbar">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">Multimodal Input</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide leading-relaxed">Provide hardware schematics and PLC logic for hardware-logic co-auditing.</p>
          </div>

          {/* Compliance Standard Selector */}
          <div className="space-y-1.5">
            <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[10px]">verified</span>
              Compliance Standard
            </label>
            <div className="grid grid-cols-2 gap-1">
              {COMPLIANCE_STANDARDS.map(std => (
                <button
                  key={std.id}
                  onClick={() => setSelectedStandard(std.id)}
                  className={`flex items-center gap-2 p-1.5 rounded-md border transition-all text-left ${
                    selectedStandard === std.id
                      ? 'border-amber-400/50 bg-amber-400/5'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    selectedStandard === std.id ? 'border-amber-400' : 'border-zinc-700'
                  }`}>
                    {selectedStandard === std.id && <div className="w-1 h-1 rounded-full bg-amber-400"></div>}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-300 uppercase truncate">{std.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload Area — Drag & Drop + Paste */}
          <div 
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed transition-all cursor-pointer group rounded-xl h-28 flex flex-col items-center justify-center overflow-hidden flex-shrink-0
              ${isDragging ? 'border-amber-400 bg-amber-400/5 scale-[1.01]' : ''}
              ${selectedImage ? 'border-amber-400/50 bg-zinc-900/30' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}
            `}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} className="w-full h-full object-contain" alt="Preview" />
                <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-amber-400 text-2xl mb-1">upload_file</span>
                  <p className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">REPLACE</p>
                </div>
              </>
            ) : (
              <div className="text-center p-2">
                <span className="material-symbols-outlined text-2xl text-zinc-700 group-hover:text-amber-400 transition-colors mb-1">settings_input_component</span>
                <p className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">Upload Schematic</p>
                <p className="text-[8px] text-zinc-600 uppercase">Drag & Drop or Click</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          {/* Logic Input Area with Voice */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">PLC Logic / Tech Spec <span className="text-zinc-700">(Optional)</span></label>
              <button 
                onClick={toggleVoice}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-all border ${
                  isListening 
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' 
                    : 'border-zinc-800 text-zinc-600 hover:text-amber-400 hover:border-amber-400/30'
                }`}
              >
                <span className="material-symbols-outlined text-[10px]">{isListening ? 'mic' : 'mic_none'}</span>
                {isListening ? 'Listening' : 'Voice'}
              </button>
            </div>
            <textarea 
              value={logicText}
              onChange={(e) => setLogicText(e.target.value)}
              placeholder="Paste Logic or Specs here..."
              className="w-full h-16 bg-zinc-900/50 border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-400 focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-zinc-700 resize-none flex-shrink-0"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-center gap-2 animate-fade-in-up">
              <span className="material-symbols-outlined text-red-500 text-xs">error</span>
              <p className="text-[9px] font-bold text-red-400 uppercase">{errorMessage}</p>
            </div>
          )}

          <button 
            onClick={startAnalysis}
            disabled={(!selectedImage && !logicText) || isScanning}
            className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-2xl flex-shrink-0
              ${(!selectedImage && !logicText) || isScanning 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-amber-400/20'}
            `}
          >
            {isScanning ? (
              <>
                <span className="w-2.5 h-2.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                {scanPhase}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">analytics</span>
                INITIATE AUDIT
              </>
            )}
          </button>
        </div>

        {/* Right Side: Digital Twin Visualizer */}
        <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden relative group h-[300px] lg:h-full">
          {!selectedImage && !isScanning ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-2 border-amber-400/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                <span className="material-symbols-outlined text-4xl text-zinc-800">model_training</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-500">Audit Node Standby</h3>
              <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-wide">Select a system input to activate analyzer</p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-1.5 mt-6 justify-center">
                {['Thermal Mapping', 'EMC Analysis', 'Redundancy Check', 'Voice Input'].map((feat, i) => (
                  <span key={i} className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              {selectedImage && (
                <img src={selectedImage} className="w-full h-full object-contain opacity-40 mix-blend-screen" alt="Scanning" />
              )}
              
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 inline-block">LIVE ANALYSIS STREAM</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">STANDARD: {selectedStandard}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-amber-400/50 font-mono">{Math.round(scanProgress)}%</p>
                    {isScanning && <p className="text-[9px] font-bold text-amber-400/70 uppercase tracking-wider">{scanPhase}</p>}
                  </div>
                </div>

                {/* Animated Scan Bar */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-[1px] bg-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.5)] z-20 animate-[scan_2s_ease-in-out_infinite]" style={{ top: `${scanProgress}%` }}></div>
                )}

                {/* Progress bar at bottom */}
                <div className="mt-auto">
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full" 
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      {['Tracing Rails', 'Isolating Control', 'Verifying SIL', 'Thermal Scan', 'EMC Assessment'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${scanProgress > (i * 20) ? 'bg-amber-400' : 'bg-zinc-800'}`}></div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${scanProgress > (i * 20) ? 'text-zinc-500' : 'text-zinc-800'}`}>{step}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-lg backdrop-blur-md">
                      <p className="text-[8px] font-bold text-zinc-600 uppercase mb-1">TELEMETRY</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase">VOLTAGE</p>
                          <p className="text-[10px] font-mono text-on-surface">24.0V DC</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase">TEMP</p>
                          <p className="text-[10px] font-mono text-on-surface">32.4°C</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 w-full grid grid-cols-4 items-center bg-zinc-900/95 backdrop-blur-md pb-safe border-t border-zinc-800 z-50">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-amber-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Dashboard</span>
        </button>
        <button onClick={() => onNavigate('analyze')} className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-2.5 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">memory</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Hardware</span>
        </button>
        <button onClick={() => onNavigate('code_audit')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-cyan-400 transition-all border-r border-zinc-800">
          <span className="material-symbols-outlined text-lg">code</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Code</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center justify-center text-zinc-500 py-2.5 hover:text-amber-400 transition-all">
          <span className="material-symbols-outlined text-lg">history</span>
          <span className="text-[8px] uppercase font-semibold tracking-wider mt-0.5">Archive</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
};

export default CircuitAnalysis;
