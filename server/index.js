const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_FAKE_KEY_FOR_SETUP");

// Helper to convert base64 to GenerativePart
function fileToGenerativePart(base64Str) {
  if (!base64Str) return null;
  const mimeType = base64Str.match(/^data:(.*);base64,/)?.[1] || 'image/png';
  const data = base64Str.replace(/^data:.*;base64,/, "");
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}

// Operational Constraint: Technical Audit Mode Logic
app.post('/api/audit', async (req, res) => {
    try {
        const { image, text } = req.body;

        if (!image && !text) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Data Insufficiency Error: No schematic or logic provided." 
            });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest",
            generationConfig: {
                temperature: 0,
                topP: 1,
                topK: 1,
                maxOutputTokens: 8192,
            }
        });

        const prompt = `
            You are the "GearGuard Ultra-Deep Forensic Audit Engine" - a State-of-the-Art Industrial Safety AI.
            
            YOUR MISSION:
            Perform an EXHAUSTIVE, NODE-BY-NODE forensic audit of the provided industrial schematic. 
            There is ZERO TOLERANCE for missing components. If a line, a label, or a symbol exists, it MUST be audited.
            
            CRITICAL DIRECTIVES:
            1. COMPLETE BILL OF MATERIALS (BOM): Identify EVERY single component. Specifically look for designators (RY1, R1, C1, IC1, D1, etc.). Do not summarize. List every individual part.
            2. MICROSCOPIC SCAN: Zoom in mentally on every square millimeter. Detect subtle traces, ground planes, and silk-screen labels.
            3. FUNCTIONAL SYNTHESIS: Explain exactly what the connections and circuit actually DO (e.g. "This connection runs a 3-phase motor" or "This controls a pneumatic solenoid").
            4. TOTAL FAULT RECALL: Identify ALL engineering issues. Logic faults, safety violations (ISO 13849), and hardware vulnerabilities.
            5. OPERATIONAL WARNING: If risk_score > 40, issue a stern warning like "CRITICAL: Fix these issues or the system will not run properly and may cause hardware damage."
            
            OUTPUT FORMAT:
            You MUST return ONLY a raw JSON object. 
            {
              "status": "Critical" | "Warning" | "Safe",
              "risk_score": number,
              "detected_components": [{ "name": string, "designator": string, "estimated_cost": number, "health": number }],
              "logic_vulnerabilities": string[],
              "mitigation_strategies": string[],
              "functional_analysis": string,
              "operational_warning": string,
              "predictive_mtbf": { "hours": number, "risk_level": string },
              "financials": { "total_est_cost": number, "optimization_saving": number },
              "compliance_report": string,
              "certification_id": string,
              "ui_customization": { "theme": "industrial-dark" }
            }
        `;

        const imagePart = fileToGenerativePart(image);
        const inputParts = [prompt];
        if (imagePart) inputParts.push(imagePart);
        if (text) inputParts.push(`PLC Logic / Technical Spec: ${text}`);

        const result = await model.generateContent(inputParts);
        const response = await result.response;
        const responseText = response.text().trim();
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
        
        try {
            const auditResult = JSON.parse(cleanJson);
            res.json(auditResult);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", responseText);
            res.status(500).json({ status: "Error", message: "Audit Engine produced malformed results." });
        }

    } catch (error) {
        console.error("Audit Engine Error:", error);
        res.status(500).json({ status: "Error", message: "Internal Engine Failure: " + error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`GearGuard AI Engine running on port ${PORT}`);
});
