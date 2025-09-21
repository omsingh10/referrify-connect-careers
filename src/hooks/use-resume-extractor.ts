import { useState } from 'react';

export interface ResumeExtraction {
  text: string;
  fileName: string;
  success: boolean;
  error?: string;
}

export function useResumeExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);

  const extractTextFromFile = async (file: File): Promise<ResumeExtraction> => {
    setIsExtracting(true);
    try {
      let extractedText = '';
      if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else {
        throw new Error('Only text files are supported. Please copy and paste your resume content.');
      }
      if (!extractedText.trim()) {
        throw new Error('No readable text found in the file.');
      }
      return {
        text: extractedText.trim(),
        fileName: file.name,
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        text: '',
        fileName: file.name,
        success: false,
        error: errorMessage
      };
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextFromText = async (text: string): Promise<ResumeExtraction> => {
    setIsExtracting(true);
    try {
      if (!text.trim()) {
        throw new Error('No text content provided.');
      }
      return {
        text: text.trim(),
        fileName: 'manual-input.txt',
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        text: '',
        fileName: 'manual-input.txt',
        success: false,
        error: errorMessage
      };
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    extractTextFromFile,
    extractTextFromText,
    isExtracting
  };
}
