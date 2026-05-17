const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // In some SDK versions, listModels is not directly exposed or has a different path.
        // We can check the model availability by trying a simple generation with a fallback list.
        console.log("Checking model availability...");
        const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
        
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`✅ Model ${m} is AVAILABLE`);
            } catch (e) {
                console.log(`❌ Model ${m} is NOT available: ${e.message}`);
            }
        }
    } catch (e) {
        console.error("List failed:", e.message);
    }
}

listModels();
