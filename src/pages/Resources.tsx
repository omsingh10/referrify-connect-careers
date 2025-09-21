import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Search,
  BookOpen,
  Video,
  FileText,
  Globe,
  Users,
  Award,
  Briefcase,
  Code,
  ExternalLink,
  Download,
  Heart,
  Eye
} from 'lucide-react';

const Resources = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Career', 'Technical', 'Interview', 'Networking', 'Certifications'];

  const resources = [
    {
      id: 1,
      title: 'Technical Interview Preparation Guide',
      description: 'Comprehensive guide covering data structures, algorithms, and system design for technical interviews.',
      type: 'Guide',
      category: 'Interview',
      icon: Code,
      link: 'https://leetcode.com/explore/interview/',
      isPremium: false,
      downloads: 1250,
      views: 8900
    },
    {
      id: 2,
      title: 'Resume Writing Workshop Video Series',
      description: '5-part video series on crafting compelling resumes for tech roles.',
      type: 'Video',
      category: 'Career',
      icon: Video,
      link: 'https://youtube.com/watch?v=example',
      isPremium: false,
      downloads: 0,
      views: 15600
    },
    {
      id: 3,
      title: 'Networking 101: Building Professional Relationships',
      description: 'Learn how to network effectively in the tech industry and build lasting professional relationships.',
      type: 'Article',
      category: 'Networking',
      icon: Users,
      link: '#',
      isPremium: false,
      downloads: 890,
      views: 5400
    },
    {
      id: 4,
      title: 'AWS Cloud Practitioner Certification Path',
      description: 'Complete study guide and practice tests for AWS Cloud Practitioner certification.',
      type: 'Course',
      category: 'Certifications',
      icon: Award,
      link: 'https://aws.amazon.com/certification/',
      isPremium: true,
      downloads: 2100,
      views: 12300
    },
    {
      id: 5,
      title: 'System Design Interview Cheat Sheet',
      description: 'Quick reference guide for system design concepts commonly asked in interviews.',
      type: 'Cheat Sheet',
      category: 'Interview',
      icon: FileText,
      link: '#',
      isPremium: false,
      downloads: 3200,
      views: 18700
    },
    {
      id: 6,
      title: 'Full-Stack Development Roadmap 2024',
      description: 'Step-by-step roadmap to become a full-stack developer with modern technologies.',
      type: 'Roadmap',
      category: 'Technical',
      icon: Code,
      link: 'https://roadmap.sh/full-stack',
      isPremium: false,
      downloads: 4500,
      views: 25800
    },
    {
      id: 7,
      title: 'Behavioral Interview Questions Database',
      description: 'Curated collection of 200+ behavioral interview questions with sample answers.',
      type: 'Database',
      category: 'Interview',
      icon: BookOpen,
      link: '#',
      isPremium: true,
      downloads: 1800,
      views: 9600
    },
    {
      id: 8,
      title: 'Salary Negotiation Strategies for Tech',
      description: 'Learn how to negotiate competitive salaries and benefits in the tech industry.',
      type: 'Guide',
      category: 'Career',
      icon: Briefcase,
      link: '#',
      isPremium: false,
      downloads: 2700,
      views: 14200
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return 'bg-red-100 text-red-800';
      case 'Guide': return 'bg-blue-100 text-blue-800';
      case 'Article': return 'bg-green-100 text-green-800';
      case 'Course': return 'bg-purple-100 text-purple-800';
      case 'Cheat Sheet': return 'bg-yellow-100 text-yellow-800';
      case 'Roadmap': return 'bg-indigo-100 text-indigo-800';
      case 'Database': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Resources</h1>
          <p className="text-gray-600">Curated resources to help you succeed in your career journey</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredResources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent size={20} className="text-blue-500" />
                      <Badge variant="secondary" className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    {resource.isPremium && (
                      <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {resource.downloads > 0 && (
                        <div className="flex items-center space-x-1">
                          <Download size={12} />
                          <span>{resource.downloads.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{resource.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(resource.link, '_blank')}
                    >
                      <ExternalLink size={14} className="mr-2" />
                      Access
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Add to favorites functionality
                        console.log('Added to favorites:', resource.title);
                      }}
                    >
                      <Heart size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No resources found matching your search.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need More Resources?
          </h3>
          <p className="text-blue-700 mb-4">
            Can't find what you're looking for? Connect with our alumni network for personalized recommendations and mentorship opportunities.
          </p>
          <Button 
            onClick={() => navigate('/student/opportunities')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Browse Alumni Network
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Resources;