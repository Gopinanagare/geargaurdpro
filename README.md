# GearGuard PRO 🛡️
### AI-Powered Forensic Industrial Audit & Codebase Ecosystem

GearGuard PRO is a state-of-the-art platform designed to revolutionize industrial safety and project analysis. By leveraging the **Google Gemini 2.5 Pro/Flash API**, it transforms hardware schematics and project codebases into actionable engineering and business intelligence.

## 🚀 Key Features

### 1. 🔍 PCB & Schematic Auditor
Analyze hardware schematics and PCB layouts against global safety standards (ISO 13849, IEC 61508, etc.) in seconds.
*   **Forensic Vision:** Upload schematic images for instant anomaly detection and trace analysis.
*   **Safety Health Score:** Real-time metrics on your system's compliance level.
*   **Remediation Engine:** Provides specific, technical steps to fix identified hardware risks.

### 2. 💻 Codebase Auditor (New)
A deep-learning forensic engine that analyzes entire software projects from a `.zip` upload.
*   **Architecture Mapping:** Identifies languages, frameworks, and system workflows automatically.
*   **Business Intelligence:** Analyzes market fit, earning potential, and profit models for your software.

### 3. 📅 Smart Maintenance Planner
Automatically converts audit risks into a prioritized maintenance schedule.
*   **Predictive Scheduling:** Prevents failures by planning repairs before they become critical.
*   **Task Prioritization:** Focuses your team on high-risk components first.

### 4. 📚 Engineering Knowledge Base
Instant access to complex engineering standards and technical documentation.
*   **AI Search:** Ask any technical question and get precise, standard-compliant answers.

### 5. 🗄️ Audit Archive
Persistent storage of all historical audits to track safety improvements over time.

---

## 🛠️ Technical Stack

*   **Frontend:** React, Vite, Vanilla CSS + Tailwind, Google Material Symbols.
*   **Backend:** Node.js, Express, Multer (File Ingestion), Adm-Zip (Archive Processing).
*   **AI Engine:** Google Gemini 2.5 Flash & Pro.
*   **Architecture:** Modular agent-based forensic design.

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Gopinanagare/geargaurdpro.git
cd geargaurdpro
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Run the Platform
**In the server terminal:**
```bash
node audit_engine.js
```
**In the client terminal:**
```bash
npm run dev
```
Open `http://localhost:5173` to launch GearGuard PRO.

---

## 📤 Pushing to GitHub

To update your repository with the latest Forensic Auditor features:

1.  **Stage all changes**:
    ```bash
    git add .
    ```
2.  **Commit the forensic upgrade**:
    ```bash
    git commit -m "feat: implement Codebase Auditor and Forensic Hardware Audit"
    ```
3.  **Push to main**:
    ```bash
    git push origin main
    ```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ for Advanced Industrial Safety and Project Analysis.
