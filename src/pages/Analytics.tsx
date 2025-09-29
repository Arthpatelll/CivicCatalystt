import React, { useState } from 'react';
import { TrendingUp, Users, Clock, Target, Award, AlertCircle, Star } from 'lucide-react';
import { sampleAnalytics } from '../utils/sampleData';
import { calculateImpactScore } from '../utils/departmentRouting';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedDepartment, setSelectedDepartment] = useState<string | 'all'>('all');

  const chartData = sampleAnalytics.trendData.map(item => ({
    ...item,
    resolutionRate: ((item.resolved / item.issues) * 100).toFixed(1)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">
                Comprehensive insights into civic engagement and municipal performance
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="road-maintenance">Road Maintenance</option>
                <option value="sanitation">Sanitation</option>
                <option value="electrical">Electrical</option>
                <option value="water">Water Department</option>
                <option value="traffic">Traffic Management</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-3xl font-bold text-gray-900">{sampleAnalytics.totalIssues.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round((sampleAnalytics.resolvedIssues / sampleAnalytics.totalIssues) * 100)}%
                </p>
                <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-orange-600">{sampleAnalytics.averageResponseTime}h</p>
                <p className="text-sm text-green-600 mt-1">↓ 2.5h from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Citizens</p>
                <p className="text-3xl font-bold text-purple-600">12.8K</p>
                <p className="text-sm text-green-600 mt-1">↑ 8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Resolution Trends</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive Chart</p>
                <p className="text-gray-400 text-sm mt-2">
                  Line chart showing issues reported vs resolved over time
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-4 text-center">
              {chartData.map((item, index) => (
                <div key={index} className="text-xs">
                  <div className="text-gray-500">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="text-blue-600 font-medium">{item.issues} reported</div>
                  <div className="text-green-600 font-medium">{item.resolved} resolved</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Issue Categories</h3>
            <div className="space-y-4">
              {sampleAnalytics.topCategories.map((category, index) => {
                const percentage = (category.count / sampleAnalytics.totalIssues) * 100;
                return (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {category.category.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-500">{category.count} issues</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{percentage.toFixed(1)}%</p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Municipal Impact Score */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Municipal Impact Score</h3>
              <p className="text-blue-100">Overall performance rating based on citizen feedback and resolution metrics</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {calculateImpactScore(
                  sampleAnalytics.resolvedIssues,
                  sampleAnalytics.totalIssues,
                  sampleAnalytics.averageResponseTime,
                  4.2 // Average citizen rating
                )}
              </div>
              <div className="text-blue-100 text-sm">out of 10</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Resolution Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {((sampleAnalytics.resolvedIssues / sampleAnalytics.totalIssues) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Avg Response Time</span>
              </div>
              <div className="text-2xl font-bold">{sampleAnalytics.averageResponseTime}h</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Citizen Rating</span>
              </div>
              <div className="text-2xl font-bold">4.2/5</div>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
            <div className="text-sm text-gray-500">Impact Score (1-5 scale)</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Impact Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Response Time</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sampleAnalytics.departmentPerformance.map((dept) => (
                  <tr key={dept.department} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                          {dept.department.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{dept.department}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900">{dept.score}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-gray-700">{dept.responseTime}h</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex justify-center">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          dept.score >= 4.0 ? 'bg-green-100 text-green-800' :
                          dept.score >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dept.score >= 4.0 ? 'Excellent' :
                           dept.score >= 3.5 ? 'Good' : 'Needs Improvement'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;