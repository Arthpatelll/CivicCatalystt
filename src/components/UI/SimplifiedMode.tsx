import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SimplifiedModeProps {
  isSimplified: boolean;
  onToggle: () => void;
}

const SimplifiedMode: React.FC<SimplifiedModeProps> = ({ isSimplified, onToggle }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
          isSimplified 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 border border-gray-300'
        }`}
        title={isSimplified ? 'Switch to normal view' : 'Switch to simplified view'}
      >
        {isSimplified ? (
          <>
            <EyeOff className="w-4 h-4" />
            <span className="text-sm font-medium">Normal View</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Large Text</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SimplifiedMode;
