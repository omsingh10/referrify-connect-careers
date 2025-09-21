import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useResumeExtractor } from '../hooks/use-resume-extractor';
import { useAIInsights } from '@/hooks/use-ai-insights';
import { useNavigate } from 'react-router-dom';
import { 
  Upload,
  FileText,
  Brain,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { extractTextFromFile, isExtracting } = useResumeExtractor();
  const { analyzeResume, analysis, isAnalyzing: aiLoading, error: aiError } = useAIInsights();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const extraction = await extractTextFromFile(file);
        if (extraction.success) {
          setResumeText(extraction.text);
        } else {
          // Show the helpful error message with proper formatting
          const errorMessage = extraction.error || 'Failed to extract text from file';
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Failed to extract text from file:', error);
        alert('An unexpected error occurred while processing the file.');
      }
    }
    // Reset the file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert('Please upload a resume or enter resume text first.');
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeResume(resumeText, jobDescription);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'improvement':
        return <TrendingUp className="text-blue-500" size={20} />;
      case 'suggestion':
        return <Lightbulb className="text-yellow-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Target className="text-gray-500" size={20} />;
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'border-green-200 bg-green-50';
      case 'improvement':
        return 'border-blue-200 bg-blue-50';
      case 'suggestion':
        return 'border-yellow-200 bg-yellow-50';
      case 'warning':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Resume Analyzer</h1>
          <p className="text-gray-600">Get personalized feedback on your resume with AI-powered analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Input */}
          <div className="space-y-6">
            {/* Resume Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Upload Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <Button onClick={triggerFileUpload} variant="outline">
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {isExtracting && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm text-gray-600">Extracting text from resume...</span>
                  </div>
                )}

                {/* Extraction errors are now handled in handleFileUpload */}
              </CardContent>
            </Card>

            {/* Resume Text */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="resumeText">
                  Paste your resume text here or upload a file above
                </Label>
                <Textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="min-h-[300px] mt-2"
                />
              </CardContent>
            </Card>

            {/* Job Description (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="jobDescription">
                  Add a job description for tailored analysis
                </Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for more targeted feedback..."
                  className="min-h-[150px] mt-2"
                />
              </CardContent>
            </Card>

            {/* Analyze Button */}
            <Button 
              onClick={handleAnalyze}
              disabled={!resumeText.trim() || isAnalyzing || aiLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              size="lg"
            >
              {isAnalyzing || aiLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Brain className="mr-2" size={20} />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap size={20} />
                  <span>Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysis || !analysis.insights || analysis.insights.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Brain size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Upload your resume and click "Analyze Resume" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Match Score Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {analysis.matchScore}%
                        </div>
                        <div className="text-sm text-gray-600 mb-3">Match Score</div>
                        <Progress value={analysis.matchScore} className="h-3 mb-2" />
                        <div className="text-xs text-gray-500">
                          {analysis.matchScore >= 80 ? '🎉 Excellent match!' : 
                           analysis.matchScore >= 60 ? '👍 Good potential' : 
                           '📈 Room for improvement'}
                        </div>
                      </div>
                    </div>

                    {/* Experience Level & Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">Experience Level</h4>
                        <Badge variant="outline" className="capitalize">
                          {analysis.experienceLevel}
                        </Badge>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">Skills Found</h4>
                        <div className="text-sm text-gray-600">
                          {analysis.skillsFound.length} technical skills detected
                        </div>
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="space-y-4">
                    {analysis.insights.map((insight, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${getInsightColor(insight.category)}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getInsightIcon(insight.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {insight.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {insight.category}
                              </Badge>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {insight.description}
                            </p>
                            {insight.score !== undefined && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Score</span>
                                  <span>{insight.score}/10</span>
                                </div>
                                <Progress value={insight.score * 10} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )}

                {aiError && (
                  <Alert className="mt-4 border-orange-200 bg-orange-50">
                    <AlertCircle size={16} className="text-orange-600" />
                    <AlertDescription className="space-y-2">
                      <div className="font-medium text-orange-900">API Request Failed</div>
                      <div className="text-sm text-orange-800">{aiError}</div>
                      <div className="text-xs text-orange-700">
                        Don't worry! We've provided fallback analysis above. Check browser console for technical details.
                      </div>
                      <div className="text-xs text-orange-600 mt-2">
                        💡 Tip: The API might be temporarily unavailable. The fallback analysis still provides valuable insights!
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;