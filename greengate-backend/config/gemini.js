const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getGeminiClient = () => {
  return client;
};

module.exports = { getGeminiClient };