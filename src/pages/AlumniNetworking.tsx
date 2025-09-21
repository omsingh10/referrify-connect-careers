import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Network, 
  ArrowLeft,
  Search,
  Filter,
  Building,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Send,
  Star,
  TrendingUp,
  Award,
  Coffee
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AlumniNetworking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const navigate = useNavigate();

  const networkConnections = [
    {
      id: 1,
      name: "John Smith",
      position: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      university: "Stanford University",
      graduationYear: "2018",
      skills: ["React", "Python", "Machine Learning", "Cloud Architecture"],
      connections: 342,
      isConnected: true,
      lastActive: "2 days ago",
      profileImage: "",
      linkedin: "linkedin.com/in/johnsmith",
      email: "john.smith@google.com",
      bio: "Passionate about building scalable web applications and mentoring junior developers.",
      experience: "5 years",
      industry: "Technology"
    },
    {
      id: 2,
      name: "Sarah Davis",
      position: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      university: "MIT",
      graduationYear: "2019",
      skills: ["Product Strategy", "Data Analysis", "User Research", "Agile"],
      connections: 298,
      isConnected: true,
      lastActive: "1 day ago",
      profileImage: "",
      linkedin: "linkedin.com/in/sarahdavis",
      email: "sarah.davis@microsoft.com",
      bio: "Leading product initiatives for cloud platforms with focus on user experience.",
      experience: "4 years",
      industry: "Technology"
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Data Scientist",
      company: "Meta",
      location: "Menlo Park, CA",
      university: "UC Berkeley",
      graduationYear: "2020",
      skills: ["Python", "TensorFlow", "Statistics", "Deep Learning"],
      connections: 185,
      isConnected: false,
      lastActive: "5 days ago",
      profileImage: "",
      linkedin: "linkedin.com/in/michaelchen",
      email: "michael.chen@meta.com",
      bio: "Building ML models to improve user engagement and content recommendation.",
      experience: "3 years",
      industry: "Technology"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      position: "UX Designer",
      company: "Apple",
      location: "Cupertino, CA",
      university: "Stanford University",
      graduationYear: "2017",
      skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      connections: 421,
      isConnected: false,
      lastActive: "3 days ago",
      profileImage: "",
      linkedin: "linkedin.com/in/emilyrodriguez",
      email: "emily.rodriguez@apple.com",
      bio: "Designing intuitive interfaces that delight users across Apple's ecosystem.",
      experience: "6 years",
      industry: "Technology"
    },
    {
      id: 5,
      name: "David Wilson",
      position: "Engineering Manager",
      company: "Netflix",
      location: "Los Gatos, CA",
      university: "Carnegie Mellon",
      graduationYear: "2015",
      skills: ["Team Leadership", "System Architecture", "Java", "Microservices"],
      connections: 567,
      isConnected: true,
      lastActive: "1 week ago",
      profileImage: "",
      linkedin: "linkedin.com/in/davidwilson",
      email: "david.wilson@netflix.com",
      bio: "Leading distributed systems engineering teams to scale video streaming infrastructure.",
      experience: "8 years",
      industry: "Technology"
    }
  ];

  const suggestedConnections = [
    {
      id: 6,
      name: "Lisa Thompson",
      position: "Marketing Director",
      company: "Salesforce",
      location: "San Francisco, CA",
      university: "Stanford University",
      graduationYear: "2018",
      mutualConnections: 12,
      reason: "Same university and graduation year"
    },
    {
      id: 7,
      name: "Robert Kim",
      position: "DevOps Engineer",
      company: "Uber",
      location: "San Francisco, CA",
      university: "UC Berkeley",
      graduationYear: "2019",
      mutualConnections: 8,
      reason: "Similar role and location"
    },
    {
      id: 8,
      name: "Amanda Foster",
      position: "Backend Developer",
      company: "Airbnb",
      location: "San Francisco, CA",
      university: "Stanford University",
      graduationYear: "2020",
      mutualConnections: 15,
      reason: "Same university and similar skills"
    }
  ];

  const networkingEvents = [
    {
      id: 1,
      title: "Bay Area Alumni Meetup",
      date: "Nov 25, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "San Francisco, CA",
      attendees: 47,
      type: "In-person",
      description: "Monthly networking event for Bay Area alumni across all industries."
    },
    {
      id: 2,
      title: "Tech Career Panel",
      date: "Dec 2, 2024",
      time: "7:00 PM - 8:30 PM",
      location: "Virtual",
      attendees: 123,
      type: "Virtual",
      description: "Panel discussion with senior engineers and product managers."
    },
    {
      id: 3,
      title: "Startup Founder Workshop",
      date: "Dec 8, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Palo Alto, CA",
      attendees: 32,
      type: "Workshop",
      description: "Learn from successful alumni founders about building and scaling startups."
    }
  ];

  const handleConnect = (alumniId: number) => {
    console.log(`Connecting to alumni ${alumniId}`);
  };

  const handleMessage = (alumni: any) => {
    setSelectedAlumni(alumni);
    setIsMessageOpen(true);
  };

  const handleSendMessage = () => {
    console.log(`Sending message to ${selectedAlumni?.name}`);
    setIsMessageOpen(false);
    setSelectedAlumni(null);
  };

  const filteredConnections = networkConnections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === "connected") {
      matchesFilter = connection.isConnected;
    } else if (selectedFilter === "suggested") {
      matchesFilter = !connection.isConnected;
    }
    
    return matchesSearch && matchesFilter;
  });

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
                <h1 className="text-2xl font-bold text-gray-900">Alumni Networking</h1>
                <p className="text-sm text-gray-600">Connect and collaborate with fellow alumni</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {networkConnections.filter(c => c.isConnected).length}
              </div>
              <p className="text-sm text-gray-600">Active Connections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <UserPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{suggestedConnections.length}</div>
              <p className="text-sm text-gray-600">Suggested Connections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{networkingEvents.length}</div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">89%</div>
              <p className="text-sm text-gray-600">Response Rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connections" className="space-y-6">
          <TabsList>
            <TabsTrigger value="connections">My Network</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search connections by name, company, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <select 
                      className="border rounded-md px-3 py-2 text-sm"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      <option value="all">All Connections</option>
                      <option value="connected">Connected</option>
                      <option value="suggested">Not Connected</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <Card key={connection.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                          {connection.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-gray-900 mb-1">{connection.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{connection.position}</p>
                      <p className="text-sm text-gray-500 mb-2">{connection.company}</p>
                      
                      {connection.isConnected && (
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          <Network className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span>{connection.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-3 w-3 mr-2" />
                        <span>{connection.university} '{connection.graduationYear.slice(-2)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2" />
                        <span>{connection.connections} connections</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {connection.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {connection.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{connection.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {connection.isConnected ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleMessage(connection)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleConnect(connection.id)}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Globe className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Connections</CardTitle>
                <CardDescription>Alumni you might want to connect with based on shared interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedConnections.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gray-100">
                            {suggestion.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                          <p className="text-sm text-gray-600">{suggestion.position} at {suggestion.company}</p>
                          <p className="text-xs text-gray-500">{suggestion.reason} • {suggestion.mutualConnections} mutual connections</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleConnect(suggestion.id)}>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Networking Events</CardTitle>
                <CardDescription>Join alumni events to expand your network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkingEvents.map((event) => (
                    <Card key={event.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <Badge variant={event.type === "Virtual" ? "secondary" : "outline"}>
                                {event.type}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-2" />
                                <span>{event.date} • {event.time}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-2" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-2" />
                                <span>{event.attendees} attendees</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{event.description}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline">
                              Learn More
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              Register
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
        </Tabs>
      </div>

      {/* Message Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedAlumni?.name}</DialogTitle>
            <DialogDescription>
              Connect with {selectedAlumni?.name} at {selectedAlumni?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Looking to connect about..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Hi [Name], I'd love to connect and learn about your experience..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniNetworking;