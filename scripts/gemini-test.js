// File: check-gemini.js
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

async function checkGeminiAPI() {
  console.log('Checking Gemini API status...');

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY not found in environment variables');
    return false;
  }

  try {
    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Try higher and latest models first
    const modelCandidates = [
      'gemini-2.0-pro-exp-02-05',
      'gemini-2.0-pro',
      'gemini-1.5-pro',
        'gemini-2.0-flash',
    ];

    let successfulModel = null;
    for (const modelName of modelCandidates) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = "Hello, are you available? Respond briefly in a natural tone.";
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`✅ Gemini API is online and working with model: ${modelName}!`);
        console.log('Response:', text);
        successfulModel = modelName;
        break;
      } catch (modelError) {
        console.log(`Attempt with model ${modelName} failed:`, modelError.message);
      }
    }

    if (!successfulModel) {
      console.error('❌ Could not connect to Gemini API with any candidate model.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error connecting to Gemini API:', error);
    return false;
  }
}

if (require.main === module) {
  checkGeminiAPI().then(result => {
    process.exit(result ? 0 : 1);
  });
}

module.exports = {
  checkGeminiAPI,
};
