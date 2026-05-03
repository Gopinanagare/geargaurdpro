import React from 'react';

const Dashboard = ({ onNavigate }) => {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-inter">
      {/* TopAppBar */}
      <header className="bg-zinc-950 docked full-width top-0 border-b border-zinc-800 flex justify-between items-center w-full px-6 py-3 z-50 sticky">
        <div className="flex items-center gap-3">
          <img 
            alt="Logo" 
            className="w-8 h-8" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG7gZ4rRfr2ZPgxGAV5KJGZOIYf-FFv2vZS2ufg8CEg8UdbdcSJcyYvBuxRTjrivCIkGt9NUrI0t5zRVulDlvocuiXoFsVZq_HjE3EGc9YUthCNOgkxxHhI4ocRPL5jEBCrY-drwXKd4_8fHpQu6aXWrTqEeqWDfQkq8YTh7ZR5bGe1qriXlrkO8yFV5roIVu98HlwkMyv6GGQX4U6Hrf8Mr6wGGHcjsYLKByKEHCwiKjdVmXajKGSekpPkyg0qQ_zYQ8Rdj8r92o" 
          />
          <h1 className="text-amber-400 font-black tracking-tighter text-xl uppercase">GEARGUARD AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:bg-zinc-900 transition-colors p-2 rounded-full relative active:opacity-80">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full border border-zinc-950"></span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800">
            <img 
              alt="User Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3HS-z74jOXlBipY6fCGbJ8teO-fRqwWoGHz-tZ8Yyk63lNjK6_D_u1GfLCcfRa0ZDn5fc2UaW0yiotL2P8cZhj18FbDJhsaLQltlqwl3wdLeFds-jskclt4leUWAOmetDV6otCcubZRQSfdRCmj4kEUwWWeBHuXpTj9OiZEpwDIf3GPTDxb0JdDgL7MKp9X60NNdghD1TuiMNnlkLAqzCERemnHJ6ufOCDjfqfioAHs6MVHxcdb70qWcpFbpd7sBQUc1o9DUx7o" 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Global Safety Score */}
          <section className="md:col-span-8 bg-surface-container border border-outline-variant p-6 rounded relative overflow-hidden flex flex-col justify-between">
            <div>
              <h2 className="font-label-caps text-[12px] font-bold tracking-widest text-on-surface-variant mb-6 uppercase">GLOBAL SAFETY HEALTH SCORE</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-zinc-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className="text-amber-400" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="55" strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl md:text-5xl font-bold text-amber-400">92</span>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">NOMINAL</span>
                  </div>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 border-l-2 border-tertiary">
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-1 uppercase">FACILITIES ONLINE</p>
                      <p className="font-mono text-xl">14 / 14</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 border-l-2 border-amber-400">
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-1 uppercase">ACTIVE AUDITS</p>
                      <p className="font-mono text-xl">03</p>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">System performance is within optimal parameters. Three minor anomalies detected in Western Sector; diagnostics scheduled for 04:00 UTC.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Action */}
          <section 
            onClick={() => onNavigate('analyze')}
            className="md:col-span-4 bg-primary-container border border-primary-container p-6 rounded flex flex-col justify-center items-center text-center group cursor-pointer active:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-on-primary-container text-5xl mb-4">center_focus_weak</span>
            <h3 className="text-2xl font-bold text-on-primary-container mb-2">SCAN NEW CIRCUIT</h3>
            <p className="text-sm text-on-primary-container/80 max-w-[200px]">Initiate real-time AI thermal and structural analysis on facility hardware.</p>
            <div className="mt-6 px-6 py-2 border-2 border-on-primary-container/20 rounded text-[12px] font-bold tracking-widest text-on-primary-container group-hover:bg-on-primary-container group-hover:text-primary-container transition-colors uppercase">
              START SCAN
            </div>
          </section>

          {/* Recent Audit Activity */}
          <section className="md:col-span-12 lg:col-span-7 bg-surface-container border border-outline-variant rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase">RECENT AUDIT ACTIVITY</h2>
              <button className="text-amber-400 text-[10px] font-bold tracking-widest hover:underline uppercase">VIEW ALL LOGS</button>
            </div>
            <div className="divide-y divide-outline-variant/30">
              <div className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="w-2 h-10 bg-tertiary-container rounded-full"></div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold">Power Grid 7B-Primary</p>
                  <p className="font-mono text-[11px] text-zinc-500 uppercase">Facility: Detroit-Main • 12:45 PM</p>
                </div>
                <div className="px-3 py-1 rounded border border-tertiary/30 bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase">SAFE</div>
              </div>
              <div className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="w-2 h-10 bg-amber-400 rounded-full"></div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold">Conveyor Assembly C-4</p>
                  <p className="font-mono text-[11px] text-zinc-500 uppercase">Facility: Austin-North • 11:20 AM</p>
                </div>
                <div className="px-3 py-1 rounded border border-amber-400/30 bg-amber-400/10 text-amber-400 text-[10px] font-bold uppercase">WARNING</div>
              </div>
              <div className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="w-2 h-10 bg-error-container rounded-full"></div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold">Pressure Valve VP-009</p>
                  <p className="font-mono text-[11px] text-zinc-500 uppercase">Facility: Chicago-Loop • 09:15 AM</p>
                </div>
                <div className="px-3 py-1 rounded border border-error/30 bg-error/10 text-error text-[10px] font-bold uppercase">CRITICAL</div>
              </div>
            </div>
          </section>

          {/* Sensor Readouts */}
          <section className="md:col-span-12 lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="bg-surface-container border border-outline-variant p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">AVG FACILITY TEMP</p>
                <p className="text-2xl font-bold text-on-surface">32.4 <span className="text-lg text-zinc-500">°C</span></p>
              </div>
              <div className="h-12 w-24 bg-zinc-900 rounded overflow-hidden flex items-end">
                <div className="w-1/6 bg-amber-400/40 h-[40%] mx-[1px]"></div>
                <div className="w-1/6 bg-amber-400/40 h-[60%] mx-[1px]"></div>
                <div className="w-1/6 bg-amber-400/40 h-[55%] mx-[1px]"></div>
                <div className="w-1/6 bg-amber-400/40 h-[80%] mx-[1px]"></div>
                <div className="w-1/6 bg-amber-400 h-[70%] mx-[1px]"></div>
                <div className="w-1/6 bg-amber-400 h-[75%] mx-[1px]"></div>
              </div>
            </div>
            <div className="bg-surface-container border border-outline-variant p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">TOTAL ENERGY LOAD</p>
                <p className="text-2xl font-bold text-on-surface">1.2 <span className="text-lg text-zinc-500">MW</span></p>
              </div>
              <div className="h-12 w-24 bg-zinc-900 rounded overflow-hidden flex items-end">
                <div className="w-1/6 bg-tertiary/40 h-[30%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary/40 h-[40%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary/40 h-[35%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary/40 h-[50%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[45%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[40%] mx-[1px]"></div>
              </div>
            </div>
            <div className="bg-surface-container border border-outline-variant p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">UPTIME EFFICIENCY</p>
                <p className="text-2xl font-bold text-on-surface">99.8 <span className="text-lg text-zinc-500">%</span></p>
              </div>
              <div className="h-12 w-24 bg-zinc-900 rounded overflow-hidden flex items-end">
                <div className="w-1/6 bg-tertiary h-[90%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[95%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[92%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[98%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[96%] mx-[1px]"></div>
                <div className="w-1/6 bg-tertiary h-[99%] mx-[1px]"></div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full grid grid-cols-4 items-center bg-zinc-900 pb-safe border-t border-zinc-800 z-50">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex flex-col items-center justify-center text-amber-400 bg-amber-400/5 py-2 transition-all duration-150 ease-in-out hover:text-amber-200"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Dashboard</span>
        </button>
        <button 
          onClick={() => onNavigate('analyze')}
          className="flex flex-col items-center justify-center text-zinc-500 py-2 transition-all duration-150 ease-in-out hover:text-amber-200"
        >
          <span className="material-symbols-outlined">center_focus_weak</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Analyze</span>
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className="flex flex-col items-center justify-center text-zinc-500 py-2 transition-all duration-150 ease-in-out hover:text-amber-200"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">History</span>
        </button>
        <button 
          onClick={() => onNavigate('settings')}
          className="flex flex-col items-center justify-center text-zinc-500 py-2 transition-all duration-150 ease-in-out hover:text-amber-200"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
