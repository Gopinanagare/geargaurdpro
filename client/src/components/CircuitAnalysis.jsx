import React, { useState, useRef } from 'react';
import axios from 'axios';

const CircuitAnalysis = ({ onNavigate, onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [logicText, setLogicText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage && !logicText) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate high-precision scanning phases
    const phases = ['Initializing Neural Net', 'Tracing Logic Nodes', 'Detecting Ground Loops', 'Calculating MTBF', 'Generating Certificate'];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    try {
      const response = await axios.post('http://localhost:5000/api/audit', {
        image: selectedImage,
        text: logicText
      });
      
      clearInterval(interval);
      setScanProgress(100);
      
      setTimeout(() => {
        if (onAnalysisComplete) {
          onAnalysisComplete({ ...response.data, sourceImage: selectedImage, logicInput: logicText });
        }
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setIsScanning(false);
      alert('High-Precision Analysis Engine failed. Verify API configuration.');
    }
  };

  return (
    <div className="bg-background text-on-surface font-inter min-h-screen pb-24">
      {/* Dynamic Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-950 font-bold">query_stats</span>
          </div>
          <div>
            <h1 className="text-amber-400 font-black tracking-tighter text-2xl uppercase leading-none">GEARGUARD PRO</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">Enterprise Audit Node v4.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ENGINE STATUS</span>
            <span className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> OPERATIONAL
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Input Controls */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Multimodal Input</h2>
            <p className="text-sm text-zinc-500 uppercase tracking-wide leading-relaxed">Provide hardware schematics and PLC logic for hardware-logic co-auditing.</p>
          </div>

          {/* Image Upload Area */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className={`relative border-2 border-dashed transition-all cursor-pointer group rounded-xl aspect-video flex flex-col items-center justify-center overflow-hidden
              ${selectedImage ? 'border-amber-400/50 bg-zinc-900/30' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}
            `}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} className="w-full h-full object-contain" alt="Preview" />
                <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-amber-400 text-4xl mb-2">upload_file</span>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">REPLACE SCHEMATIC</p>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <span className="material-symbols-outlined text-4xl text-zinc-700 group-hover:text-amber-400 transition-colors mb-4">settings_input_component</span>
                <p className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">Upload Hardware Schematic</p>
                <p className="text-[10px] text-zinc-600 uppercase mt-2">PNG, JPG or PDF up to 50MB</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          {/* Logic Input Area */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PLC Logic / Technical Spec (Optional)</label>
              <span className="text-[10px] font-bold text-zinc-700 uppercase">SYNTAX: IEC 61131-3</span>
            </div>
            <textarea 
              value={logicText}
              onChange={(e) => setLogicText(e.target.value)}
              placeholder="Paste Structured Text, Ladder Logic summary, or Component datasheets here..."
              className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-zinc-400 focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-zinc-700 resize-none"
            />
          </div>

          <button 
            onClick={startAnalysis}
            disabled={(!selectedImage && !logicText) || isScanning}
            className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl
              ${(!selectedImage && !logicText) || isScanning 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:-translate-y-1 active:translate-y-0'}
            `}
          >
            {isScanning ? (
              <>
                <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                SCANNING SYSTEM NODES...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">analytics</span>
                INITIATE ZERO-TRUST AUDIT
              </>
            )}
          </button>
        </div>

        {/* Right Side: Digital Twin Visualizer */}
        <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden relative group">
          {!selectedImage && !isScanning ? (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center">
              <div className="w-32 h-32 rounded-full border border-zinc-800 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 border-2 border-amber-400/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                <span className="material-symbols-outlined text-5xl text-zinc-800">model_training</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-500">Audit Node Standby</h3>
              <p className="text-sm text-zinc-700 mt-2 uppercase tracking-wide">Select a system input to activate the Digital Twin analyzer</p>
            </div>
          ) : (
            <div className="relative h-full min-h-[500px]">
              {/* The Image under analysis */}
              {selectedImage && (
                <img src={selectedImage} className="w-full h-full object-contain opacity-40 mix-blend-screen" alt="Scanning" />
              )}
              
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-1 inline-block">LIVE ANALYSIS STREAM</p>
                    <p className="text-[12px] font-mono text-zinc-500">RESOLUTION: 4K HIGH DEPTH</p>
                    <p className="text-[12px] font-mono text-zinc-500">COORD: {Math.floor(Math.random()*1000)}, {Math.floor(Math.random()*1000)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-amber-400/50 font-mono">{scanProgress}%</p>
                  </div>
                </div>

                {/* Animated Scan Bar */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-[2px] bg-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.5)] z-20 animate-[scan_2s_ease-in-out_infinite]" style={{ top: `${scanProgress}%` }}></div>
                )}

                {/* Simulated Data Points */}
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tracing Power Rails</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${scanProgress > 40 ? 'bg-amber-400' : 'bg-zinc-800'}`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${scanProgress > 40 ? 'text-zinc-500' : 'text-zinc-800'}`}>Isolating Control Logic</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${scanProgress > 70 ? 'bg-amber-400' : 'bg-zinc-800'}`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${scanProgress > 70 ? 'text-zinc-500' : 'text-zinc-800'}`}>Verifying SIL Compliance</span>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-lg backdrop-blur-md">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">SYSTEM TELEMETRY</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase">VOLTAGE</p>
                        <p className="text-xs font-mono text-on-surface">24.0V DC</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase">TEMP</p>
                        <p className="text-xs font-mono text-on-surface">32.4°C</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Simplified Navigation */}
      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-2 items-center bg-zinc-900 pb-safe border-t border-zinc-800 z-50">
        <button 
          onClick={() => onNavigate('analyze')}
          className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-4 transition-all border-r border-zinc-800"
        >
          <span className="material-symbols-outlined">center_focus_weak</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">Analyze Terminal</span>
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className="flex flex-col items-center justify-center text-zinc-500 py-4 hover:text-amber-400 transition-all"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">Audit Archive</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CircuitAnalysis;
