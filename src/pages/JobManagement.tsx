import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Download
} from 'lucide-react';

const JobManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Internship',
      salary: '$50-60/hour',
      status: 'active',
      postedBy: 'Michael Zhang',
      postedDate: '2024-09-15',
      applications: 45,
      referrals: 12,
      description: 'Join our team to work on cutting-edge technology...',
      skills: ['JavaScript', 'React', 'Python', 'Machine Learning']
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Meta',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      salary: '$120-150k',
      status: 'pending',
      postedBy: 'Sarah Kim',
      postedDate: '2024-09-18',
      applications: 28,
      referrals: 8,
      description: 'Lead product development for our core platform...',
      skills: ['Product Management', 'Analytics', 'Leadership', 'Strategy']
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      type: 'Full-time',
      salary: '$110-140k',
      status: 'active',
      postedBy: 'David Chen',
      postedDate: '2024-09-10',
      applications: 67,
      referrals: 15,
      description: 'Analyze user behavior and improve recommendations...',
      skills: ['Python', 'Machine Learning', 'SQL', 'Statistics']
    },
    {
      id: 4,
      title: 'Frontend Developer Intern',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      type: 'Internship',
      salary: '$45-55/hour',
      status: 'draft',
      postedBy: 'Lisa Wang',
      postedDate: '2024-09-20',
      applications: 0,
      referrals: 0,
      description: 'Build beautiful user interfaces for millions of users...',
      skills: ['React', 'TypeScript', 'CSS', 'Design Systems']
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$130-170k',
      status: 'expired',
      postedBy: 'John Doe',
      postedDate: '2024-08-01',
      applications: 89,
      referrals: 23,
      description: 'Manage cloud infrastructure and deployment pipelines...',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesType = filterType === 'all' || job.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'draft':
        return <Edit size={16} className="text-gray-500" />;
      case 'expired':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const handleJobAction = (action: string, jobId: number, jobTitle: string) => {
    switch (action) {
      case 'approve':
        alert(`✅ Job approved: ${jobTitle}`);
        break;
      case 'reject':
        alert(`❌ Job rejected: ${jobTitle}`);
        break;
      case 'edit':
        alert(`✏️ Editing job: ${jobTitle}`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete job: ${jobTitle}?`)) {
          alert(`🗑️ Job deleted: ${jobTitle}`);
        }
        break;
      case 'view':
        alert(`👁️ Viewing job details: ${jobTitle}`);
        break;
      default:
        break;
    }
  };

  const handleAddNewJob = () => {
    alert('➕ Add New Job functionality would open a job creation form');
  };

  const handleExportJobs = () => {
    const jobData = [
      ['Title', 'Company', 'Location', 'Type', 'Salary', 'Status', 'Posted By', 'Posted Date', 'Applications', 'Referrals'],
      ...filteredJobs.map(job => [
        job.title,
        job.company,
        job.location,
        job.type,
        job.salary,
        job.status,
        job.postedBy,
        job.postedDate,
        job.applications.toString(),
        job.referrals.toString()
      ])
    ];

    const csvContent = jobData.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'jobs-export.csv');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    pendingJobs: jobs.filter(j => j.status === 'pending').length,
    totalApplications: jobs.reduce((sum, job) => sum + job.applications, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Management</h1>
              <p className="text-gray-600">Manage job postings and referral opportunities</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportJobs}>
                <Download size={16} className="mr-2" />
                Export Jobs
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleAddNewJob}>
                <Plus size={16} className="mr-2" />
                Add New Job
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingJobs}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {getStatusIcon(job.status)}
                      <Badge variant="outline" className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge variant="secondary">
                        {job.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3 space-x-4">
                      <div className="flex items-center">
                        <Building size={16} className="mr-1" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{job.applications} applications</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{job.referrals} referrals</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>Posted by {job.postedBy} on {new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJobAction('view', job.id, job.title)}
                    >
                      <Eye size={14} className="mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJobAction('edit', job.id, job.title)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    {job.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleJobAction('approve', job.id, job.title)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJobAction('reject', job.id, job.title)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleJobAction('delete', job.id, job.title)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobManagement;