import React, { useState } from 'react';
import { Copy, Check, Code, Database, Globe, Shield } from 'lucide-react';

const APIDocs: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/issues',
      description: 'Retrieve all public issues',
      example: 'GET /api/issues?category=potholes&status=resolved&limit=10'
    },
    {
      method: 'GET',
      endpoint: '/api/issues/{id}',
      description: 'Get specific issue details',
      example: 'GET /api/issues/123'
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/public',
      description: 'Get public analytics data',
      example: 'GET /api/analytics/public?timeRange=30days'
    },
    {
      method: 'GET',
      endpoint: '/api/departments',
      description: 'Get department performance data',
      example: 'GET /api/departments?includeScores=true'
    }
  ];

  const codeExamples = {
    javascript: `// Fetch all resolved pothole issues
const response = await fetch('/api/issues?category=potholes&status=resolved');
const issues = await response.json();

// Get department performance
const deptResponse = await fetch('/api/departments?includeScores=true');
const departments = await deptResponse.json();`,

    python: `import requests

# Fetch issues by category
response = requests.get('/api/issues', params={
    'category': 'potholes',
    'status': 'resolved',
    'limit': 10
})
issues = response.json()

# Get analytics data
analytics = requests.get('/api/analytics/public').json()`,

    curl: `# Get all issues
curl -X GET "https://api.civiceye.gov/issues?category=potholes&status=resolved"

# Get department performance
curl -X GET "https://api.civiceye.gov/departments?includeScores=true"

# Get analytics data
curl -X GET "https://api.civiceye.gov/analytics/public?timeRange=30days"`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Access civic issue data and analytics through our public API. Perfect for researchers, 
            NGOs, and civic tech developers building solutions for public good.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Real-time Data</h3>
            </div>
            <p className="text-gray-600">
              Access live civic issue data, department performance metrics, and resolution statistics.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy Protected</h3>
            </div>
            <p className="text-gray-600">
              All personal information is anonymized. Only public issue data is accessible via API.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Open Access</h3>
            </div>
            <p className="text-gray-600">
              Free access for research, civic engagement, and public good initiatives.
            </p>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">API Endpoints</h2>
            <p className="text-gray-600 mt-2">Available endpoints for accessing civic data</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        endpoint.method === 'GET' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-900">{endpoint.endpoint}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(endpoint.example, endpoint.endpoint)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {copiedEndpoint === endpoint.endpoint ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{endpoint.description}</p>
                  <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {endpoint.example}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Code Examples</h2>
            <p className="text-gray-600 mt-2">Get started with our API using these examples</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {Object.entries(codeExamples).map(([language, code]) => (
                <div key={language}>
                  <div className="flex items-center space-x-2 mb-3">
                    <Code className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{language}</h3>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate Limits & Terms */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Rate Limits & Terms</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• 1000 requests per hour per IP address</li>
            <li>• Data is updated every 15 minutes</li>
            <li>• Personal information is never exposed</li>
            <li>• Attribution required for public use</li>
            <li>• Contact us for higher rate limits</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
