const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function findStableModel() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        console.log("Supported Models:", models.map(m => m.name).join(", "));
        
        // Find the most recent flash model that isn't a preview if possible, otherwise just the newest one
        const latestFlash = models.filter(m => m.name.includes("flash")).pop();
        console.log("Recommended Flash Model:", latestFlash ? latestFlash.name : "None");
    } catch (e) {
        console.error("Failed to fetch models:", e.message);
    }
}
findStableModel();
