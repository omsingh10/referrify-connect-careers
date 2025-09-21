import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReferralModal } from "@/components/ReferralModal";
import { SearchBar } from "@/components/SearchBar";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileStorage } from "@/hooks/use-profile-storage";
import { useResumeExtractor } from "@/hooks/use-resume-extractor";
import { useAIInsights } from "@/hooks/use-ai-insights";
import { 
  Upload, 
  Search, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Brain,
  TrendingUp,
  FileText,
  Building,
  Calendar,
  Filter,
  Settings,
  Plus,
  X,
  Save,
  Loader2,
  AlertCircle,
  Edit3,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap
} from "lucide-react";

const StudentDashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { profile, saveProfile, updateSkills, addAchievement, removeAchievement, isLoading } = useProfileStorage();
  const { extractTextFromFile, validateResumeText, isExtracting } = useResumeExtractor();
  const { analysis, analyzeResume, isAnalyzing, error, getInsightColor, getScoreDescription } = useAIInsights();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [newSkill, setNewSkill] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Update temp profile when main profile loads
  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  // Auto-analyze resume when text changes
  useEffect(() => {
    if (profile.resumeText && profile.resumeText.length > 100) {
      analyzeResume(profile.resumeText, 'Software Engineer', profile.skills);
    }
  }, [profile.resumeText, profile.skills]);

  // Event handlers
  const handleSaveProfile = () => {
    const success = saveProfile(tempProfile);
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      setEditingProfile(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResumeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    
    try {
      const result = await extractTextFromFile(file);
      
      if (result.success) {
        saveProfile({
          resumeText: result.text,
          resumeFileName: result.fileName
        });
        
        toast({
          title: "Resume Uploaded",
          description: "Resume text extracted and saved successfully.",
        });
      } else {
        toast({
          title: "Extraction Error",
          description: result.error || "Failed to extract text. Please try manual input.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to process resume file.",
        variant: "destructive",
      });
    }
  };

  const handleManualResumeInput = (text: string) => {
    saveProfile({ resumeText: text });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      const updatedSkills = [...profile.skills, newSkill.trim()];
      updateSkills(updatedSkills);
      setNewSkill("");
      toast({
        title: "Skill Added",
        description: `${newSkill.trim()} has been added to your skills.`,
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter(skill => skill !== skillToRemove);
    updateSkills(updatedSkills);
    toast({
      title: "Skill Removed",
      description: `${skillToRemove} has been removed from your skills.`,
    });
  };

  // Mock data for jobs (keep existing functionality)
  const jobs = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "TechCorp",
      location: "San Francisco, CA",
      skills: ["React", "JavaScript", "Node.js"],
      matchScore: 92,
      postedBy: "Sarah Chen",
      postedDate: "2 days ago",
      applicants: 12
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataFlow Inc",
      location: "New York, NY",
      skills: ["Python", "Machine Learning", "SQL"],
      matchScore: 87,
      postedBy: "Michael Brown",
      postedDate: "1 week ago",
      applicants: 8
    }
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleReferralRequest = (job: any) => {
    setSelectedJob(job);
    setIsReferralModalOpen(true);
  };

  // Helper functions for UI
  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'strength': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'improvement': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'suggestion': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'warning': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile.name || 'Student'}!</h1>
              <p className="text-gray-600">{profile.university || 'University'} • {profile.major || 'Major'}</p>
            </div>
          </div>
          <Button 
            onClick={() => setEditingProfile(!editingProfile)}
            variant={editingProfile ? "outline" : "default"}
          >
            {editingProfile ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* AI Job Match Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    AI Job Match Score
                  </CardTitle>
                  <CardDescription>Your overall compatibility with available positions</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {analysis?.matchScore || 0}%
                    </div>
                  </div>
                  <p className="font-semibold text-lg">
                    {analysis ? getScoreDescription(analysis.matchScore) : 'Upload resume for analysis'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {profile.resumeText ? 'Based on your resume analysis' : 'Upload your resume for analysis'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    Find Jobs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    My Applications
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Network
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Job Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
                <CardDescription>Based on your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                            <span className="text-sm font-medium">{job.matchScore}% match</span>
                          </div>
                          <Button onClick={() => handleReferralRequest(job)} size="sm">
                            Request Referral
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {editingProfile ? "Edit your profile information" : "Your current profile details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={tempProfile.name}
                        onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={tempProfile.email}
                        onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={tempProfile.university}
                        onChange={(e) => setTempProfile({...tempProfile, university: e.target.value})}
                        placeholder="Your university"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={tempProfile.major}
                        onChange={(e) => setTempProfile({...tempProfile, major: e.target.value})}
                        placeholder="Your major"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        value={tempProfile.graduationYear}
                        onChange={(e) => setTempProfile({...tempProfile, graduationYear: e.target.value})}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={tempProfile.phone}
                        onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={tempProfile.bio}
                        onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Profile
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Name</Label>
                        <p className="text-sm">{profile.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="text-sm">{profile.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">University</Label>
                        <p className="text-sm">{profile.university || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Major</Label>
                        <p className="text-sm">{profile.major || 'Not provided'}</p>
                      </div>
                    </div>
                    {profile.bio && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Bio</Label>
                        <p className="text-sm mt-1">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-4 w-4"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Resume
                  </CardTitle>
                  <CardDescription>Upload your resume file for automatic text extraction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleResumeFileUpload}
                      className="hidden"
                      id="resume-upload"
                      disabled={isExtracting}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      {isExtracting ? (
                        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm text-gray-600">
                        {isExtracting ? 'Extracting text...' : 'Click to upload resume'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports PDF, DOC, DOCX, TXT
                      </p>
                    </label>
                  </div>
                  {profile.resumeFileName && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Current file: {profile.resumeFileName}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Resume Input</CardTitle>
                  <CardDescription>Paste your resume text directly</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={profile.resumeText}
                    onChange={(e) => handleManualResumeInput(e.target.value)}
                    placeholder="Paste your resume text here..."
                    rows={10}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {profile.resumeText.length} characters
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  AI Resume Insights
                  {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your resume and recommendations for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!profile.resumeText ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please upload or input your resume text to get AI insights.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{analysis?.matchScore || 0}%</div>
                      <div>
                        <h3 className="font-semibold">Overall Match Score</h3>
                        <p className="text-sm text-gray-600">Based on current job market trends</p>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {error}. Using fallback analysis.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analysis?.insights.map((insight, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            {getInsightIcon(insight.category)}
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{insight.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                              <Badge 
                                variant={insight.category === 'strength' ? 'default' : 'secondary'}
                                className="mt-2 text-xs"
                              >
                                {insight.category}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      )) || []}
                    </div>

                    {analysis && analysis.insights.length === 0 && !isAnalyzing && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No insights available. Try updating your resume.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default StudentDashboard;