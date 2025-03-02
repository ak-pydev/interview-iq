// File: app/api/gemini/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Check for Gemini API key
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment variables");
    return NextResponse.json(
      { error: "Gemini API key is missing" },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const requestData = await request.json();
    const { conversation, interviewContext, tone, timeLimit } = requestData;
    
    // Validate required fields
    if (!interviewContext || !conversation) {
      return NextResponse.json(
        { error: "Missing required fields: interviewContext or conversation" },
        { status: 400 }
      );
    }

    // Construct proper prompt with formatting for Gemini
    const promptContent = [
      {
        parts: [
          {
            text: `Interview Context: ${interviewContext}\n\n` +
                  `Conversation so far: ${JSON.stringify(conversation)}\n\n` +
                  `Instructions: Based on the context and conversation history, ask a relevant behavioral interview question in a ${tone || 'casual, friendly'} tone. ` +
                  `The candidate should be able to answer this question within ${timeLimit || 5} minutes.`
          }
        ]
      }
    ];

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: promptContent,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Extract the text from the Gemini response structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      // Extract text from each part and combine
      const textParts = data.candidates[0].content.parts
        .filter((part) => part.text)
        .map((part) => part.text);
      
      const generatedText = textParts.join(' ');
      
      // Record this in the database if needed
      // (This part could be added later)
      
      return NextResponse.json({ 
        success: true, 
        question: generatedText
      });
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }

  } catch (error) {
    console.error("Error generating interview question:", error);
    
    // Return error response
    return NextResponse.json(
      { error: error.message || "Failed to generate interview question" },
      { status: 500 }
    );
  }
}