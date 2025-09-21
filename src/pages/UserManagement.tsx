import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      role: 'student',
      status: 'active',
      university: 'MIT',
      major: 'Computer Science',
      graduationYear: '2024',
      joinDate: '2024-01-15',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah.chen@tech.com',
      role: 'alumni',
      status: 'verified',
      university: 'Stanford',
      major: 'Computer Science',
      graduationYear: '2020',
      company: 'Google',
      joinDate: '2023-08-10',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Michael Zhang',
      email: 'michael.zhang@email.com',
      role: 'alumni',
      status: 'pending',
      university: 'UC Berkeley',
      major: 'Data Science',
      graduationYear: '2019',
      company: 'Meta',
      joinDate: '2024-03-22',
      lastLogin: 'Never'
    },
    {
      id: 4,
      name: 'Lisa Wang',
      email: 'lisa.wang@student.edu',
      role: 'student',
      status: 'active',
      university: 'Caltech',
      major: 'Engineering',
      graduationYear: '2025',
      joinDate: '2024-02-28',
      lastLogin: '5 minutes ago'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'alumni',
      status: 'suspended',
      university: 'Harvard',
      major: 'Business',
      graduationYear: '2018',
      company: 'Apple',
      joinDate: '2023-12-05',
      lastLogin: '2 weeks ago'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.university.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'alumni':
        return <UserCheck size={16} className="text-blue-500" />;
      case 'student':
        return <Shield size={16} className="text-green-500" />;
      default:
        return <Shield size={16} className="text-gray-500" />;
    }
  };

  const handleUserAction = (action: string, userId: number, userName: string) => {
    switch (action) {
      case 'verify':
        alert(`✅ User verified: ${userName}`);
        break;
      case 'suspend':
        alert(`⚠️ User suspended: ${userName}`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
          alert(`🗑️ User deleted: ${userName}`);
        }
        break;
      case 'edit':
        alert(`✏️ Editing user: ${userName}`);
        break;
      default:
        break;
    }
  };

  const handleExportUsers = () => {
    const userData = [
      ['Name', 'Email', 'Role', 'Status', 'University', 'Major', 'Graduation Year', 'Join Date', 'Last Login'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.university,
        user.major,
        user.graduationYear,
        user.joinDate,
        user.lastLogin
      ])
    ];

    const csvContent = userData.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'users-export.csv');
  };

  const handleImportUsers = () => {
    alert('📥 Import functionality would open a file picker for CSV upload');
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
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active' || u.status === 'verified').length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage student and alumni accounts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</p>
                <p className="text-sm text-gray-600">Suspended</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportUsers}>
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportUsers}>
                  <Upload size={16} className="mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        {getRoleIcon(user.role)}
                        <Badge variant="outline" className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{user.university}</span>
                        <span>{user.major}</span>
                        <span>Class of {user.graduationYear}</span>
                        {user.company && <span>@ {user.company}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm text-gray-500 mr-4">
                      <p>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                      <p>Last login: {user.lastLogin}</p>
                    </div>
                    
                    {user.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleUserAction('verify', user.id, user.name)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <UserCheck size={14} className="mr-1" />
                        Verify
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserAction('edit', user.id, user.name)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    
                    {user.status !== 'suspended' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction('suspend', user.id, user.name)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <UserX size={14} className="mr-1" />
                        Suspend
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUserAction('delete', user.id, user.name)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;