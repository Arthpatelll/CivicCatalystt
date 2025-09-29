import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Bell, TrendingUp } from 'lucide-react';
import { IssueStatus, IssueCategory } from '../types';
import IssueCard from '../components/UI/IssueCard';
import { useAuthContext } from '../components/Auth/AuthProvider';
import { useIssues } from '../hooks/useIssues';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuthContext();
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const filters = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(categoryFilter !== 'all' && { category: categoryFilter }),
    userId: user?.id
  };

  const { issues, loading, handleUpvote } = useIssues(filters);

  // Filter issues based on current filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const userStats = {
    totalReported: issues.length,
    resolved: issues.filter(issue => issue.status === 'resolved').length,
    inProgress: issues.filter(issue => issue.status === 'in_progress' || issue.status === 'assigned').length,
    pending: issues.filter(issue => issue.status === 'submitted' || issue.status === 'acknowledged').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">
                Welcome back, {profile?.full_name || user?.email}. Track your reports and community engagement.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/report"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Report New Issue
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reported</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.totalReported}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{userStats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{userStats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{userStats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as IssueCategory | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="potholes">Potholes</option>
                <option value="garbage">Garbage</option>
                <option value="streetlights">Street Lights</option>
                <option value="water-leaks">Water Leaks</option>
                <option value="traffic">Traffic</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Reports ({filteredIssues.length})
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No issues found matching your filters.</p>
              <Link
                to="/report"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Report Your First Issue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue}
                  showUpvote={false}
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;