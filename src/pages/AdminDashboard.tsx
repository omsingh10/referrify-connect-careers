import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useProfilePicture } from '@/hooks/use-profile-picture';
import { useNavigate } from 'react-router-dom';
import { clearUserSession } from '@/lib/storage';
import { getJobs, getActiveJobs, type Job } from '@/lib/job-storage';
import JobCreationModal from '@/components/JobCreationModal';
import { NotificationPanel, NotificationBell } from '@/components/NotificationSystem';
import { getApplications, getNotificationsByRole } from '@/lib/notification-system';
import { 
  Home,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  Shield,
  Camera,
  TrendingUp,
  UserCheck,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  Bell,
  FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profilePicture, uploadProfilePicture, getInitials } = useProfilePicture();
  const [activeSection, setActiveSection] = useState('Home');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const adminProfile = {
    name: 'Admin User',
    email: 'admin@referrify.com',
    role: 'Platform Administrator'
  };

  // Load jobs on component mount and when refreshKey changes
  useEffect(() => {
    const loadJobs = () => {
      const allJobs = getJobs();
      setJobs(allJobs);
    };
    loadJobs();
  }, [refreshKey]);

  // Load applications and notifications
  useEffect(() => {
    const loadData = () => {
      const allApplications = getApplications();
      const adminNotifications = getNotificationsByRole('admin');
      setApplications(allApplications);
      setNotifications(adminNotifications);
    };
    
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle job creation
  const handleJobAdded = (newJob: Job) => {
    setRefreshKey(prev => prev + 1); // Trigger jobs reload
  };

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
    { id: 'Home', label: 'Dashboard', icon: Home, active: true },
    { id: 'Users', label: 'User Management', icon: Users, active: false },
    { id: 'Jobs', label: 'Job Listings', icon: Briefcase, active: false },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, active: false },
    { id: 'Settings', label: 'Admin Settings', icon: Settings, active: false },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Navigate to appropriate routes
    switch (sectionId) {
      case 'Users':
        navigate('/admin/users');
        break;
      case 'Jobs':
        navigate('/admin/jobs');
        break;
      case 'Analytics':
        navigate('/admin/analytics');
        break;
      case 'Settings':
        navigate('/admin/settings');
        break;
      case 'Home':
        navigate('/admin/dashboard');
        break;
      default:
        break;
    }
  };

  // Dashboard stats with real job data
  const stats = {
    totalUsers: 1247,
    activeJobs: getActiveJobs().length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    successfulReferrals: 356,
    monthlyGrowth: 12.5
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New student registration: Sarah Kim',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'job_posting',
      message: 'New job posted: Software Engineer at Meta',
      time: '1 hour ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'referral_success',
      message: 'Successful referral: Alex Chen → Google',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'user_verification',
      message: 'Alumni verification pending: Michael Zhang',
      time: '4 hours ago',
      status: 'warning'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'job',
      title: 'Data Scientist at Netflix',
      submitter: 'David Chen (Alumni)',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'alumni',
      title: 'Alumni Verification Request',
      submitter: 'Lisa Wang',
      time: '5 hours ago'
    }
  ];

  const handleUserManagement = () => {
    navigate('/admin/users');
  };

  const handleJobManagement = () => {
    navigate('/admin/jobs');
  };

  const handleAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleApproval = (type: string, itemId: number, action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? '✅ Approved' : '❌ Rejected';
    alert(`${actionText}: ${type} item #${itemId}`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="text-green-500" size={16} />;
      case 'job_posting':
        return <Briefcase className="text-blue-500" size={16} />;
      case 'referral_success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'user_verification':
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
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
                  <AvatarFallback className="bg-purple-500 text-white">
                    {getInitials(adminProfile.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                onClick={triggerFileUpload}
                className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-1 hover:bg-purple-600 transition-colors"
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
                {adminProfile.name}
              </h3>
              <p className="text-sm text-gray-500">
                {adminProfile.role}
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
                      ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="text-purple-500" size={24} />
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <NotificationBell 
                userRole="admin" 
                onClick={() => setIsNotificationPanelOpen(true)} 
              />
            </div>
            <p className="text-gray-600">Manage users, jobs, and platform analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Job Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Users size={24} className="text-blue-500" />
                    <h3 className="text-lg font-semibold">User Management</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage student and alumni accounts, verify identities, and handle user permissions.
                </p>
                <Button 
                  onClick={handleUserManagement}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Manage Users
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Job Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Briefcase size={24} className="text-green-500" />
                    <h3 className="text-lg font-semibold">Job Management</h3>
                  </div>
                  <Badge variant="secondary">{stats.activeJobs}</Badge>
                </div>
                <p className="text-gray-600 mb-4">
                  Review job postings, approve new listings, and manage referral opportunities.
                </p>
                <div className="space-y-2">
                  <JobCreationModal onJobAdded={handleJobAdded} />
                  <Button 
                    onClick={handleJobManagement}
                    variant="outline"
                    className="w-full"
                  >
                    Manage All Jobs
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={24} className="text-purple-500" />
                    <h3 className="text-lg font-semibold">Analytics</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  View platform statistics, user engagement metrics, and referral success rates.
                </p>
                <Button 
                  onClick={handleAnalytics}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  View Analytics
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Jobs</span>
                  <Badge variant="secondary">{jobs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Briefcase className="text-blue-500" size={16} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company} • {job.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={job.status === 'Active' ? 'default' : 'secondary'}
                          className={job.status === 'Active' ? 'bg-green-500' : ''}
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                      <p>No jobs posted yet</p>
                      <p className="text-sm">Create your first job posting!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Approvals</span>
                  <Badge variant="secondary">{pendingApprovals.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="text-yellow-500" size={16} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{approval.title}</p>
                          <p className="text-xs text-gray-500">by {approval.submitter} • {approval.time}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleApproval(approval.type, approval.id, 'approve')}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleApproval(approval.type, approval.id, 'reject')}
                        >
                          <AlertCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel
        userRole="admin"
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;