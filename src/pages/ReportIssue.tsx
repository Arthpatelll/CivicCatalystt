import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Mic, MicOff } from 'lucide-react';
import { ISSUE_CATEGORIES } from '../utils/constants';
import { IssueCategory, Priority } from '../types';
import { useIssues } from '../hooks/useIssues';
import { useAuthContext } from '../components/Auth/AuthProvider';
import { getDepartmentForIssue } from '../utils/departmentRouting';

const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { submitIssue } = useIssues();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as IssueCategory | '',
    priority: 'medium' as Priority,
    location: {
      address: '',
      lat: 0,
      lng: 0
    },
    photos: [] as string[],
    videos: [] as string[],
    isAnonymous: false,
    useVoiceInput: false
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [assignedDepartment, setAssignedDepartment] = useState<string>('');

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          description: prev.description + ' ' + transcript
        }));
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Update assigned department when category changes
  React.useEffect(() => {
    if (formData.category) {
      const department = getDepartmentForIssue(formData.category, formData.location);
      setAssignedDepartment(department.name);
    }
  }, [formData.category, formData.location]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const startVoiceRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location_address: formData.location.address,
        location_lat: formData.location.lat || null,
        location_lng: formData.location.lng || null,
        is_anonymous: formData.isAnonymous
      };

      const { error } = await submitIssue(issueData);
      
      if (error) {
        alert('Error submitting issue: ' + error);
        return;
      }

      navigate('/dashboard', {
        state: { message: 'Issue reported successfully! We\'ll keep you updated on the progress.' }
      });
    } catch (error: any) {
      alert('Error submitting issue: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: 'Current Location' // In real app, reverse geocode this
            }
          }));
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to detect location. Please enter address manually.');
        }
      );
    }
  };

  const handleVoiceInput = () => {
    if (recognition) {
      if (isRecording) {
        stopVoiceRecording();
      } else {
        startVoiceRecording();
      }
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, upload to server and get URLs
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 5) // Max 5 photos
      }));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, upload to server and get URLs
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, ...newVideos].slice(0, 2) // Max 2 videos
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
            <p className="text-lg text-gray-600">
              Help improve your community by reporting civic issues. Your report will be reviewed and assigned to the appropriate department.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ISSUE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id as IssueCategory }))}
                    className={`p-4 text-center rounded-lg border-2 transition-colors ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide as much detail as possible about the issue"
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`absolute bottom-2 right-2 p-2 rounded-full transition-colors ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Use voice input"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Moderate issue</option>
                <option value="high">High - Significant problem</option>
                <option value="urgent">Urgent - Safety concern</option>
              </select>
            </div>

            {/* Assigned Department */}
            {assignedDepartment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">
                    This issue will be automatically assigned to:
                  </span>
                </div>
                <p className="text-lg font-semibold text-blue-900 mt-1">
                  {assignedDepartment}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Based on the category selected, this department is best suited to handle your issue.
                </p>
              </div>
            )}

            {/* Location */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address or location details"
                />
                <button
                  type="button"
                  onClick={handleLocationDetect}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  title="Detect current location"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Detect</span>
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photos"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload photos or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 10MB each (max 5 photos)
                  </span>
                </label>
              </div>
              
              {formData.photos.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Upload ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="videos"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="videos"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload videos or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    MP4, MOV up to 50MB each (max 2 videos)
                  </span>
                </label>
              </div>
              
              {formData.videos.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.videos.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                      controls
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous Reporting */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                Submit this report anonymously
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;