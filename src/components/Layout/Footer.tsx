import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold">Civic Catalyst</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering communities through real-time civic issue reporting and transparent municipal governance. 
              Making cities more responsive and citizens more engaged.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/report" className="text-gray-400 hover:text-white transition-colors">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-white transition-colors">
                  Issue Map
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>311 (City Services)</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@civiccatalyst.gov</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Emergency</h4>
              <p className="text-red-400 font-bold">Call 911</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Civic Catalyst. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">
                Accessibility
              </Link>
              <Link to="/api" className="text-gray-400 hover:text-white text-sm transition-colors">
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;