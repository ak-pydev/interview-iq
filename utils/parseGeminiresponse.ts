// src/utils/parseGeminiResponse.ts

interface ParsedFeedback {
    feedback: string[];
    match: number;
  }
  
  /**
   * Parse the raw response from Gemini AI into a structured format
   * @param {string} rawResponse - The raw text response from Gemini AI
   * @returns {ParsedFeedback} An object containing feedback points and match score
   */
  export function parseGeminiResponse(rawResponse: string): ParsedFeedback {
    const normalized = rawResponse.replace(/\r\n/g, '\n').trim();
    const lines = normalized.split('\n');
    const bulletRegex = /^(\s*[-*•]\s+|\s*\d+[\.\)]\s+)?(.*)$/;
    const feedback: string[] = [];
    let matchScore = 65; // Default match score
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Extract match score if present
      const scoreMatch = trimmed.match(/match score:\s*(\d+)%/i);
      if (scoreMatch && scoreMatch[1]) {
        matchScore = parseInt(scoreMatch[1], 10);
      }
      
      // Skip section headers
      if (/^[A-Z\s]+:$/.test(trimmed)) return;
      
      // Extract bullet points
      const m = trimmed.match(bulletRegex);
      if (m) {
        const content = m[2].trim();
        if (content.length >= 5) feedback.push(content);
      }
    });
    
    // If no bullet points were detected, try to split by periods and line breaks
    if (feedback.length === 0) {
      return { 
        feedback: normalized.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 0), 
        match: matchScore 
      };
    }
    
    return { feedback, match: matchScore };
  }
  
  export default parseGeminiResponse;