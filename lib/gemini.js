import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Please define the GEMINI_API_KEY environment variable.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy_key');

// Try to use a known model
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
