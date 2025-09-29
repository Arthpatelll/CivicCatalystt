export const ISSUE_CATEGORIES = [
  { id: 'potholes', name: 'Potholes & Road Issues', icon: '🛣️', department: 'Road Maintenance' },
  { id: 'garbage', name: 'Garbage & Sanitation', icon: '🗑️', department: 'Sanitation' },
  { id: 'streetlights', name: 'Street Lighting', icon: '💡', department: 'Electrical' },
  { id: 'water-leaks', name: 'Water Leaks', icon: '💧', department: 'Water Department' },
  { id: 'traffic', name: 'Traffic Issues', icon: '🚦', department: 'Traffic Management' },
  { id: 'noise', name: 'Noise Pollution', icon: '🔊', department: 'Environmental' },
  { id: 'pollution', name: 'Environmental Issues', icon: '🌿', department: 'Environmental' },
  { id: 'public-safety', name: 'Public Safety', icon: '🚨', department: 'Public Safety' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️', department: 'Public Works' },
  { id: 'other', name: 'Other Issues', icon: '📝', department: 'General' },
] as const;

export const STATUS_COLORS = {
  submitted: 'bg-yellow-100 text-yellow-800',
  acknowledged: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
] as const;