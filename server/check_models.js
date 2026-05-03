const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There isn't a direct listModels in the main SDK class usually, 
        // we might need to use the REST API directly or check documentation.
        // Actually, let's just try gemini-pro-1.5 or gemini-1.5-flash-latest.
        
        const models = ["models/gemini-1.5-flash", "models/gemini-1.5-pro", "models/gemini-pro"];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`Model ${m} is available`);
            } catch (e) {
                console.log(`Model ${m} failed: ${e.message}`);
            }
        }
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
listModels();
