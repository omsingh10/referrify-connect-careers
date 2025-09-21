import { useState } from 'react';

const GEMINI_API_KEY = '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export interface AIInsight {
  category: 'strength' | 'improvement' | 'suggestion' | 'warning';
  title: string;
  description: string;
  score?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ResumeAnalysis {
  matchScore: number;
  insights: AIInsight[];
  skillsFound: string[];
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior';
  suggestions: {
    missingSkills: string[];
    improvementAreas: string[];
  };
}

export function useAIInsights() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async (resumeText: string, targetRole?: string, userSkills?: string[]) => {
    if (!resumeText.trim()) {
      setError('No resume text provided');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const prompt = `
You are an expert resume analyzer and career counselor. Analyze this resume and provide detailed insights.

Resume Text:
"""
${resumeText}
"""

User's Listed Skills: ${userSkills?.join(', ') || 'None provided'}
Target Role: ${targetRole || 'Software Engineer/Developer'}

Please provide a comprehensive analysis in the following JSON format (ensure it's valid JSON):

{
  "matchScore": 85,
  "experienceLevel": "junior",
  "skillsFound": ["React", "JavaScript", "Python"],
  "insights": [
    {
      "category": "strength",
      "title": "Strong Technical Foundation",
      "description": "Solid programming skills with modern technologies",
      "priority": "high"
    },
    {
      "category": "improvement", 
      "title": "Add Quantified Achievements",
      "description": "Include specific metrics and numbers to demonstrate impact",
      "priority": "high"
    },
    {
      "category": "suggestion",
      "title": "Consider Cloud Skills",
      "description": "AWS or Azure certifications would strengthen your profile",
      "priority": "medium"
    }
  ],
  "suggestions": {
    "missingSkills": ["AWS", "Docker", "CI/CD"],
    "improvementAreas": ["Project descriptions", "Quantified results", "Leadership experience"]
  }
}

Analysis Guidelines:
- matchScore: 0-100 based on relevance to target role
- experienceLevel: entry/junior/mid/senior based on content
- skillsFound: extract all technical skills mentioned
- insights: 3-5 actionable insights with different categories
- Focus on constructive feedback and specific improvement suggestions
- Consider industry standards and current market demands
`;

      console.log('🔍 API Debug Information:');
      console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
      console.log('Endpoint:', GEMINI_API_URL);
      console.log('Resume text length:', resumeText.length);

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        console.error('No AI response found in:', data);
        throw new Error('No response from AI service');
      }
      
      console.log('AI Response text:', aiResponse);
      
      // Try to extract JSON from the AI response
      let cleanResponse = aiResponse.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedAnalysis = JSON.parse(jsonMatch[0]);
          console.log('Parsed analysis:', parsedAnalysis);
          
          // Validate the response structure
          const validatedAnalysis: ResumeAnalysis = {
            matchScore: Math.min(100, Math.max(0, parsedAnalysis.matchScore || 0)),
            experienceLevel: ['entry', 'junior', 'mid', 'senior'].includes(parsedAnalysis.experienceLevel) 
              ? parsedAnalysis.experienceLevel 
              : 'junior',
            skillsFound: Array.isArray(parsedAnalysis.skillsFound) ? parsedAnalysis.skillsFound : [],
            insights: Array.isArray(parsedAnalysis.insights) 
              ? parsedAnalysis.insights.map((insight: any) => ({
                  category: ['strength', 'improvement', 'suggestion', 'warning'].includes(insight.category) 
                    ? insight.category 
                    : 'suggestion',
                  title: insight.title || 'Insight',
                  description: insight.description || '',
                  priority: ['high', 'medium', 'low'].includes(insight.priority) 
                    ? insight.priority 
                    : 'medium'
                }))
              : [],
            suggestions: {
              missingSkills: Array.isArray(parsedAnalysis.suggestions?.missingSkills) 
                ? parsedAnalysis.suggestions.missingSkills 
                : [],
              improvementAreas: Array.isArray(parsedAnalysis.suggestions?.improvementAreas) 
                ? parsedAnalysis.suggestions.improvementAreas 
                : []
            }
          };
          
          setAnalysis(validatedAnalysis);
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          console.log('Raw AI response for debugging:', aiResponse);
          throw new Error('Invalid response format from AI service - check console for details');
        }
      } else {
        console.log('No JSON found in response:', aiResponse);
        throw new Error('Could not extract valid JSON from AI response');
      }
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Provide fallback analysis
      const fallbackAnalysis: ResumeAnalysis = {
        matchScore: 75,
        experienceLevel: 'junior',
        skillsFound: userSkills || ['JavaScript', 'React', 'Python'],
        insights: [
          {
            category: 'strength',
            title: 'Technical Skills Present',
            description: 'Your resume shows relevant technical abilities for the role.',
            priority: 'medium'
          },
          {
            category: 'improvement',
            title: 'Add Specific Examples',
            description: 'Include concrete examples of projects and achievements with measurable results.',
            priority: 'high'
          },
          {
            category: 'suggestion',
            title: 'Modern Technologies',
            description: 'Consider learning trending technologies like cloud platforms and modern frameworks.',
            priority: 'medium'
          }
        ],
        suggestions: {
          missingSkills: ['Cloud Platforms', 'DevOps', 'Testing Frameworks'],
          improvementAreas: ['Quantified achievements', 'Project impact', 'Leadership experience']
        }
      };
      
      setAnalysis(fallbackAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'strength': return 'text-green-600 bg-green-50 border-green-200';
      case 'improvement': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'suggestion': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Excellent match for the role';
    if (score >= 80) return 'Strong candidate with good alignment';
    if (score >= 70) return 'Good potential with some improvements needed';
    if (score >= 60) return 'Moderate match, several areas for improvement';
    return 'Significant improvements needed to match role requirements';
  };

  return { 
    analysis, 
    analyzeResume, 
    isAnalyzing, 
    error,
    getInsightColor,
    getScoreDescription
  };
}