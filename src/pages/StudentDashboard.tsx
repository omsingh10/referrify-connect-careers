import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Filter
} from "lucide-react";

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const profileData = {
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    skills: ["React", "Python", "Machine Learning", "JavaScript"],
    resumeUploaded: true,
    matchScore: 85
  };

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
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "StartupXYZ",
      location: "Austin, TX",
      skills: ["React", "TypeScript", "CSS"],
      matchScore: 78,
      postedBy: "Emily Davis",
      postedDate: "3 days ago",
      applicants: 15
    }
  ];

  const referralStatus = [
    {
      id: 1,
      jobTitle: "Software Engineer Intern",
      company: "TechCorp",
      status: "pending",
      appliedDate: "Nov 15, 2024",
      alumni: "Sarah Chen"
    },
    {
      id: 2,
      jobTitle: "Data Science Intern",
      company: "DataFlow Inc",
      status: "accepted",
      appliedDate: "Nov 10, 2024",
      alumni: "Michael Brown"
    },
    {
      id: 3,
      jobTitle: "Product Manager Intern",
      company: "InnovateLab",
      status: "rejected",
      appliedDate: "Nov 5, 2024",
      alumni: "Jennifer Liu"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "accepted":
        return "bg-success/10 text-success border-success/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {profileData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Settings</Button>
              <Avatar>
                <AvatarFallback className="gradient-primary text-white">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="jobs">Find Jobs</TabsTrigger>
            <TabsTrigger value="referrals">My Referrals</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Job Opportunities
                </CardTitle>
                <CardDescription>
                  Find internships and entry-level positions with referral opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search by job title, company, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Building className="h-4 w-4 mr-1" />
                              <span className="mr-4">{job.company}</span>
                              <span>{job.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="mr-4">Posted {job.postedDate}</span>
                              <span>{job.applicants} applicants</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-2">
                              <Brain className="h-4 w-4 mr-1 text-brand-purple" />
                              <span className="text-sm font-medium">Match: {job.matchScore}%</span>
                            </div>
                            <Progress value={job.matchScore} className="w-20 mb-3" />
                            <Button size="sm" className="gradient-primary text-white">
                              Request Referral
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground pt-3 border-t">
                          <span>Referral contact: <strong>{job.postedBy}</strong></span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Referral Status
                </CardTitle>
                <CardDescription>
                  Track your referral requests and application progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralStatus.map((referral) => (
                    <Card key={referral.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{referral.jobTitle}</h3>
                            <p className="text-muted-foreground mb-2">{referral.company}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="mr-4">Applied: {referral.appliedDate}</span>
                              <span>Contact: {referral.alumni}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {getStatusIcon(referral.status)}
                            <Badge className={`ml-2 ${getStatusColor(referral.status)}`}>
                              {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal details and skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input value={profileData.name} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={profileData.email} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Update Profile</Button>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Resume
                  </CardTitle>
                  <CardDescription>Upload and manage your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileData.resumeUploaded ? (
                    <div className="text-center py-8">
                      <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Resume uploaded successfully</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Update Resume
                        </Button>
                        <Button variant="ghost" className="w-full">
                          View Resume
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">No resume uploaded</p>
                      <Button className="gradient-primary text-white">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resume
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-brand-purple" />
                    AI Job Match Score
                  </CardTitle>
                  <CardDescription>Your overall compatibility with available positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="gradient-primary rounded-full w-32 h-32 flex items-center justify-center animate-pulse-glow">
                        <span className="text-3xl font-bold text-white">{profileData.matchScore}%</span>
                      </div>
                    </div>
                    <p className="text-lg font-semibold mb-2">Excellent Match</p>
                    <p className="text-sm text-muted-foreground">
                      Your skills align well with current job openings
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Resume Insights</CardTitle>
                  <CardDescription>AI-powered recommendations for your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Strong technical skills</p>
                        <p className="text-xs text-muted-foreground">Your React and Python skills are in high demand</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Add project descriptions</p>
                        <p className="text-xs text-muted-foreground">Include more details about your projects</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Consider cloud technologies</p>
                        <p className="text-xs text-muted-foreground">AWS or Azure skills would boost your profile</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;