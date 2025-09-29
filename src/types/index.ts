export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: Priority;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  videos: string[];
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  upvotes: number;
  isAnonymous: boolean;
  department: string;
}

export type IssueCategory = 
  | 'potholes'
  | 'garbage'
  | 'streetlights'
  | 'water-leaks'
  | 'traffic'
  | 'noise'
  | 'pollution'
  | 'public-safety'
  | 'infrastructure'
  | 'other';

export type IssueStatus = 
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'in-progress'
  | 'resolved'
  | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'municipal-staff' | 'admin';
  department?: string;
  preferredLanguage: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Department {
  id: string;
  name: string;
  categories: IssueCategory[];
  responseTime: number; // in hours
  rating: number;
  staff: string[];
  impactScore: number; // 1-10 scale
  contactEmail: string;
  contactPhone: string;
}

export interface Analytics {
  totalIssues: number;
  resolvedIssues: number;
  averageResponseTime: number;
  topCategories: { category: IssueCategory; count: number }[];
  departmentPerformance: { department: string; score: number; responseTime: number }[];
  trendData: { date: string; issues: number; resolved: number }[];
}