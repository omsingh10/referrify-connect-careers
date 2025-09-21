import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useProfileStorage, type UserProfile } from '@/hooks/use-profile-storage';
import { useProfilePicture } from '@/hooks/use-profile-picture';
import { useNavigate } from 'react-router-dom';
import { clearUserSession } from '@/lib/storage';
import { getActiveJobs, type Job } from '@/lib/job-storage';
import { NotificationPanel, NotificationBell } from '@/components/NotificationSystem';
import { getApplications } from '@/lib/notification-system';
import { 
  Home,
  Users,
  FileText,
  BookOpen,
  User,
  ArrowRight,
  Camera,
  Upload,
  LogOut
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useProfileStorage();
  const { profilePicture, uploadProfilePicture, getInitials } = useProfilePicture();
  const [activeSection, setActiveSection] = useState('Home');
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [myApplications, setMyApplications] = useState<any[]>([]);

  // Load recent jobs and applications
  useEffect(() => {
    const loadData = () => {
      try {
        const activeJobs = getActiveJobs();
        setRecentJobs(activeJobs.slice(0, 3)); // Show first 3 jobs
        
        const allApplications = getApplications();
        const studentEmail = profile.email || "john.student@example.com";
        const myApps = allApplications.filter(app => app.studentEmail === studentEmail);
        setMyApplications(myApps);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [profile.email]);

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadProfilePicture(file);
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        alert('Failed to upload profile picture: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    clearUserSession();
    navigate('/auth');
  };

  const sidebarItems = [
    { id: 'Home', label: 'Home', icon: Home, active: true },
    { id: 'Referrals', label: 'Referrals', icon: Users, active: false },
    { id: 'Resume Analyzer', label: 'Resume Analyzer', icon: FileText, active: false },
    { id: 'Resources', label: 'Resources', icon: BookOpen, active: false },
    { id: 'Profile', label: 'Profile', icon: User, active: false },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Navigate to appropriate routes
    switch (sectionId) {
      case 'Referrals':
        navigate('/student/opportunities');
        break;
      case 'Resume Analyzer':
        navigate('/student/resume-analyzer');
        break;
      case 'Resources':
        navigate('/student/resources');
        break;
      case 'Profile':
        navigate('/student/settings');
        break;
      case 'Home':
        navigate('/student/dashboard');
        break;
      default:
        break;
    }
  };

  const handleViewOpenings = () => {
    navigate('/student/opportunities');
  };

  const handleAnalyzeResume = () => {
    // Navigate to dedicated resume analyzer page
    navigate('/student/resume-analyzer');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <Avatar className="h-12 w-12">
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white">
                    {profile?.name 
                      ? getInitials(profile.name)
                      : 'SC'}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                onClick={triggerFileUpload}
                className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                title="Change profile picture"
              >
                <Camera size={12} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {profile?.name || 'Sarah Chen'}
              </h3>
              <p className="text-sm text-gray-500">
                {profile?.major || 'Junior, Computer Science'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {profile?.name || 'Sarah Chen'}
              </h1>
              <NotificationBell 
                userRole="student" 
                onClick={() => setIsNotificationPanelOpen(true)} 
              />
            </div>
          </div>

          {/* Job Opportunities Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {getActiveJobs().length} available
              </Badge>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Browse Opportunities
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Explore job and internship openings from our alumni network.
                    </p>
                    <Button 
                      onClick={handleViewOpenings}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      View All Opportunities
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                  <div className="ml-8 hidden md:block">
                    <div className="w-64 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Users size={40} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-sm text-gray-600">Alumni Network</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Jobs Preview */}
                {recentJobs.length > 0 && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Opportunities</h4>
                    <div className="space-y-3">
                      {recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.company} • {job.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                job.type === 'Internship' 
                                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                                  : job.type === 'Full-time'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-green-100 text-green-800 border-green-200'
                              }`}
                            >
                              {job.type}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate('/student/opportunities')}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentJobs.length === 0 && (
                  <div className="border-t pt-6 text-center">
                    <div className="text-gray-400 mb-2">
                      <Users size={24} className="mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600">No job opportunities available yet</p>
                    <p className="text-xs text-gray-500">Check back later for new postings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Resume Analyzer Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Resume Analyzer</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Analyze Your Resume
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload your resume and a job description to get personalized feedback.
                    </p>
                    <Button 
                      onClick={handleAnalyzeResume}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Analyze Resume
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                  <div className="ml-8 hidden md:block">
                    <div className="w-64 h-32 bg-gradient-to-br from-teal-100 to-green-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FileText size={40} className="mx-auto text-teal-600 mb-2" />
                        <p className="text-sm text-gray-600">Resume Analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel
        userRole="student"
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </div>
  );
};

export default StudentDashboard;