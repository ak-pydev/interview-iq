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
    
    // Try different potential model names for Gemini 2.0 and recent versions
    const modelCandidates = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'gemini-2.0-pro',
      'gemini-2.0-pro-experimental',
      'models/gemini-pro',
      'models/gemini-1.0-pro',
      'models/gemini-1.5-pro',
      'models/gemini-2.0-pro',
      'models/gemini-2.0-pro-experimental'
    ];

    let successfulModel = null;
    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Generate a simple test content
        const prompt = "Hello, are you available? Respond very briefly.";
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`✅ Gemini API is online and working with model: ${modelName}!`);
        console.log('Response:', text);
        successfulModel = modelName;
        break;
      } catch (modelError) {
        console.log(`Attempt with model ${modelName} failed:`, modelError.message);
      }
    }

    if (!successfulModel) {
      console.error('❌ Could not connect to Gemini API with any of the model candidates');
      return false;
    }

    return true;

  } catch (error) {
    console.error('❌ Error connecting to Gemini API:', error);
    
    // Attempt to provide more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });
    }
    
    return false;
  }
}

// Fetch and display available models
async function getModelInfo() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY not found in environment variables');
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('Available Gemini Models:');
      if (data.models) {
        // Filter and log models containing 'gemini'
        const geminiModels = data.models.filter(model => 
          model.name.toLowerCase().includes('gemini')
        );

        if (geminiModels.length > 0) {
          geminiModels.forEach(model => {
            console.log(`- ${model.name}`);
          });
        } else {
          console.log('No Gemini models found in the response.');
        }
      } else {
        console.log('No models found in the response.');
      }
    } else {
      console.error('Failed to fetch models:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching model information:', error);
  }
}

// Run the check when the script is executed directly
if (require.main === module) {
  checkGeminiAPI().then(result => {
    if (!result) {
      // If check fails, try to get model information
      getModelInfo();
    }
    process.exit(result ? 0 : 1);
  });
}

module.exports = {
  checkGeminiAPI,
  getModelInfo
};