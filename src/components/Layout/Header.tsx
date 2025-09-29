import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, Globe } from 'lucide-react';
import { useAuthContext } from '../Auth/AuthProvider';
import { useNotifications } from '../../hooks/useNotifications';
import { signOut } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isAuthenticated } = useAuthContext();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Report Issue', href: '/report' },
    { name: 'Map View', href: '/map' },
    { name: 'My Issues', href: '/dashboard' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'API Docs', href: '/api' }
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CE</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CivicEye</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Sign In
              </Link>
            ) : (
              <>
                <div className="text-sm text-gray-600">
                  Welcome, {profile?.full_name || user?.email}
                </div>
              </>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            
            {isAuthenticated && (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                              !notification.is_read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;