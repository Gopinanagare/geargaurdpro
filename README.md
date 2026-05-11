# 🛡️ GearGuard PRO v12.0 — Hyper-Forensic Audit Engine
### *The Zero-Trust Standard for Industrial Safety & Logic Verification*

**GearGuard PRO** is a state-of-the-art, AI-powered forensic audit platform designed to eliminate failure points in industrial control systems. By combining deep-pixel computer vision with Gemini Multimodal Ensemble logic, it provides a "Digital Twin" audit experience that exceeds human capability in both speed and recall.

---

## 🏛️ System Architecture
GearGuard PRO is built on a **High-Precision Multimodal Ensemble Pipeline**:
1. **Vision Layer**: Neural pixel scanning of hardware schematics vs. PCB layouts.
2. **Logic Layer**: Advanced timing analysis (RC+BJT 0.7V threshold) and functional synthesis.
3. **Audit Layer**: Semantic deduplication and cross-verification against international standards (ISO, IEC, UL).
4. **Advisory Layer**: Targeted predictive maintenance planning and real-time AI Chat.

---

## 🚀 Features

### Core Audit Engine
- **🔍 Zero-Trust Forensic Scan** — 100% component and designator recall with deep-pixel AI vision analysis.
- **⚡ Semantic Deduplication (v11.6)** — Advanced LLM-assisted merging of redundant anomalies (e.g., 'timing' vs 'delay' networks).
- **🌡️ Thermal Zone Mapping** — AI identifies physical hotspot areas vs. logical thermal specs.
- **🔁 Redundancy Verification** — Mandatory Flyback Diode checks for Relay+Transistor circuits.
- **⏱️ Advanced Timing Analysis** — Precision RC network auditing against BJT Vbe thresholds (~0.7V).

### Advanced Intelligence
- **🤖 AI Chat Follow-Up** — Context-aware follow-up Q&A about specific audit findings.
- **📋 Maintenance Archive** — Full historical browse-and-recall system for all past audits.
- **💬 Targeted Inquiry Planning** — User-driven maintenance scheduling based on specific system requirements.
- **🧠 Component Knowledge Base** — Search any component for specs, failure modes, and modern replacements.

### Enterprise Features
- **🎯 Compliance Standard Selector** — ISO 13849, IEC 61508, IEC 62443, NFPA 79, UL 508A.
- **🎙️ Voice Command Input** — Hands-free operation via Web Speech API.
- **🛡️ Session Isolation** — CRITICAL: State-purge protocol ensuring zero data leakage between audits.
- **📜 QR-Verified Certificates** — Professional compliance certificates with QR verification codes.
- **💾 Persistent History** — LocalStorage-based audit archive with persistent maintenance plans.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TailwindCSS 4 |
| Backend | Node.js, Express 5 |
| AI Engine | Google Gemini 1.5 Flash (Ensemble Architecture) |
| Storage | LocalStorage (client-side persistence) |
| Voice | Web Speech API |
| Logic | Semantic Sanitization Pipeline v11.5 |

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
│       │   ├── MaintenancePlanner.jsx# Archive-linked maintenance planner
│       │   ├── KnowledgeBase.jsx     # Component intelligence DB
│       │   ├── AIChatPanel.jsx       # AI follow-up chat panel
│       ├── App.jsx                   # Router + State Synchronization
│       └── index.css                 # Design system + animations
├── server/
│   ├── audit_engine.js               # Core Ensemble Backend
│   └── .env                          # Security credentials
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/audit` | Ensemble forensic audit with state-purge isolation |
| POST | `/api/maintenance` | Targeted strategic maintenance plan generation |
| POST | `/api/chat` | Context-aware follow-up Q&A |
| POST | `/api/knowledge` | Deep component intelligence lookup |

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
node audit_engine.js
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
- **15 requests/minute** — Parallel ensemble calls with exponential backoff.
- **Session Isolation** — Programmatic cleanup ensuring no data leakage between requests.
- **Semantic Merging** — Reducing token costs by merging redundant analysis results.

---

## 🛡️ Safety First

This tool is designed to augment professional engineering audits. Always ensure a qualified safety engineer reviews the generated reports for mission-critical deployments.

---

## 📄 License
MIT License - Copyright (c) 2026 GearGuard Team
