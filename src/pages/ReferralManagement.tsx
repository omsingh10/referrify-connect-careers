import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Calendar, 
  Briefcase, 
  FileText, 
  ArrowLeft,
  Search,
  Filter,
  MessageSquare,
  Download,
  Star,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReferralManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  const [referralRequests, setReferralRequests] = useState([
    {
      id: 1,
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@university.edu",
      studentPhone: "(555) 123-4567",
      jobTitle: "Software Engineer Intern",
      company: "TechCorp",
      appliedDate: "Nov 15, 2024",
      status: "pending",
      priority: "high",
      resumeUrl: "#",
      portfolioUrl: "https://alexjohnson.dev",
      coverLetter: "I am very interested in this position and would love to contribute to your team. I have experience with React, Node.js, and have built several full-stack applications during my studies.",
      gpa: "3.8",
      university: "Stanford University",
      major: "Computer Science",
      graduationYear: "2025",
      skills: ["React", "Node.js", "Python", "SQL"],
      notes: ""
    },
    {
      id: 2,
      studentName: "Maria Garcia",
      studentEmail: "maria.garcia@university.edu",
      studentPhone: "(555) 234-5678",
      jobTitle: "Frontend Developer",
      company: "TechCorp",
      appliedDate: "Nov 14, 2024",
      status: "pending",
      priority: "medium",
      resumeUrl: "#",
      portfolioUrl: "https://mariagarcia.portfolio.com",
      coverLetter: "As a computer science student with a passion for frontend development, I would be thrilled to join your team. My experience includes React, TypeScript, and modern CSS frameworks.",
      gpa: "3.7",
      university: "UC Berkeley",
      major: "Computer Science",
      graduationYear: "2025",
      skills: ["React", "TypeScript", "CSS", "Figma"],
      notes: ""
    },
    {
      id: 3,
      studentName: "James Wilson",
      studentEmail: "james.wilson@university.edu",
      studentPhone: "(555) 345-6789",
      jobTitle: "Software Engineer Intern",
      company: "TechCorp",
      appliedDate: "Nov 10, 2024",
      status: "approved",
      priority: "high",
      resumeUrl: "#",
      portfolioUrl: "https://jameswilson.github.io",
      coverLetter: "I have been following TechCorp's work and I'm excited about the opportunity to contribute to your innovative projects. My background in algorithms and data structures will be valuable.",
      gpa: "3.9",
      university: "MIT",
      major: "Computer Science",
      graduationYear: "2024",
      skills: ["Java", "Python", "C++", "Algorithms"],
      notes: "Excellent candidate, recommended by multiple professors"
    },
    {
      id: 4,
      studentName: "Sarah Kim",
      studentEmail: "sarah.kim@university.edu",
      studentPhone: "(555) 456-7890",
      jobTitle: "Data Analyst Intern",
      company: "TechCorp",
      appliedDate: "Nov 8, 2024",
      status: "rejected",
      priority: "low",
      resumeUrl: "#",
      portfolioUrl: "",
      coverLetter: "I'm passionate about data science and would love to bring my analytical skills to your team. I have experience with Python, R, and machine learning algorithms.",
      gpa: "3.5",
      university: "UCLA",
      major: "Data Science",
      graduationYear: "2025",
      skills: ["Python", "R", "SQL", "Tableau"],
      notes: "Good candidate but position requirements didn't match experience level"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [selectedRequestForMessage, setSelectedRequestForMessage] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleReferralAction = (requestId: number, action: "approve" | "reject") => {
    // Update the request status in state
    setReferralRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: action === "approve" ? "approved" : "rejected" }
          : request
      )
    );
    
    // In a real app, this would be an API call to update the backend
    console.log(`${action} referral request ${requestId}`);
    
    // Show success message
    alert(`Referral request has been ${action === "approve" ? "approved" : "rejected"} successfully!`);
  };

  const handleViewResume = (resumeUrl: string, studentName: string) => {
    if (resumeUrl && resumeUrl !== "#") {
      window.open(resumeUrl, '_blank');
    } else {
      // In a real app, this would download from a file storage service
      alert(`Resume for ${studentName} would be downloaded here. In the actual implementation, this would fetch the resume file from the server.`);
    }
  };

  const handleViewPortfolio = (portfolioUrl: string, studentName: string) => {
    if (portfolioUrl) {
      window.open(portfolioUrl, '_blank');
    } else {
      alert(`${studentName} has not provided a portfolio URL.`);
    }
  };

  const handleSendMessage = (request: any) => {
    setSelectedRequestForMessage(request);
    setIsMessageDialogOpen(true);
  };

  const sendMessage = () => {
    if (!messageText.trim()) {
      alert("Please enter a message.");
      return;
    }
    
    // In a real app, this would send the message via API
    console.log(`Sending message to ${selectedRequestForMessage.studentEmail}: ${messageText}`);
    
    alert(`Message sent to ${selectedRequestForMessage.studentName} successfully!`);
    setIsMessageDialogOpen(false);
    setMessageText("");
    setSelectedRequestForMessage(null);
  };

  const filteredRequests = referralRequests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: referralRequests.length,
    pending: referralRequests.filter(r => r.status === "pending").length,
    approved: referralRequests.filter(r => r.status === "approved").length,
    rejected: referralRequests.filter(r => r.status === "rejected").length
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Email,Job Title,Status,Applied Date,University,GPA\n"
      + referralRequests.map(r => 
          `${r.studentName},${r.studentEmail},${r.jobTitle},${r.status},${r.appliedDate},${r.university},${r.gpa}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "referral_requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>
                <p className="text-sm text-gray-600">Review and manage student referral requests</p>
              </div>
            </div>
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
              <p className="text-sm text-gray-600">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.approved}</div>
              <p className="text-sm text-gray-600">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.rejected}</div>
              <p className="text-sm text-gray-600">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select 
                  className="border rounded-md px-3 py-2 text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Requests */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {request.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.studentName}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority} priority
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{request.studentEmail}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            <span>{request.jobTitle} at {request.company}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Applied: {request.appliedDate}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">University:</span> {request.university}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Major:</span> {request.major}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">GPA:</span> {request.gpa} • <span className="font-medium">Graduation:</span> {request.graduationYear}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Cover Letter:</span>
                        </p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {request.coverLetter}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-md">
                            {request.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusIcon(request.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewResume(request.resumeUrl, request.studentName)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                    {request.portfolioUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPortfolio(request.portfolioUrl, request.studentName)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Portfolio
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendMessage(request)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                  
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReferralAction(request.id, "reject")}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleReferralAction(request.id, "approve")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No referral requests found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "When students apply for referrals, they'll appear here."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Message to {selectedRequestForMessage?.studentName}
            </DialogTitle>
            <DialogDescription>
              Send a message to {selectedRequestForMessage?.studentEmail} about their referral request for {selectedRequestForMessage?.jobTitle}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedRequestForMessage?.studentName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedRequestForMessage?.studentName}</p>
                  <p className="text-sm text-gray-600">{selectedRequestForMessage?.studentEmail}</p>
                  <p className="text-sm text-gray-600">Applied for: {selectedRequestForMessage?.jobTitle}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message</label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi [Name],

Thank you for your interest in the [Position] role at [Company]. I've reviewed your application and would like to discuss...

Best regards,
[Your Name]"
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">{messageText.length}/500 characters</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralManagement;