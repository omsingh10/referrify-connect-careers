import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { getActiveJobs, incrementJobViews, type Job } from '@/lib/job-storage';
import { 
  Briefcase,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Users,
  Clock,
  ExternalLink,
  Send,
  Eye
} from 'lucide-react';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { useToast } from '../hooks/use-toast';
import { submitJobApplication } from '../lib/notification-system';

const JobOpportunities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Full-time' | 'Part-time' | 'Internship' | 'Contract'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadJobs = () => {
      try {
        const activeJobs = getActiveJobs();
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term)
      );
    }

    // Filter by job type
    if (filterType !== 'All') {
      filtered = filtered.filter(job => job.type === filterType);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, filterType, jobs]);

  const handleViewDetails = (job: Job) => {
    incrementJobViews(job.id);
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleApplyToJob = (job: Job) => {
    // Submit job application with notification system
    const application = submitJobApplication(
      job.id,
      job.title,
      job.company,
      job.postedBy.name,
      {
        name: "John Student", // In real app, get from user profile
        email: "john.student@example.com", // In real app, get from user profile
        resumeUrl: undefined, // Optional: link to resume
        coverLetter: `I am very interested in the ${job.title} position at ${job.company}. I believe my skills and experience make me a great fit for this role.`
      }
    );
    
    console.log('Application submitted:', application);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const formatSalary = (salary?: Job['salary']) => {
    if (!salary) return null;
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-100 text-blue-800';
      case 'Part-time': return 'bg-green-100 text-green-800';
      case 'Internship': return 'bg-purple-100 text-purple-800';
      case 'Contract': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/student/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Job Opportunities</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobs.length === 0 ? 'No opportunities available' : 'No matching opportunities'}
              </h3>
              <p className="text-gray-600">
                {jobs.length === 0 
                  ? 'Check back later for new job postings from our alumni network.' 
                  : 'Try adjusting your search criteria to find more opportunities.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                          {job.title}
                        </h3>
                        <Badge className={`px-3 py-1 ${getJobTypeColor(job.type)}`}>
                          {job.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        {job.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.department && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{job.department}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((requirement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {requirement}
                          </Badge>
                        ))}
                        {job.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {job.salary && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatSalary(job.salary)}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button 
                            variant="outline"
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(job);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyToJob(job);
                            }}
                          >
                            <Send className="w-4 h-4" />
                            <span>Apply Now</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Showing {filteredJobs.length} of {jobs.length} opportunities • 
            Jobs posted by verified alumni and administrators
          </p>
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApplyToJob}
      />
    </div>
  );
};

export default JobOpportunities;