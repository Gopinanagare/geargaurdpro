const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const filtered = data.models.filter(m => m.name.includes("2.5") || m.displayName.includes("2.5")).map(m => m.name);
        console.log("Available 2.5 Model Names:", filtered);
    } catch (e) {
        console.error("Failed to fetch models:", e.message);
    }
}
listModels();
