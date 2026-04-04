import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const fullPrompt = context 
        ? `Context: ${context}\n\nTask: ${prompt}\n\nPlease act as a helpful clinical AI assistant for CareSync.`
        : `${prompt}\n\nPlease act as a helpful clinical AI assistant for CareSync.`;

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text }, { status: 200 });

  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Graceful handling for Quota Exceeded
    if (error.status === 429 || error.message?.includes('429')) {
       return NextResponse.json({ 
         text: "⚠️ System Alert: I am currently operating at maximum capacity (Free Tier Quota). Please wait a moment before asking another question or verify your Google Gemini API limits."
       }, { status: 200 }); // Return 200 so UI prints the message cleanly
    }

    return NextResponse.json({ message: 'Error generating AI response' }, { status: 500 });
  }
}
