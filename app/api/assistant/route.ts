import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'MOCK_KEY',
});

export async function POST(req: Request) {
  try {
    const { transcript, currentPath } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      // Fallback for when no key is provided - keeping it "NLP-like" with basic matching
      return handleFallback(transcript);
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Nexus, a professional AI auditor. 
          Analyze the user's voice command and decide on an action.
          Return ONLY a JSON object in this format: 
          { 
            "action": "navigate" | "speak" | "scroll", 
            "target": string (path or element id), 
            "spoken_response": "natural language response as a helpful female assistant" 
          }
          Current page: ${currentPath}`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(response);
  } catch (error) {
    console.error('Groq Assistant Error:', error);
    return NextResponse.json({ 
      action: 'speak', 
      spoken_response: "I'm having trouble connecting to my neural network, but I'm still here to help." 
    });
  }
}

function handleFallback(text: string) {
  const cmd = text.toLowerCase();
  if (cmd.includes('home') || cmd.includes('start')) {
    return NextResponse.json({ action: 'navigate', target: '/', spoken_response: "Returning to the home page. Let's start over." });
  }
  if (cmd.includes('savings') || cmd.includes('money')) {
    return NextResponse.json({ action: 'speak', spoken_response: "Your audit highlights significant savings opportunities. Check the KPI cards at the top." });
  }
  return NextResponse.json({ action: 'speak', spoken_response: `I heard you say ${text}. Once my API key is configured, I'll be able to understand you much better.` });
}
