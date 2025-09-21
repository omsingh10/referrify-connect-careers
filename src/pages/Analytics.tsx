import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Target,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  Download,
  BarChart3
} from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const overallStats = {
    totalUsers: 1247,
    totalJobs: 89,
    successfulReferrals: 356,
    averageTimeToHire: 21, // days
    userGrowth: 12.5, // percentage
    jobGrowth: 8.3,
    referralSuccessRate: 68.2,
    platformRevenue: 125000
  };

  const userStats = [
    { category: 'Students', count: 892, percentage: 71.5, growth: +15.2 },
    { category: 'Alumni', count: 355, percentage: 28.5, growth: +8.7 }
  ];

  const jobCategories = [
    { category: 'Software Engineering', count: 34, percentage: 38.2, applications: 456 },
    { category: 'Product Management', count: 18, percentage: 20.2, applications: 234 },
    { category: 'Data Science', count: 15, percentage: 16.9, applications: 198 },
    { category: 'Design', count: 12, percentage: 13.5, applications: 145 },
    { category: 'Marketing', count: 10, percentage: 11.2, applications: 98 }
  ];

  const recentMetrics = [
    {
      title: 'New Registrations',
      value: 45,
      change: +12.5,
      period: 'This week',
      trend: 'up'
    },
    {
      title: 'Job Applications',
      value: 234,
      change: +8.9,
      period: 'This week',
      trend: 'up'
    },
    {
      title: 'Successful Referrals',
      value: 18,
      change: -2.1,
      period: 'This week',
      trend: 'down'
    },
    {
      title: 'Revenue',
      value: '$12,450',
      change: +22.3,
      period: 'This month',
      trend: 'up'
    }
  ];

  const topUniversities = [
    { name: 'MIT', users: 187, referrals: 45 },
    { name: 'Stanford', users: 156, referrals: 38 },
    { name: 'UC Berkeley', users: 134, referrals: 32 },
    { name: 'Caltech', users: 98, referrals: 28 },
    { name: 'Harvard', users: 89, referrals: 24 }
  ];

  const topCompanies = [
    { name: 'Google', jobs: 12, applications: 189 },
    { name: 'Meta', jobs: 8, applications: 145 },
    { name: 'Apple', jobs: 7, applications: 123 },
    { name: 'Microsoft', jobs: 6, applications: 98 },
    { name: 'Netflix', jobs: 5, applications: 87 }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp size={16} className="text-green-500" /> : 
      <TrendingDown size={16} className="text-red-500" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  // Export functions
  const handleExportUserData = () => {
    // Create CSV content for user data
    const userData = [
      ['Name', 'Email', 'Role', 'University', 'Registration Date', 'Status'],
      ['Alex Johnson', 'alex@university.edu', 'Student', 'MIT', '2024-01-15', 'Active'],
      ['Sarah Chen', 'sarah@tech.com', 'Alumni', 'Stanford', '2023-08-10', 'Verified'],
      ['Michael Zhang', 'michael@email.com', 'Alumni', 'UC Berkeley', '2024-03-22', 'Pending'],
      // Add more sample data
    ];

    const csvContent = userData.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'user-data-export.csv');
  };

  const handleExportJobAnalytics = () => {
    // Create CSV content for job analytics
    const jobData = [
      ['Job Title', 'Company', 'Category', 'Applications', 'Referrals', 'Posted Date', 'Status'],
      ['Software Engineer Intern', 'Google', 'Software Engineering', '45', '12', '2024-09-15', 'Active'],
      ['Product Manager', 'Meta', 'Product Management', '28', '8', '2024-09-18', 'Pending'],
      ['Data Scientist', 'Netflix', 'Data Science', '67', '15', '2024-09-10', 'Active'],
      // Add more sample data
    ];

    const csvContent = jobData.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'job-analytics-export.csv');
  };

  const handleExportFullReport = () => {
    // Create comprehensive report
    const reportData = [
      ['=== REFERRIFY PLATFORM ANALYTICS REPORT ==='],
      [`Report Generated: ${new Date().toLocaleDateString()}`],
      ['Time Period: ' + timeRange],
      [''],
      ['=== KEY METRICS ==='],
      [`Total Users: ${overallStats.totalUsers}`],
      [`Active Jobs: ${overallStats.totalJobs}`],
      [`Successful Referrals: ${overallStats.successfulReferrals}`],
      [`Referral Success Rate: ${overallStats.referralSuccessRate}%`],
      [`Average Time to Hire: ${overallStats.averageTimeToHire} days`],
      [`Monthly Revenue: $${overallStats.platformRevenue.toLocaleString()}`],
      [''],
      ['=== USER BREAKDOWN ==='],
      [`Students: ${userStats[0].count} (${userStats[0].percentage}%)`],
      [`Alumni: ${userStats[1].count} (${userStats[1].percentage}%)`],
      [''],
      ['=== TOP PERFORMING CATEGORIES ==='],
      ...jobCategories.map(cat => [`${cat.category}: ${cat.count} jobs, ${cat.applications} applications`]),
      [''],
      ['=== TOP UNIVERSITIES ==='],
      ...topUniversities.map(uni => [`${uni.name}: ${uni.users} users, ${uni.referrals} referrals`]),
      [''],
      ['=== TOP COMPANIES ==='],
      ...topCompanies.map(comp => [`${comp.name}: ${comp.jobs} jobs, ${comp.applications} applications`]),
    ];

    const csvContent = reportData.map(row => Array.isArray(row) ? row.join(',') : row).join('\n');
    downloadCSV(csvContent, 'referrify-full-report.csv');
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportFullReport}>
                <Download size={16} className="mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recentMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  {getTrendIcon(metric.trend)}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <div className="flex items-center text-sm">
                  <span className={getTrendColor(metric.trend)}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-gray-500 ml-2">{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users size={20} />
                <span>User Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{stat.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{stat.count}</span>
                        <Badge variant="outline" className="text-xs">
                          {stat.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                    <div className="flex items-center text-xs text-gray-500">
                      <TrendingUp size={12} className="mr-1 text-green-500" />
                      <span>+{stat.growth}% growth</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase size={20} />
                <span>Job Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{category.count} jobs</span>
                        <Badge variant="outline" className="text-xs">
                          {category.applications} apps
                        </Badge>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Universities */}
          <Card>
            <CardHeader>
              <CardTitle>Top Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUniversities.map((university, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{university.name}</p>
                        <p className="text-sm text-gray-500">{university.users} users</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {university.referrals} referrals
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.jobs} jobs</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {company.applications} apps
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Platform Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Target className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-2xl font-bold text-blue-600">{overallStats.referralSuccessRate}%</p>
                <p className="text-sm text-gray-600">Referral Success Rate</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock className="mx-auto mb-2 text-green-500" size={24} />
                <p className="text-2xl font-bold text-green-600">{overallStats.averageTimeToHire}d</p>
                <p className="text-sm text-gray-600">Avg. Time to Hire</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
                <p className="text-2xl font-bold text-purple-600">+{overallStats.userGrowth}%</p>
                <p className="text-sm text-gray-600">User Growth</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <DollarSign className="mx-auto mb-2 text-orange-500" size={24} />
                <p className="text-2xl font-bold text-orange-600">${overallStats.platformRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start" onClick={handleExportUserData}>
                <Download size={16} className="mr-2" />
                Export User Data
              </Button>
              <Button variant="outline" className="justify-start" onClick={handleExportJobAnalytics}>
                <Download size={16} className="mr-2" />
                Export Job Analytics
              </Button>
              <Button variant="outline" className="justify-start" onClick={handleExportFullReport}>
                <Download size={16} className="mr-2" />
                Export Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;