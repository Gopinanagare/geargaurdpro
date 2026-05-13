# GearGuard AI 🛡️
### AI-Powered Industrial Safety & Diagnostic Ecosystem

GearGuard AI is a state-of-the-art platform designed to revolutionize industrial safety and maintenance. By leveraging the **Google Gemini 1.5 Pro/Flash API**, it transforms static circuit schematics and machine data into actionable engineering intelligence.

## 🚀 Key Features

### 1. 🔍 Safety Audit Agent (Scan New Audit)
Analyze circuit schematics against global standards (ISO 13849, IEC 61508, etc.) in seconds.
*   **Visual Analysis:** Upload schematic images for instant anomaly detection.
*   **Safety Health Score:** Real-time metrics on your system's compliance level.
*   **Remediation Engine:** Provides specific, technical steps to fix identified risks.

### 2. 🪲 Live Debugger Agent (Troubleshooting)
An interactive "Live" agent that diagnoses machine faults through conversational logic.
*   **Diagnostic Tree:** AI asks targeted yes/no questions based on the symptoms you describe.
*   **Confidence Meter:** Visual tracking of how close the AI is to the solution.
*   **Full Repair Guide:** Get step-by-step instructions, parts lists, and safety warnings.

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
*   **Backend:** Node.js, Express.
*   **AI Engine:** Google Gemini 1.5 Flash & Pro.
*   **Architecture:** Modular agent-based design.

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
Open `http://localhost:5173` to launch GearGuard.

---

## 📤 How to Upload to GitHub

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    ```
2.  **Add your files**:
    ```bash
    git add .
    ```
3.  **Commit your changes**:
    ```bash
    git commit -m "feat: complete GearGuard AI platform with Debugger Agent"
    ```
4.  **Connect to your repo**:
    ```bash
    git remote add origin https://github.com/Gopinanagare/geargaurdpro.git
    ```
5.  **Push to GitHub**:
    ```bash
    git push -u origin main
    ```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ for Advanced Industrial Safety.
