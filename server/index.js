const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_FAKE_KEY_FOR_SETUP");

// ========================================================================
// RATE LIMITER — Stays within free tier (15 RPM, 1M tokens/day)
// ========================================================================
const rateLimiter = {
    requests: [],
    maxPerMinute: 14, // stay 1 under limit for safety
    check() {
        const now = Date.now();
        this.requests = this.requests.filter(t => now - t < 60000);
        if (this.requests.length >= this.maxPerMinute) {
            return false;
        }
        this.requests.push(now);
        return true;
    }
};

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

// Helper to safely parse JSON from Gemini
function safeParseJSON(text) {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
        // Try to extract JSON array
        try {
            const arrMatch = text.match(/\[[\s\S]*\]/);
            return arrMatch ? JSON.parse(arrMatch[0]) : null;
        } catch {
            return null;
        }
    }
}

// Get model instance with given config
function getModel(temperature = 0, maxTokens = 8192) {
    return genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            temperature,
            topP: 1,
            topK: 1,
            maxOutputTokens: maxTokens,
        }
    });
}

// ========================================================================
// ENDPOINT 1: CORE AUDIT (Enhanced with compliance standard + language)
// ========================================================================
app.post('/api/audit', async (req, res) => {
    try {
        if (!rateLimiter.check()) {
            return res.status(429).json({ status: "Error", message: "Rate limit exceeded. Free tier allows 15 requests/minute. Please wait." });
        }

        const { image, text, complianceStandard = "ISO 13849", language = "English" } = req.body;

        if (!image && !text) {
            return res.status(400).json({
                status: "Error",
                message: "Data Insufficiency Error: No schematic or logic provided."
            });
        }

        const model = getModel(0);

        const prompt = `
            You are the "GearGuard Ultra-Deep Forensic Audit Engine v5.0" - a State-of-the-Art Industrial Safety AI.
            
            COMPLIANCE STANDARD: ${complianceStandard}
            OUTPUT LANGUAGE: ${language}
            
            YOUR MISSION:
            Perform an EXHAUSTIVE, NODE-BY-NODE forensic audit of the provided industrial schematic. 
            There is ZERO TOLERANCE for missing components. If a line, a label, or a symbol exists, it MUST be audited.
            
            CRITICAL DIRECTIVES:
            1. COMPLETE BILL OF MATERIALS (BOM): Identify EVERY single component. Specifically look for designators (RY1, R1, C1, IC1, D1, etc.). Do not summarize. List every individual part.
            2. MICROSCOPIC SCAN: Zoom in mentally on every square millimeter. Detect subtle traces, ground planes, and silk-screen labels.
            3. FUNCTIONAL SYNTHESIS: Explain exactly what the connections and circuit actually DO (e.g. "This connection runs a 3-phase motor" or "This controls a pneumatic solenoid").
            4. TOTAL FAULT RECALL: Identify ALL engineering issues. Logic faults, safety violations (${complianceStandard}), and hardware vulnerabilities.
            5. OPERATIONAL WARNING: If risk_score > 40, issue a stern warning like "CRITICAL: Fix these issues or the system will not run properly and may cause hardware damage."
            6. THERMAL ANALYSIS: Identify potential hotspot zones and thermal failure risk areas.
            7. EMC/EMI ANALYSIS: Check for electromagnetic interference and compatibility issues.
            8. REDUNDANCY CHECK: Verify safety-critical paths have proper redundancy.
            
            OUTPUT FORMAT:
            You MUST return ONLY a raw JSON object (all text content in ${language}).
            {
              "status": "Critical" | "Warning" | "Safe",
              "risk_score": number (0-100),
              "detected_components": [{ "name": string, "designator": string, "estimated_cost": number, "health": number, "category": "power"|"logic"|"sensor"|"actuator"|"protection"|"passive"|"connector", "thermal_risk": "low"|"medium"|"high" }],
              "logic_vulnerabilities": string[],
              "mitigation_strategies": string[],
              "functional_analysis": string,
              "operational_warning": string,
              "predictive_mtbf": { "hours": number, "risk_level": string },
              "financials": { "total_est_cost": number, "optimization_saving": number },
              "compliance_report": string,
              "compliance_standard": "${complianceStandard}",
              "certification_id": string,
              "thermal_zones": [{ "zone": string, "temperature_estimate": string, "risk": "low"|"medium"|"high" }],
              "emc_analysis": { "susceptibility": string, "emissions": string, "recommendations": string[] },
              "redundancy_assessment": { "score": number, "gaps": string[] },
              "circuit_topology": string,
              "power_budget": { "total_consumption_watts": number, "peak_watts": number, "efficiency_percent": number },
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

        const auditResult = safeParseJSON(responseText);
        if (auditResult) {
            res.json(auditResult);
        } else {
            console.error("Failed to parse Gemini response:", responseText);
            res.status(500).json({ status: "Error", message: "Audit Engine produced malformed results." });
        }

    } catch (error) {
        console.error("Audit Engine Error:", error);
        res.status(500).json({ status: "Error", message: "Internal Engine Failure: " + error.message });
    }
});

// ========================================================================
// ENDPOINT 2: AI CHAT FOLLOW-UP (Ask questions about audit results)
// ========================================================================
app.post('/api/chat', async (req, res) => {
    try {
        if (!rateLimiter.check()) {
            return res.status(429).json({ status: "Error", message: "Rate limit exceeded. Please wait." });
        }

        const { question, auditContext, image } = req.body;

        if (!question) {
            return res.status(400).json({ status: "Error", message: "No question provided." });
        }

        const model = getModel(0.3, 4096);

        const prompt = `
            You are the GearGuard AI Engineering Advisor. A user has just completed an industrial hardware audit and has a follow-up question.
            
            AUDIT RESULTS CONTEXT:
            ${JSON.stringify(auditContext || {})}
            
            USER QUESTION: "${question}"
            
            INSTRUCTIONS:
            - Answer precisely and technically.
            - Reference specific components by their designator if relevant.
            - If the question is about cost, provide market estimates.
            - If the question is about safety, cite the relevant standard section.
            - Keep the answer focused and under 300 words.
            - Be helpful but stern about safety — never downplay risks.
            
            Return a JSON object:
            {
              "answer": string,
              "references": string[],
              "severity": "info" | "warning" | "critical",
              "suggested_followups": string[]
            }
        `;

        const inputParts = [prompt];
        const imagePart = fileToGenerativePart(image);
        if (imagePart) inputParts.push(imagePart);

        const result = await model.generateContent(inputParts);
        const response = await result.response;
        const responseText = response.text().trim();

        const chatResult = safeParseJSON(responseText);
        if (chatResult) {
            res.json(chatResult);
        } else {
            res.json({ answer: responseText, references: [], severity: "info", suggested_followups: [] });
        }

    } catch (error) {
        console.error("Chat Engine Error:", error);
        res.status(500).json({ status: "Error", message: "Chat Engine Failure: " + error.message });
    }
});

// ========================================================================
// ENDPOINT 3: MULTI-SCHEMATIC COMPARISON (Diff Audit)
// ========================================================================
app.post('/api/compare', async (req, res) => {
    try {
        if (!rateLimiter.check()) {
            return res.status(429).json({ status: "Error", message: "Rate limit exceeded. Please wait." });
        }

        const { imageA, imageB, textA, textB } = req.body;

        if (!imageA && !imageB) {
            return res.status(400).json({ status: "Error", message: "At least two schematics required for comparison." });
        }

        const model = getModel(0);

        const prompt = `
            You are the GearGuard Diff Audit Engine. Compare TWO industrial schematics or designs and produce a comprehensive comparison report.
            
            INSTRUCTIONS:
            1. Identify components present in Design A but missing in Design B (and vice versa).
            2. Detect modifications to existing components (value changes, repositioning).
            3. Analyze which design is SAFER from an industrial safety perspective.
            4. Provide a migration path from Design A to Design B (or recommend which to use).
            5. Estimate cost difference between the two designs.
            
            Return ONLY a raw JSON object:
            {
              "summary": string,
              "design_a_exclusive": [{ "component": string, "designator": string, "impact": string }],
              "design_b_exclusive": [{ "component": string, "designator": string, "impact": string }],
              "modifications": [{ "component": string, "change": string, "safety_impact": "positive"|"negative"|"neutral" }],
              "safer_design": "A" | "B" | "Equal",
              "safety_reasoning": string,
              "cost_difference": { "design_a_cost": number, "design_b_cost": number, "savings": number },
              "recommendation": string,
              "migration_steps": string[]
            }
        `;

        const inputParts = [prompt];
        const imagePartA = fileToGenerativePart(imageA);
        const imagePartB = fileToGenerativePart(imageB);
        if (imagePartA) inputParts.push("Design A schematic:", imagePartA);
        if (imagePartB) inputParts.push("Design B schematic:", imagePartB);
        if (textA) inputParts.push(`Design A specs: ${textA}`);
        if (textB) inputParts.push(`Design B specs: ${textB}`);

        const result = await model.generateContent(inputParts);
        const response = await result.response;
        const responseText = response.text().trim();

        const compareResult = safeParseJSON(responseText);
        if (compareResult) {
            res.json(compareResult);
        } else {
            console.error("Failed to parse comparison:", responseText);
            res.status(500).json({ status: "Error", message: "Comparison Engine produced malformed results." });
        }

    } catch (error) {
        console.error("Compare Engine Error:", error);
        res.status(500).json({ status: "Error", message: "Comparison Engine Failure: " + error.message });
    }
});

// ========================================================================
// ENDPOINT 4: PREDICTIVE MAINTENANCE SCHEDULE GENERATOR
// ========================================================================
app.post('/api/maintenance', async (req, res) => {
    try {
        if (!rateLimiter.check()) {
            return res.status(429).json({ status: "Error", message: "Rate limit exceeded. Please wait." });
        }

        const { auditData } = req.body;

        if (!auditData) {
            return res.status(400).json({ status: "Error", message: "Audit data required for maintenance scheduling." });
        }

        const model = getModel(0.1, 4096);

        const prompt = `
            You are the GearGuard Predictive Maintenance Planner. Based on the audit results, generate a comprehensive maintenance schedule.
            
            AUDIT DATA:
            ${JSON.stringify(auditData)}
            
            Generate a maintenance schedule considering:
            1. Component age estimates based on health scores
            2. Critical components get priority scheduling
            3. Group related maintenance tasks to minimize downtime
            4. Include estimated time and cost for each task
            
            Return ONLY a raw JSON object:
            {
              "schedule": [
                {
                  "task": string,
                  "priority": "critical" | "high" | "medium" | "low",
                  "timeline": string,
                  "estimated_hours": number,
                  "estimated_cost": number,
                  "components_affected": string[],
                  "downtime_required": boolean
                }
              ],
              "total_estimated_cost": number,
              "total_estimated_hours": number,
              "next_critical_action": string,
              "overall_maintenance_health": number
            }
        `;

        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const responseText = response.text().trim();

        const maintenanceResult = safeParseJSON(responseText);
        if (maintenanceResult) {
            res.json(maintenanceResult);
        } else {
            res.status(500).json({ status: "Error", message: "Maintenance planner produced malformed results." });
        }

    } catch (error) {
        console.error("Maintenance Engine Error:", error);
        res.status(500).json({ status: "Error", message: "Maintenance Engine Failure: " + error.message });
    }
});

// ========================================================================
// ENDPOINT 5: COMPONENT KNOWLEDGE BASE LOOKUP
// ========================================================================
app.post('/api/knowledge', async (req, res) => {
    try {
        if (!rateLimiter.check()) {
            return res.status(429).json({ status: "Error", message: "Rate limit exceeded. Please wait." });
        }

        const { componentName, query } = req.body;

        if (!componentName && !query) {
            return res.status(400).json({ status: "Error", message: "Component name or query required." });
        }

        const model = getModel(0.2, 4096);

        const prompt = `
            You are the GearGuard Component Intelligence Database. Provide comprehensive technical data about the requested component.
            
            COMPONENT/QUERY: "${componentName || query}"
            
            Provide:
            1. Full technical specifications
            2. Common failure modes
            3. Compatible alternatives/substitutes
            4. Current market pricing range
            5. Typical applications in industrial settings
            6. Safety considerations and certifications
            
            Return ONLY a raw JSON object:
            {
              "component_name": string,
              "description": string,
              "specifications": { "voltage_rating": string, "current_rating": string, "power_rating": string, "temperature_range": string, "package": string },
              "failure_modes": [{ "mode": string, "probability": string, "prevention": string }],
              "alternatives": [{ "name": string, "compatibility": string, "price_range": string }],
              "market_price": { "min": number, "max": number, "currency": "USD" },
              "applications": string[],
              "safety_certifications": string[],
              "datasheet_summary": string
            }
        `;

        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const responseText = response.text().trim();

        const knowledgeResult = safeParseJSON(responseText);
        if (knowledgeResult) {
            res.json(knowledgeResult);
        } else {
            res.json({ component_name: componentName, description: responseText });
        }

    } catch (error) {
        console.error("Knowledge Engine Error:", error);
        res.status(500).json({ status: "Error", message: "Knowledge Engine Failure: " + error.message });
    }
});

// ========================================================================
// HEALTH CHECK
// ========================================================================
app.get('/api/health', (req, res) => {
    res.json({
        status: "operational",
        version: "5.0.0",
        engine: "GearGuard Ultra-Deep Forensic Audit Engine",
        endpoints: ["/api/audit", "/api/chat", "/api/compare", "/api/maintenance", "/api/knowledge"],
        rate_limit: {
            max_per_minute: rateLimiter.maxPerMinute,
            current_usage: rateLimiter.requests.filter(t => Date.now() - t < 60000).length
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🛡️  GearGuard AI Engine v5.0 running on port ${PORT}`);
    console.log(`   Endpoints: /api/audit | /api/chat | /api/compare | /api/maintenance | /api/knowledge`);
    console.log(`   Rate Limit: ${rateLimiter.maxPerMinute} requests/minute (Free Tier Safe)\n`);
});
