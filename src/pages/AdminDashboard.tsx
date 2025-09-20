import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  Briefcase, 
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Calendar,
  Mail,
  Edit,
  Trash2
} from "lucide-react";

const AdminDashboard = () => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [jobSearchQuery, setJobSearchQuery] = useState("");

  const profileData = {
    name: "Admin User",
    email: "admin@referrify.com",
    role: "Platform Administrator"
  };

  const stats = {
    totalUsers: 1247,
    activeJobs: 89,
    successfulReferrals: 356,
    monthlyGrowth: 12.5
  };

  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      role: "student",
      status: "active",
      joinDate: "Nov 1, 2024",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah.chen@techcorp.com",
      role: "alumni",
      status: "active",
      joinDate: "Oct 15, 2024",
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@dataflow.com",
      role: "alumni",
      status: "pending",
      joinDate: "Nov 10, 2024",
      lastActive: "3 hours ago"
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@university.edu",
      role: "student",
      status: "inactive",
      joinDate: "Sep 20, 2024",
      lastActive: "1 week ago"
    }
  ];

  const jobs = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "TechCorp",
      postedBy: "Sarah Chen",
      applicants: 12,
      status: "active",
      posted: "2 days ago",
      approved: true
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataFlow Inc",
      postedBy: "Michael Brown",
      applicants: 8,
      status: "pending",
      posted: "1 day ago",
      approved: false
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "StartupXYZ",
      postedBy: "Jennifer Liu",
      applicants: 15,
      status: "active",
      posted: "5 days ago",
      approved: true
    }
  ];

  const topSkills = [
    { skill: "React", count: 245 },
    { skill: "Python", count: 198 },
    { skill: "JavaScript", count: 267 },
    { skill: "Node.js", count: 156 },
    { skill: "Machine Learning", count: 134 }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return "👨‍🎓";
      case "alumni":
        return "🎓";
      case "admin":
        return "⚙️";
      default:
        return "👤";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "inactive":
        return "bg-muted text-muted-foreground border-muted/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(jobSearchQuery.toLowerCase())
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
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Settings</Button>
              <Avatar>
                <AvatarFallback className="gradient-primary text-white">
                  <Shield className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-brand-blue" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{stats.activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-brand-purple" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Successful Referrals</p>
                  <p className="text-2xl font-bold">{stats.successfulReferrals}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                  <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="jobs">Job Approvals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage students, alumni, and platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, or role..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="text-2xl">{getRoleIcon(user.role)}</div>
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <h3 className="text-lg font-semibold mr-2">{user.name}</h3>
                                <Badge className={getStatusColor(user.status)}>
                                  {user.status}
                                </Badge>
                              </div>
                              <div className="flex items-center text-muted-foreground mb-2">
                                <Mail className="h-4 w-4 mr-1" />
                                <span className="mr-4">{user.email}</span>
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="mr-4">Joined: {user.joinDate}</span>
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Last active: {user.lastActive}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(user.status)}
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
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

          {/* Job Approvals Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Job Post Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve job postings from alumni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs by title or company..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold mr-2">{job.title}</h3>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                              {job.approved && (
                                <Badge variant="outline" className="ml-2 bg-success/10 text-success border-success/20">
                                  Approved
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Building className="h-4 w-4 mr-1" />
                              <span className="mr-4">{job.company}</span>
                              <span>Posted by: {job.postedBy}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="mr-4">Posted: {job.posted}</span>
                              <Users className="h-4 w-4 mr-1" />
                              <span>{job.applicants} applicants</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {job.status === "pending" && (
                              <>
                                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Top Skills in Demand</CardTitle>
                  <CardDescription>Most requested skills across job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSkills.map((item, index) => (
                      <div key={item.skill} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full gradient-primary text-white text-xs flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.skill}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-primary"
                              style={{ width: `${(item.count / 300) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">User Engagement</span>
                        <span className="text-sm text-muted-foreground">87%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Referral Success Rate</span>
                        <span className="text-sm text-muted-foreground">72%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Job Approval Rate</span>
                        <span className="text-sm text-muted-foreground">94%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-brand-purple" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input value="Referrify" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Admin Email</label>
                  <Input value={profileData.email} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Maximum File Upload Size (MB)</label>
                  <Input value="10" className="mt-1" />
                </div>
                <Button className="w-full gradient-primary text-white">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;