import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Trash2,
  Camera,
  Network,
  BarChart3,
  Settings,
  UserPlus,
  MessageSquare,
  TrendingUp,
  MapPin,
  DollarSign,
  LogOut
} from "lucide-react";
import { useProfilePicture } from "@/hooks/use-profile-picture";
import { useNavigate } from "react-router-dom";
import { clearUserSession } from "@/lib/storage";
import { NotificationPanel, NotificationBell } from '@/components/NotificationSystem';
import { ApplicationsManager } from '@/components/ApplicationsManager';
import { getApplicationsByPostedBy } from '@/lib/notification-system';

const AlumniDashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const { profilePicture, uploadProfilePicture } = useProfilePicture();
  const navigate = useNavigate();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  // Profile data from cookies/localStorage
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem('alumniProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: "Sarah Chen",
      email: "sarah.chen@techcorp.com",
      company: "TechCorp",
      position: "Senior Software Engineer",
      experience: "5 years",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/sarahchen"
    };
  });

  useEffect(() => {
    localStorage.setItem('alumniProfile', JSON.stringify(profileData));
  }, [profileData]);

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    navigate('/auth');
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3, route: null },
    { id: "job-posting", label: "Post Jobs", icon: Briefcase, route: "/alumni/job-posting" },
    { id: "referral-management", label: "Referrals", icon: Users, route: "/alumni/referral-management" },
    { id: "networking", label: "Networking", icon: Network, route: "/alumni/networking" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, route: null },
    { id: "profile", label: "Profile", icon: Settings, route: null }
  ];

  const stats = [
    { label: "Active Job Posts", value: "12", icon: Briefcase, color: "text-blue-600" },
    { label: "Pending Referrals", value: "8", icon: Clock, color: "text-yellow-600" },
    { label: "Successful Referrals", value: "24", icon: CheckCircle, color: "text-green-600" },
    { label: "Network Connections", value: "156", icon: Users, color: "text-purple-600" }
  ];

  const recentActivity = [
    { 
      id: 1, 
      type: "referral", 
      message: "New referral request from Alex Johnson for Software Engineer position", 
      time: "2 hours ago",
      status: "pending"
    },
    { 
      id: 2, 
      type: "job", 
      message: "Your Frontend Developer job post received 5 new applications", 
      time: "4 hours ago",
      status: "info"
    },
    { 
      id: 3, 
      type: "referral", 
      message: "Referral approved for Maria Garcia - Data Analyst position", 
      time: "1 day ago",
      status: "success"
    },
    { 
      id: 4, 
      type: "networking", 
      message: "3 new alumni joined your network", 
      time: "2 days ago",
      status: "info"
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profileData.name}!</h2>
              <p className="text-gray-600">Here's your alumni dashboard overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className={`p-1 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' : 
                        activity.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'referral' ? 
                          <Users className="h-4 w-4" /> : 
                          activity.type === 'job' ? 
                          <Briefcase className="h-4 w-4" /> : 
                          <Network className="h-4 w-4" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/alumni/job-posting")} 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job Opportunity
                  </Button>
                  <Button 
                    onClick={() => navigate("/alumni/referral-management")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Review Referral Requests
                  </Button>
                  <Button 
                    onClick={() => navigate("/alumni/networking")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Expand Network
                  </Button>
                  <Button 
                    onClick={() => setActiveView("analytics")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );
      
      case "job-posting":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Post Job Opportunities</h2>
              <p className="text-gray-600">Create job postings to help students find referral opportunities</p>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Job Post</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <Input placeholder="e.g., Software Engineer Intern" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <Input placeholder="Company Name" value={profileData.company} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input placeholder="e.g., San Francisco, CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <Input placeholder="e.g., $80,000 - $100,000" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea 
                  className="w-full p-3 border rounded-lg" 
                  rows={4} 
                  placeholder="Describe the role, responsibilities, and requirements..."
                ></textarea>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <Input placeholder="e.g., React, Python, AWS (comma-separated)" />
              </div>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </Card>
          </div>
        );

      case "referral-management":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Referral Management</h2>
              <p className="text-gray-600">Review and manage student referral requests</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">Alex Johnson</h3>
                          <p className="text-sm text-gray-600">alex.johnson@university.edu</p>
                        </div>
                      </div>
                      <div className="ml-13">
                        <p className="text-sm text-gray-600 mb-1">Applied for: <span className="font-medium">Software Engineer Intern</span></p>
                        <p className="text-sm text-gray-600 mb-2">Applied: Nov 15, 2024</p>
                        <p className="text-sm text-gray-700">"I am very interested in this position and would love to contribute to your team..."</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "networking":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alumni Networking</h2>
              <p className="text-gray-600">Connect with other alumni and expand your professional network</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Suggested Connections</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">John Doe</h4>
                          <p className="text-sm text-gray-600">Senior Developer at Google</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Connections</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Sarah Miller</h4>
                          <p className="text-sm text-gray-600">Product Manager at Microsoft</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">Track your referral performance and impact</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">89%</div>
                <p className="text-sm text-gray-600">Referral Success Rate</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">156</div>
                <p className="text-sm text-gray-600">Students Helped</p>
              </Card>
              <Card className="p-6 text-center">
                <Briefcase className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">42</div>
                <p className="text-sm text-gray-600">Job Posts Created</p>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Export Data</h3>
              <div className="flex space-x-4">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Referral Data
                </Button>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Analytics Report
                </Button>
              </div>
            </Card>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h2>
              <p className="text-gray-600">Manage your professional profile and preferences</p>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <Input 
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <Input 
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input 
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <Input 
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                  />
                </div>
              </div>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                Update Profile
              </Button>
            </Card>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{profileData.name}</h2>
              <p className="text-sm text-gray-600">{profileData.position}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.route) {
                      navigate(item.route);
                    } else {
                      setActiveView(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Alumni Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {profileData.company} • {profileData.location}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationBell 
                  userRole="alumni" 
                  onClick={() => setIsNotificationPanelOpen(true)} 
                />
                <Badge variant="outline" className="px-3 py-1">
                  <Network className="h-3 w-3 mr-1" />
                  156 Connections
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel
        userRole="alumni"
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </div>
  );
};

export default AlumniDashboard;