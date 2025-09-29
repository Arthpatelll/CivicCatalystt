import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Eye, Users, TrendingUp, MapPin, Clock, CheckCircle, Shield } from 'lucide-react';
import { sampleIssues, sampleAnalytics } from '../utils/sampleData';
import IssueCard from '../components/UI/IssueCard';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const recentIssues = sampleIssues.slice(0, 3);
  const stats = [
    {
      name: 'Total Issues Reported',
      value: sampleAnalytics.totalIssues.toLocaleString(),
      icon: AlertCircle,
      color: 'text-blue-600'
    },
    {
      name: 'Issues Resolved',
      value: sampleAnalytics.resolvedIssues.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: 'Average Response Time',
      value: `${sampleAnalytics.averageResponseTime}h`,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      name: 'Active Citizens',
      value: '12.8K',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const features = [
    {
      icon: AlertCircle,
      title: 'Instant Reporting',
      description: 'Report civic issues instantly with photos, location, and detailed descriptions.'
    },
    {
      icon: Eye,
      title: 'Real-time Tracking',
      description: 'Track your reports from submission to resolution with live status updates.'
    },
    {
      icon: MapPin,
      title: 'Interactive Map',
      description: 'View all community issues on an interactive map with filtering and prioritization.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for municipal staff to track performance and trends.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Communities
              <span className="block text-blue-200">One Report at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Civic Catalyst connects citizens with municipal authorities in real-time, 
              making civic engagement transparent, efficient, and impactful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/report"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    Report an Issue
                  </Link>
                  <Link
                    to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Civic Catalyst is making a difference in our community through transparent civic engagement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Civic Catalyst Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes civic engagement simple, transparent, and effective
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Issues</h2>
              <p className="text-lg text-gray-600">Latest community reports and their status</p>
            </div>
            <Link
              to="/map"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Issues →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of active citizens working together to improve our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/report"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Start Reporting
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;