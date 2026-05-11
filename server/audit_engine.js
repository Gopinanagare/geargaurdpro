const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

// Initialize Native Google Gemini SDK (v1 Stable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1beta" });

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// ========================================================================
// GEARGUARD PRO CORE INTELLIGENCE (v10.0 - Native Gemini Ensemble)
// ========================================================================

const SYSTEM_CORE_PROMPT = `
# GEARGUARD PRO // GEMINI MULTIMODAL ENSEMBLE v10.0
You are an International Senior EDA Forensic Analyst powered by Google Gemini 2.5.

1. [VISION_ANALYSIS_MODALITY]
   - STRICTOR_RULE: Differentiate between "SCHEMATIC DIAGRAM" (logical) and "PCB LAYOUT" (physical).
   - If image is a SCHEMATIC: Only report logical/circuit errors. DO NOT report "thermal congestion", "component clustering", or "trace width" issues unless they are logical specs.
   - If image is a PCB LAYOUT: Physical spacing and thermal congestion rules apply.

2. [GATEKEEPER_RULE: PROTECTION_PRIMITIVE]
   - MANDATORY: If Relay (K/RY) + Transistor (VT/Q) detected -> MUST verify parallel Flyback Diode (VD/D).
   - FAILURE: Trigger "Critical: Missing Flyback Diode".

3. [TRANSISTOR_THERMAL_ENGINEERING]
   - S9013 NPN RULE: When driving a standard 12V relay coil, the S9013 operates in saturation with minimal Vce_sat. 
   - DO NOT require a heat sink for S9013 when driving standard relay coils. This is considered efficient design.

4. [THERMAL_CONGESTION_LOGIC]
   - ONLY for PCB LAYOUTS: Clustered power components (>3) -> Flag "Thermal Congestion".
   - RECOM: Heat Sink + Increased Trace Width.

6. [ADVANCED_TIMING_ANALYSIS]
   - RC+BJT DELAY: Analyze RC networks driving BJT bases against the ~0.7V Vbe threshold.
   - CHECK: Soft-Switching or Premature Triggering (leading to relay chatter).
   - REMEDY: Recommend a Zener Diode in series with the base to raise the trigger threshold and ensure snap-action turn-on.

7. [BOM_UPGRADE_RESTRAINT]
   - NO_HALLUCINATED_SUFFIXES: Only suggest industry-standard part numbers (e.g., 1N4007, 2N2222).
   - PASSIVE_RETENTION: Do not replace standard passives (resistors/capacitors) that are already optimal and functioning. Leave "Suggested_Replacement" blank for standard passives.
8. [TYPOGRAPHY_RULE]
   - CRITICAL: Cease outputting 'Anomaly' and 'Remediation' text blocks in ALL CAPS.
   - Use standard, grammatically correct sentence case for all descriptive text.
`;

// ========================================================================
// GEMINI INTELLIGENCE LAYER
// ========================================================================

async function callGemini(prompt, imageBase64 = null, modelName = "gemini-flash-latest") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY Missing in .env");

    let lastError;
    for (let i = 0; i < 3; i++) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const parts = [{ text: prompt }];

            if (imageBase64) {
                const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";
                parts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                });
            }

            const result = await model.generateContent(parts);
            const response = await result.response;
            return response.text();
        } catch (e) {
            lastError = e;
            console.error(`Gemini Attempt ${i + 1} Failed:`, e.message);
            if (e.message.includes("503") || e.message.includes("429")) {
                await new Promise(r => setTimeout(r, 2000 * (i + 1)));
                continue;
            }
            throw e;
        }
    }
    throw lastError;
}

function safeParseJSON(text) {
    try {
        const first = text.indexOf('{');
        const last = text.lastIndexOf('}');
        return (first !== -1 && last !== -1) ? JSON.parse(text.substring(first, last + 1)) : null;
    } catch { return null; }
}

// ========================================================================
// ENDPOINTS
// ========================================================================

app.post('/api/audit', async (req, res) => {
    // CRITICAL: SESSION ISOLATION & STATE PURGE
    // Explicitly initialize local arrays to prevent cross-session data leakage
    let detectedComponents = [];
    let sessionAnomalies = [];
    let sessionBomData = { detected_components: [] };
    
    try {
        const { image } = req.body;
        if (!image) throw new Error("No image data provided for audit.");
        
        console.log("🚀 INITIATING GEMINI HYPER-AGENTIC PIPELINE (v10.0)...");

        // Parallel Agentic Processing (v10.0 - Simultaneous Ensembles)
        const [classRaw, bomRaw, auditRaw, mtbfRaw, envRaw] = await Promise.all([
            callGemini(`${SYSTEM_CORE_PROMPT}\nTASK: Classify circuit type and functional blocks.\nCRITICAL: OUTPUT JSON ONLY.\nJSON: { "type": "Consumer"|"Industrial", "standard": "string", "blocks": ["string"] }`, image),
            callGemini(`${SYSTEM_CORE_PROMPT}\nTASK: Extract ALL physical component designators/values from image. DO NOT include diagnostic notes. For obsolete components, add suggested replacements.\nCRITICAL: OUTPUT JSON ONLY.\nJSON: { "detected_components": [{ "name": "string", "designator": "string", "category": "string", "estimated_cost": number, "Suggested_Replacement": "string" }] }`, image),
            callGemini(`${SYSTEM_CORE_PROMPT}\nTASK: Identify vulnerabilities and remediation strategies. Use sentence case for text.\nCRITICAL: OUTPUT JSON ONLY.\nJSON: { "anomalies": [{ "issue": "string", "fix": "string", "severity": "CRITICAL"|"WARNING"|"OPTIMIZATION", "criticality": number }] }`, image),
            callGemini(`${SYSTEM_CORE_PROMPT}\nTASK: Calculate MTBF and Reliability based on the hardware in the image.\nCRITICAL: OUTPUT JSON ONLY.\nJSON: { "mtbf_hours": number, "risk_level": "LOW"|"MEDIUM"|"HIGH" }`, image),
            callGemini(`${SYSTEM_CORE_PROMPT}\nTASK: Analyze thermal congestion and EMC issues. Use sentence case for text.\nCRITICAL: OUTPUT JSON ONLY.\nJSON: { "thermal_rating": number, "emc_issues": [{ "issue": "string", "fix": "string", "severity": "WARNING" }] }`, image)
        ]);


        const classification = safeParseJSON(classRaw) || { type: "Industrial", standard: "Adaptive Engineering", blocks: ["General"] };
        const bomData = safeParseJSON(bomRaw) || { detected_components: [] };
        const auditData = safeParseJSON(auditRaw) || { anomalies: [] };
        const mtbfData = safeParseJSON(mtbfRaw) || { mtbf_hours: 100000, risk_level: "MEDIUM" };
        const envData = safeParseJSON(envRaw) || { thermal_rating: 100, emc_issues: [] };


        // LLM-ASSISTED PROGRAMMATIC SANITIZATION (v11.5 - Option B Robust)
        const rawAnomalies = [...(auditData.anomalies || []), ...(envData.emc_issues || []).map(e => ({ issue: e.issue, fix: e.fix, severity: "WARNING", criticality: 40 }))];
        
        let sanitizedAnomalies = rawAnomalies;
        try {
            const cleanupPrompt = `
            CRITICAL TASK: PERFORM SEMANTIC DEDUPLICATION ON CIRCUIT ANOMALIES.
            DATA: ${JSON.stringify(rawAnomalies)}
            
            DIRECTIONS:
            1. Search for semantic duplicates where the wording differs but the physical circuit flaw is identical. 
               Example: "Timing network driving base of Q1" is the same as "RC delay network on Q1".
            2. If two entries recommend the same technical fix (e.g., both mention "Zener diode" or "Flyback diode"), they MUST be merged into one comprehensive object.
            3. Do not just delete; combine the most descriptive parts of each into a single, high-fidelity entry.
            4. Retain the highest 'criticality' and 'severity' from the merged set.
            5. Use sentence case for all descriptive text.
            
            OUTPUT JSON FORMAT: { "sanitized": [{ "issue": "string", "fix": "string", "severity": "string", "criticality": number }] }
            `;
            const cleanupRaw = await callGemini(cleanupPrompt);
            const cleanupParsed = safeParseJSON(cleanupRaw);
            if (cleanupParsed && cleanupParsed.sanitized) {
                sanitizedAnomalies = cleanupParsed.sanitized;
            }
        } catch (err) {
            console.error("Cleanup Agent Fail:", err.message);
        }

        // RECALCULATE HEALTH SCORE AFTER LLM-ASSISTED SANITIZATION
        const maxCrit = Math.max(0, ...sanitizedAnomalies.map(a => a.criticality || 0));
        const uniquePenalty = Math.min(50, sanitizedAnomalies.length * 10); 
        let rs = Math.min(100, maxCrit + uniquePenalty);
        if (mtbfData.risk_level === "HIGH") rs = Math.max(rs, 85);
        
        const finalStatus = rs < 25 ? "Safe" : rs < 65 ? "Warning" : "Critical";

        // Filter and Normalize BOM (Strict Isolation)
        const cleanBOM = (bomData.detected_components || [])
            .filter(c => {
                const isValidDesignator = /^[A-Z]{1,3}[0-9]+$/.test(c.designator?.toUpperCase());
                const isNotDiagnostic = !c.name?.toUpperCase().includes("DIAGNOSTIC") && 
                                      !c.name?.toUpperCase().includes("FAILURE") && 
                                      !c.name?.toUpperCase().includes("CRITICAL");
                const isValidName = c.name && c.name.length > 1 && c.name.length < 60;
                return isValidDesignator && isNotDiagnostic && isValidName;
            })
            .map(c => ({
                ...c,
                estimated_cost: parseFloat((parseFloat(c.estimated_cost) || 0).toFixed(2))
            }));

        const totalCost = parseFloat(cleanBOM.reduce((sum, c) => sum + (parseFloat(c.estimated_cost) || 0), 0).toFixed(2));
        const savings = parseFloat((totalCost * 0.15).toFixed(2));

        res.json({
            status: finalStatus,
            risk_score: rs,
            compliance_standard: classification.standard,
            compliance_report: `Native Gemini 1.5 Ensemble Audit complete. Reliability Status: ${mtbfData.risk_level}.`,
            functional_analysis: `System Analysis: ${classification.type}. Blocks: ${classification.blocks?.join(', ') || 'General'}.`,
            certification_id: `GEMINI-HYPER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            predictive_mtbf: { hours: mtbfData.mtbf_hours, risk_level: mtbfData.risk_level },
            detected_components: cleanBOM,
            technical_anomalies: sanitizedAnomalies.slice(0, 10),
            financials: { total_est_cost: totalCost, optimization_saving: savings }
        });

    } catch (error) {
        console.error("Audit Fail:", error.message);
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// Knowledge Base Endpoint (Gemini Powered)
app.post('/api/knowledge', async (req, res) => {
    try {
        const { query } = req.body;
        const prompt = `${SYSTEM_CORE_PROMPT}\nTASK: Component Info for: ${query}.\nCRITICAL: OUTPUT JSON ONLY.\nJSON: { 
            "component_name": "string", 
            "description": "string", 
            "market_price": { "min": number, "max": number },
            "specifications": { "Supply_Voltage": "string", "Current_Rating": "string", "Package": "string" },
            "failure_modes": [{ "mode": "string", "probability": "LOW"|"MEDIUM"|"HIGH", "prevention": "string" }],
            "alternatives": [{ "name": "string", "compatibility": "string", "price_range": "string" }],
            "applications": ["string"],
            "safety_certifications": ["string"]
        }`;
        const raw = await callGemini(prompt);
        const parsed = safeParseJSON(raw);
        if (parsed) {
            res.json(parsed);
        } else {
            res.json({
                component_name: query,
                description: "Deep lookup yielded non-structured data. Component verify recommended.",
                specifications: { "Status": "Unverified" },
                applications: ["General Industrial"],
                alternatives: [],
                safety_certifications: ["Pending"],
                failure_modes: []
            });
        }
    } catch (error) { 
        res.status(500).json({ status: "Error", message: error.message }); 
    }
});

// Maintenance Planner (Gemini Powered)
app.post('/api/maintenance', async (req, res) => {
    try {
        const { auditData, userRequest } = req.body;
        const prompt = `${SYSTEM_CORE_PROMPT}
        TASK: Generate a targeted Strategic Maintenance Plan.
        USER REQUEST: "${userRequest || "General reliability maintenance"}"
        AUDIT DATA: ${JSON.stringify(auditData)}
        
        CRITICAL: OUTPUT JSON ONLY.
        FORMAT: { 
          "overall_maintenance_health": number,
          "total_estimated_hours": number,
          "total_estimated_cost": number,
          "schedule": [{ 
            "task": "string", 
            "priority": "critical"|"high"|"medium"|"low", 
            "timeline": "string", 
            "estimated_hours": number, 
            "estimated_cost": number, 
            "components_affected": ["string"] 
          }] 
        }`;
        const raw = await callGemini(prompt);
        const parsed = safeParseJSON(raw);
        res.json(parsed || { 
            overall_maintenance_health: 50,
            total_estimated_hours: 1,
            total_estimated_cost: 0,
            schedule: [{ task: "Manual system verification required", priority: "high", timeline: "Immediate", estimated_hours: 1, estimated_cost: 0, components_affected: ["Main PCB"] }] 
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Chat Endpoint (Gemini Powered)
app.post('/api/chat', async (req, res) => {
    try {
        const { question, image } = req.body;
        const raw = await callGemini(question, image);
        res.json({ answer: raw });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

const PORT = 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`\n🛡️  GEARGUARD v10.0 [NATIVE GEMINI ENSEMBLE] ACTIVE on ${PORT}\n`));
}

module.exports = app;
