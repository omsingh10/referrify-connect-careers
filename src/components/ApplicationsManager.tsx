import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Users, 
  Mail, 
  Clock, 
  CheckCircle, 
  X, 
  Eye,
  Download,
  Calendar,
  Building,
  MapPin
} from 'lucide-react';
import { 
  getApplicationsByPostedBy, 
  updateApplicationStatus, 
  type JobApplication 
} from '../lib/notification-system';

interface ApplicationsManagerProps {
  postedBy: string; // Alumni name who posted jobs
}

export const ApplicationsManager: React.FC<ApplicationsManagerProps> = ({
  postedBy
}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const loadApplications = () => {
    const userApplications = getApplicationsByPostedBy(postedBy);
    setApplications(userApplications);
  };

  useEffect(() => {
    loadApplications();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadApplications, 30000);
    return () => clearInterval(interval);
  }, [postedBy]);

  const handleStatusUpdate = (applicationId: string, status: JobApplication['status']) => {
    updateApplicationStatus(applicationId, status, postedBy);
    loadApplications();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupedApplications = applications.reduce((acc, app) => {
    const jobKey = `${app.jobTitle} at ${app.company}`;
    if (!acc[jobKey]) {
      acc[jobKey] = [];
    }
    acc[jobKey].push(app);
    return acc;
  }, {} as Record<string, JobApplication[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {applications.length} total applications
        </Badge>
      </div>

      {Object.keys(groupedApplications).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600">
              Applications for your job postings will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedApplications).map(([jobTitle, jobApplications]) => (
            <Card key={jobTitle}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-gray-600" />
                    <span>{jobTitle}</span>
                  </div>
                  <Badge variant="outline">
                    {jobApplications.length} applicant{jobApplications.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {jobApplications.map((application, index) => (
                    <div key={application.id}>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-blue-600">
                                {application.studentName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {application.studentName}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{application.studentEmail}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Applied {formatDate(application.appliedAt)}</span>
                            </div>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          
                          {application.coverLetter && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <p className="text-sm text-gray-700">
                                "{application.coverLetter}"
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          {application.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                                className="flex items-center space-x-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Mark Reviewed</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                                onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Accept</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                className="flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}
                          
                          {application.status === 'reviewed' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                                onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Accept</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                className="flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}
                          
                          {application.resumeUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(application.resumeUrl, '_blank')}
                              className="flex items-center space-x-1"
                            >
                              <Download className="w-4 h-4" />
                              <span>Resume</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {index < jobApplications.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};