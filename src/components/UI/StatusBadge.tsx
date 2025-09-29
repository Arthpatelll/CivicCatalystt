import React from 'react';
import { IssueStatus, Priority } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';

interface StatusBadgeProps {
  status?: IssueStatus;
  priority?: Priority;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, className = '' }) => {
  if (status) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]} ${className}`}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  }

  if (priority) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority]} ${className}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  }

  return null;
};

export default StatusBadge;