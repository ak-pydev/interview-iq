// app/api/process-resume/route.ts

import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided or invalid file' },
        { status: 400 }
      );
    }
    
    let extractedText = '';
    
    // For now, just handle text-based files
    try {
      // Read file as text
      extractedText = await file.text();
      
      // If it's a CSV file, use PapaParse to make it more readable
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        const result = Papa.parse(extractedText);
        if (result.data && Array.isArray(result.data)) {
          // Convert CSV data to readable text
          extractedText = result.data
            .map(row => Array.isArray(row) ? row.join(', ') : String(row))
            .join('\n');
        }
      }
    } catch (textError) {
      console.error('Error reading file as text:', textError);
      return NextResponse.json(
        { error: 'Failed to read file contents' },
        { status: 500 }
      );
    }
    
    // Clean up the text
    extractedText = extractedText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .trim();               // Remove leading/trailing whitespace
    
    // Limit text length for performance
    const maxLength = 10000;
    if (extractedText.length > maxLength) {
      extractedText = extractedText.substring(0, maxLength) + "...";
    }
    
    return NextResponse.json({
      success: true,
      text: extractedText,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });
    
  } catch (error: any) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}