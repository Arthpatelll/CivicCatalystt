import React from 'react';
import { Link } from 'react-router-dom';
import { Issue } from '../../types';
import { Calendar, MapPin, ChevronUp, User } from 'lucide-react';
import { ISSUE_CATEGORIES } from '../../utils/constants';
import StatusBadge from './StatusBadge';

interface IssueCardProps {
  issue: Issue;
  showUpvote?: boolean;
  showLocation?: boolean;
  className?: string;
  onUpvote?: (issueId: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  showUpvote = true, 
  showLocation = true, 
  className = '',
  onUpvote
}) => {
  const categoryInfo = ISSUE_CATEGORIES.find(cat => cat.id === issue.category);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(issue.id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <Link to={`/issue/${issue.id}`} className="block p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Category and Priority */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{categoryInfo?.icon}</span>
              <span className="text-sm text-gray-500">{categoryInfo?.name}</span>
              <StatusBadge priority={issue.priority} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {issue.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {issue.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
              </div>
              
              {showLocation && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-32">{issue.location.address}</span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{issue.isAnonymous ? 'Anonymous' : 'Citizen Report'}</span>
              </div>
            </div>

            {/* Photo Thumbnail */}
            {issue.photos.length > 0 && (
              <div className="mt-3">
                <img
                  src={issue.photos[0]}
                  alt="Issue photo"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <StatusBadge status={issue.status} />
            
            {showUpvote && (
              <button
                onClick={handleUpvote}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                <span>{issue.upvotes}</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default IssueCard;