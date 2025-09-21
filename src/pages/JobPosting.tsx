import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  FileText,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getJobs, deleteJob, updateJob, type Job } from "@/lib/job-storage";
import { getApplicationsByJobId } from "@/lib/notification-system";
import JobCreationModal from "@/components/JobCreationModal";
import { useToast } from "@/hooks/use-toast";

const JobPosting = () => {

  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load jobs from our storage system
  useEffect(() => {
    const loadJobs = () => {
      try {
        const allJobs = getJobs();
        setJobs(allJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    
    loadJobs();
  }, [refreshKey]);

  // Handle job creation
  const handleJobAdded = (newJob: Job) => {
    setRefreshKey(prev => prev + 1); // Trigger jobs reload
  };

  // Handle job deletion
  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      try {
        deleteJob(jobId);
        setRefreshKey(prev => prev + 1);
        toast({
          title: "Job Deleted",
          description: "Job posting has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job posting.",
          variant: "destructive",
        });
      }
    }
  };

  // Get job statistics
  const getJobStats = () => {
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0);
    const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);
    const activeJobs = jobs.filter(job => job.status === 'Active').length;
    
    return {
      totalJobs: jobs.length,
      totalApplications,
      totalViews,
      activeJobs
    };
  };

  const stats = getJobStats();

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const postedJobs = jobs; // Use real jobs instead of mock data

  const mockJobsForDisplay = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Internship",
      level: "Entry Level",
      salary: "$80,000 - $100,000",
      description: "Looking for passionate students interested in full-stack development with modern technologies.",
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
      applicants: 23,
      views: 156,
      posted: "3 days ago",
      status: "active",
      requirements: "Bachelor's degree in Computer Science or related field, experience with web technologies"
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Remote",
      type: "Full-time",
      level: "Mid Level",
      salary: "$90,000 - $120,000",
      description: "Join our frontend team to build amazing user experiences using modern JavaScript frameworks.",
      skills: ["React", "TypeScript", "CSS", "Next.js"],
      applicants: 31,
      views: 245,
      posted: "1 week ago",
      status: "active",
      requirements: "2+ years experience with React, strong CSS skills, experience with TypeScript"
    },
    {
      id: 3,
      title: "Data Analyst Intern",
      company: "TechCorp",
      location: "New York, NY",
      type: "Internship",
      level: "Entry Level",
      salary: "$70,000 - $85,000",
      description: "Help our data team analyze user behavior and business metrics to drive product decisions.",
      skills: ["Python", "SQL", "Tableau", "Excel"],
      applicants: 18,
      views: 98,
      posted: "5 days ago",
      status: "paused",
      requirements: "Statistics or Data Science background, proficiency in Python and SQL"
    }
  ];



  const handleJobAction = (jobId: string, action: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (action === "delete") {
      handleDeleteJob(jobId);
    } else if (action === "view") {
      setSelectedJob(job);
      setIsViewDialogOpen(true);
    } else if (action === "edit") {
      setSelectedJob(job);
      initializeEditForm(job);
      setIsEditDialogOpen(true);
    }
  };

  const initializeEditForm = (job: Job) => {
    setEditFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      department: job.department,
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      benefits: job.benefits.join('\n'),
      salaryMin: job.salary?.min || '',
      salaryMax: job.salary?.max || '',
      salaryCurrency: job.salary?.currency || 'USD',
      applicationDeadline: job.applicationDeadline.split('T')[0], // Convert to date input format
      status: job.status
    });
  };

  const handleUpdateJob = () => {
    if (!selectedJob) return;
    
    try {
      const updatedJob: Job = {
        ...selectedJob,
        title: editFormData.title,
        company: editFormData.company,
        location: editFormData.location,
        type: editFormData.type,
        department: editFormData.department,
        description: editFormData.description,
        requirements: editFormData.requirements.split('\n').filter((req: string) => req.trim()),
        responsibilities: editFormData.responsibilities.split('\n').filter((resp: string) => resp.trim()),
        benefits: editFormData.benefits.split('\n').filter((benefit: string) => benefit.trim()),
        salary: editFormData.salaryMin && editFormData.salaryMax ? {
          min: parseInt(editFormData.salaryMin),
          max: parseInt(editFormData.salaryMax),
          currency: editFormData.salaryCurrency
        } : selectedJob.salary,
        applicationDeadline: editFormData.applicationDeadline,
        status: editFormData.status,
        updatedAt: new Date().toISOString()
      };
      
      updateJob(selectedJob.id, updatedJob);
      setRefreshKey(prev => prev + 1);
      setIsEditDialogOpen(false);
      toast({
        title: "Job Updated",
        description: "Job posting has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job posting.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/alumni-dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Posting</h1>
                <p className="text-sm text-gray-600">Create and manage job opportunities for students</p>
              </div>
            </div>
            <JobCreationModal
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Post
                </Button>
              }
              onJobAdded={handleJobAdded}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{postedJobs.length}</div>
              <p className="text-sm text-gray-600">Active Job Posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalApplications}
              </div>
              <p className="text-sm text-gray-600">Total Applicants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalViews}
              </div>
              <p className="text-sm text-gray-600">Total Views</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.activeJobs}
              </div>
              <p className="text-sm text-gray-600">Active Posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Job Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Posts</CardTitle>
            <CardDescription>
              Manage and track your posted job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {postedJobs.map((job) => (
                <Card key={job.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{job.type}</Badge>
                          <Badge variant="outline">{job.department}</Badge>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3 space-x-6">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>{job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{job.applicationsCount} applicants</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{job.viewsCount} views</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-6">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJobAction(job.id, "view")}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJobAction(job.id, "edit")}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleJobAction(job.id, "delete")}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Job Details
            </DialogTitle>
            <DialogDescription>
              Complete details for the job posting
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">{selectedJob.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{selectedJob.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{selectedJob.type} • {selectedJob.department}</span>
                    </div>
                    {selectedJob.salary && (
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>${selectedJob.salary.min.toLocaleString()} - ${selectedJob.salary.max.toLocaleString()} {selectedJob.salary.currency}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Posted: {formatDate(selectedJob.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div>
                      <Badge className={getStatusColor(selectedJob.status)}>
                        {selectedJob.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-gray-900">{selectedJob.applicationsCount}</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-gray-900">{selectedJob.viewsCount}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Job Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Responsibilities</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-700">{resp}</li>
                  ))}
                </ul>
              </div>
              
              {selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Posted By</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedJob.postedBy.role}</Badge>
                  <span className="text-gray-700">{selectedJob.postedBy.name}</span>
                  <span className="text-gray-500">({selectedJob.postedBy.email})</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedJob) {
                  setIsEditDialogOpen(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Edit Job Posting
            </DialogTitle>
            <DialogDescription>
              Update job details and requirements
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Job Title *</Label>
                  <Input 
                    id="edit-title"
                    value={editFormData.title || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Software Engineer Intern"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company *</Label>
                  <Input 
                    id="edit-company"
                    value={editFormData.company || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location *</Label>
                  <Input 
                    id="edit-location"
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA / Remote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input 
                    id="edit-department"
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Engineering, Marketing"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Job Type</Label>
                  <Select value={editFormData.type || ''} onValueChange={(value) => setEditFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editFormData.status || ''} onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Application Deadline</Label>
                  <Input 
                    id="edit-deadline"
                    type="date"
                    value={editFormData.applicationDeadline || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-salary-min">Min Salary</Label>
                  <Input 
                    id="edit-salary-min"
                    type="number"
                    value={editFormData.salaryMin || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary-max">Max Salary</Label>
                  <Input 
                    id="edit-salary-max"
                    type="number"
                    value={editFormData.salaryMax || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">Currency</Label>
                  <Select value={editFormData.salaryCurrency || 'USD'} onValueChange={(value) => setEditFormData(prev => ({ ...prev, salaryCurrency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Job Description *</Label>
                <Textarea 
                  id="edit-description"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-requirements">Requirements (one per line)</Label>
                <Textarea 
                  id="edit-requirements"
                  value={editFormData.requirements || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Bachelor's degree in Computer Science&#10;2+ years of experience with React&#10;Strong communication skills"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-responsibilities">Responsibilities (one per line)</Label>
                <Textarea 
                  id="edit-responsibilities"
                  value={editFormData.responsibilities || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
                  placeholder="Develop and maintain web applications&#10;Collaborate with cross-functional teams&#10;Write clean, maintainable code"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-benefits">Benefits (one per line)</Label>
                <Textarea 
                  id="edit-benefits"
                  value={editFormData.benefits || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, benefits: e.target.value }))}
                  placeholder="Health insurance&#10;Flexible working hours&#10;Professional development opportunities"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateJob}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!editFormData.title || !editFormData.company || !editFormData.location || !editFormData.description}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Job
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPosting;