import React, { useState } from 'react';
import { Filter, List, ChevronUp } from 'lucide-react';
import { IssueStatus, IssueCategory } from '../types';
import { ISSUE_CATEGORIES } from '../utils/constants';
import IssueCard from '../components/UI/IssueCard';
import StatusBadge from '../components/UI/StatusBadge';
import { useIssues } from '../hooks/useIssues';

const MapView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const filters = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(categoryFilter !== 'all' && { category: categoryFilter })
  };

  const { issues, loading, handleUpvote } = useIssues(filters);

  // Filter issues based on current filters
  const filteredIssues = issues;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issues map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Issue Map</h1>
          <p className="text-lg text-gray-600">
            Explore civic issues in your area. Click on issues to view details or upvote to prioritize them.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4 inline mr-1" />
                  List View
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(statusFilter !== 'all' || categoryFilter !== 'all') && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as IssueCategory | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {ISSUE_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'map' ? (
          // Map View Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 h-96 lg:h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-2xl">🗺️</span>
                  </div>
                  <p className="text-gray-500 text-lg">Interactive Map</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Map integration would show issues plotted by location with interactive markers
                  </p>
                </div>
              </div>
            </div>

            {/* Issue List Sidebar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredIssues.slice(0, 6).map((issue) => (
                  <div 
                    key={issue.id}
                    className={`bg-white rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedIssue === issue.id 
                        ? 'border-blue-500 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {issue.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(issue.id);
                          }}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <ChevronUp className="w-3 h-3" />
                          <span>{issue.upvotes}</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusBadge status={issue.status} />
                        <StatusBadge priority={issue.priority} />
                      </div>
                      
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {issue.description}
                      </p>
                      
                      <div className="mt-2 text-xs text-gray-400">
                        {new Date(issue.reportedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">All Issues</h3>
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No issues found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpvote={handleUpvote}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;