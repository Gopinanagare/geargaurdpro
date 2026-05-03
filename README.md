# 🛡️ GearGuard PRO v5.0 — Industrial Audit Engine
### *The Zero-Trust Standard for Industrial Safety & Logic Verification*

**GearGuard PRO** is a state-of-the-art, AI-powered forensic audit platform designed to eliminate failure points in industrial control systems. By combining deep-pixel computer vision with LLM-driven logic synthesis, it provides a "Digital Twin" audit experience that exceeds human capability in both speed and recall.

---

## 🏛️ System Architecture
GearGuard PRO is built on a **High-Precision Multimodal Pipeline**:
1. **Vision Layer**: Neural pixel scanning of hardware schematics.
2. **Logic Layer**: IEC 61131-3 code analysis and functional synthesis.
3. **Audit Layer**: Cross-verification against international safety standards (ISO, IEC, UL).
4. **Advisory Layer**: Real-time context-aware engineering support via AI Chat.

---

## 🚀 Features

### Core Audit Engine
- **🔍 Zero-Trust Forensic Scan** — 100% component and designator recall with deep-pixel AI vision analysis
- **⚡ PLC Logic Co-Audit** — Hardware + logic combined analysis for comprehensive safety verification
- **🌡️ Thermal Zone Mapping** — AI identifies hotspot areas and thermal failure risk zones
- **📡 EMC/EMI Analysis** — Electromagnetic compatibility and interference assessment
- **🔁 Redundancy Verification** — Safety-critical path redundancy checks

### Advanced Intelligence
- **🤖 AI Chat Follow-Up** — Ask questions about your audit results in real-time ("Why is RY1 critical?")
- **🔄 Multi-Schematic Diff Audit** — Compare two designs side-by-side with safety impact analysis
- **📋 Predictive Maintenance Planner** — AI-generated Gantt-style maintenance schedules with cost estimates
- **🧠 Component Knowledge Base** — Search any component for specs, failure modes, and alternatives

### Enterprise Features
- **🎯 Compliance Standard Selector** — Choose from ISO 13849, IEC 61508, IEC 62443, NFPA 79, UL 508A
- **🌐 Multi-Language Reports** — Generate audits in English, Hindi, Spanish, German, Japanese, French
- **🎙️ Voice Command Input** — Hands-free operation via Web Speech API
- **📊 Smart Clipboard** — One-click BOM CSV export, remediation copy, share links
- **📜 QR-Verified Certificates** — Professional compliance certificates with QR verification codes
- **⌨️ Command Palette (Ctrl+K)** — Quick access to all features with keyboard shortcuts
- **💾 Persistent History** — LocalStorage-based audit archive with JSON export

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TailwindCSS 4 |
| Backend | Node.js, Express 5 |
| AI Engine | Google Gemini 2.0 Flash (Free Tier Compatible) |
| Storage | LocalStorage (client-side persistence) |
| Voice | Web Speech API |
| Design | Premium Industrial Dark UI, Glassmorphism |

---

## 📦 Project Structure

```
hack/
├── client/                    # React (Vite) Frontend
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx        # Dynamic stats dashboard
│       │   ├── CircuitAnalysis.jsx   # Multimodal input + scanning UI
│       │   ├── AuditReport.jsx       # Full forensic report view
│       │   ├── AuditHistory.jsx      # Persistent audit archive
│       │   ├── AIChatPanel.jsx       # AI follow-up chat panel
│       │   ├── CompareAudit.jsx      # Multi-schematic diff audit
│       │   ├── MaintenancePlanner.jsx# Predictive maintenance
│       │   ├── KnowledgeBase.jsx     # Component intelligence DB
│       │   └── CommandPalette.jsx    # Ctrl+K command palette
│       ├── App.jsx                   # Router + state management
│       └── index.css                 # Design system + animations
├── server/
│   └── index.js                      # Express API (5 endpoints)
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/audit` | Core forensic audit with compliance & language selection |
| POST | `/api/chat` | AI follow-up Q&A about audit results |
| POST | `/api/compare` | Multi-schematic diff comparison |
| POST | `/api/maintenance` | Predictive maintenance schedule generation |
| POST | `/api/knowledge` | Component intelligence lookup |
| GET | `/api/health` | Engine status and rate limit info |

---

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Gopinanagare/hacktahon1.git
cd hacktahon1
```

### 2. Setup Backend
```bash
cd server
npm install
# Create a .env file with: GEMINI_API_KEY=your_key_here
node index.js
```

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

---

## ⚡ Free Tier Optimized

This project is designed to work within Google Gemini's free tier limits:
- **15 requests/minute** — Built-in server-side rate limiter (set to 14 RPM for safety)
- **1M tokens/day** — Optimized prompts for token efficiency
- **No database required** — Client-side LocalStorage for persistence

---

## 🛡️ Safety First

This tool is designed to augment professional engineering audits. Always ensure a qualified safety engineer reviews the generated reports for mission-critical deployments.

---

## 📄 License
MIT License - Copyright (c) 2026 GearGuard Team
