# 🛡️ hacktahon1: GearGuard Industrial Audit Engine

**GearGuard** is a high-precision, safety-critical hardware schematic audit engine designed for industrial control systems. It leverages multimodal AI to perform deep-pixel forensic scanning of hardware designs, ensuring compliance with international safety standards (like IEC 61131-3) and identifying critical failure points before they reach production.

---

## 🚀 Features

- **🔍 Forensic Schematic Scanning**: 100% component and designator recall using advanced AI vision.
- **⚡ PLC Logic Audit**: Comprehensive 'Zero-Trust' safety audits for industrial control hardware and PLC logic.
- **🛡️ Safety Compliance**: Automated verification of Emergency Stop protocols and fail-safe states.
- **📊 Integrity Index**: Professional audit reports with transparent, percentage-based health and risk breakdowns.
- **📜 QR Verification**: Generate QR-verified compliance certificates for industrial documentation.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion (for smooth animations).
- **Backend**: Node.js, Express.
- **AI Engine**: Google Gemini 1.5 Pro (Multimodal analysis).
- **Styling**: Modern, premium "Glassmorphism" UI.

---

## 📦 Project Structure

```bash
hack/
├── client/          # React (Vite) Frontend
├── server/          # Node.js Express Backend
├── stitch_assets/   # Design assets and documentation
└── .gitignore       # Root git configuration
```

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
# Create a .env file and add your GEMINI_API_KEY
npm start
```

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

---

## 🛡️ Safety First
This tool is designed to augment professional engineering audits. Always ensure a qualified safety engineer reviews the generated reports for mission-critical deployments.

---

## 📄 License
MIT License - Copyright (c) 2026 GearGuard Team
