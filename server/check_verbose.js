const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function check() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-flash-latest", "gemini-3-flash-preview"];
    for (const m of models) {
        console.log(`Checking ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("ping");
            console.log(`-> ${m} SUCCESS: ${result.response.text()}`);
        } catch (e) {
            console.log(`-> ${m} FAILED: ${e.message}`);
        }
    }
}
check();
