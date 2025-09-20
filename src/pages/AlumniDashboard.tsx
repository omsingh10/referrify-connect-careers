import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Briefcase, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building,
  Calendar,
  Mail,
  FileText,
  Edit,
  Trash2
} from "lucide-react";

const AlumniDashboard = () => {
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const profileData = {
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    company: "TechCorp",
    position: "Senior Software Engineer",
    experience: "5 years"
  };

  const myJobs = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "TechCorp",
      description: "Looking for passionate students interested in full-stack development",
      skills: ["React", "Node.js", "PostgreSQL"],
      applicants: 12,
      posted: "2 days ago",
      status: "active"
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      company: "TechCorp",
      description: "Focus on React and modern JavaScript frameworks",
      skills: ["React", "TypeScript", "CSS"],
      applicants: 8,
      posted: "1 week ago",
      status: "active"
    }
  ];

  const referralRequests = [
    {
      id: 1,
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@university.edu",
      jobTitle: "Software Engineer Intern",
      appliedDate: "Nov 15, 2024",
      status: "pending",
      resumeUrl: "#",
      coverLetter: "I am very interested in this position and would love to contribute to your team..."
    },
    {
      id: 2,
      studentName: "Maria Garcia",
      studentEmail: "maria.garcia@university.edu",
      jobTitle: "Frontend Developer Intern",
      appliedDate: "Nov 14, 2024",
      status: "pending",
      resumeUrl: "#",
      coverLetter: "As a computer science student with experience in React..."
    },
    {
      id: 3,
      studentName: "James Wilson",
      studentEmail: "james.wilson@university.edu",
      jobTitle: "Software Engineer Intern",
      appliedDate: "Nov 10, 2024",
      status: "accepted",
      resumeUrl: "#",
      coverLetter: "I have been following TechCorp's work and I'm excited about..."
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

  const handleCreateJob = () => {
    setIsCreateJobOpen(false);
    // Handle job creation logic
  };

  const handleReferralAction = (requestId: number, action: "accept" | "reject") => {
    // Handle referral approval/rejection logic
    console.log(`${action} referral request ${requestId}`);
  };

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
                <h1 className="text-xl font-bold">Alumni Dashboard</h1>
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
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="requests">Referral Requests</TabsTrigger>
            <TabsTrigger value="jobs">My Job Posts</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Referral Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Pending Referral Requests
                </CardTitle>
                <CardDescription>
                  Review and manage student referral applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralRequests.map((request) => (
                    <Card key={request.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold mr-2">{request.studentName}</h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Mail className="h-4 w-4 mr-1" />
                              <span className="mr-4">{request.studentEmail}</span>
                              <Briefcase className="h-4 w-4 mr-1" />
                              <span>{request.jobTitle}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Applied: {request.appliedDate}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {request.coverLetter}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {getStatusIcon(request.status)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Resume
                          </Button>
                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleReferralAction(request.id, "reject")}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleReferralAction(request.id, "accept")}
                                className="bg-success text-success-foreground hover:bg-success/90"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      My Job Posts
                    </CardTitle>
                    <CardDescription>
                      Manage your posted job opportunities
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
                    <DialogTrigger asChild>
                      <Button className="gradient-primary text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Create New Job Post</DialogTitle>
                        <DialogDescription>
                          Add a new job opportunity for students to apply for referrals
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="job-title">Job Title</Label>
                          <Input id="job-title" placeholder="e.g. Software Engineer Intern" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" value={profileData.company} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" placeholder="Describe the role and requirements..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                          <Input id="skills" placeholder="React, JavaScript, Node.js" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateJobOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateJob} className="gradient-primary text-white">
                          Create Job Post
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <Card key={job.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold mr-2">{job.title}</h3>
                              <Badge variant="secondary">{job.status}</Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Building className="h-4 w-4 mr-1" />
                              <span>{job.company}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="mr-4">Posted {job.posted}</span>
                              <Users className="h-4 w-4 mr-1" />
                              <span>{job.applicants} applicants</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Professional Profile</CardTitle>
                <CardDescription>Manage your professional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profileData.name} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileData.email} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={profileData.company} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" value={profileData.position} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" value={profileData.experience} className="mt-1" />
                </div>
                <Button className="w-full gradient-primary text-white">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                    {myJobs.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Job Posts</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                    {referralRequests.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                    {referralRequests.filter(r => r.status === "accepted").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Approved Referrals</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlumniDashboard;