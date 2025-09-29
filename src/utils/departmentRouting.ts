
import { IssueCategory, Department } from '../types';

// Department routing based on issue category and location
export const getDepartmentForIssue = (category: IssueCategory, location?: { lat: number; lng: number }): Department => {
  const departments: Department[] = [
    {
      id: 'road-maintenance',
      name: 'Road Maintenance',
      categories: ['potholes', 'infrastructure'],
      responseTime: 24,
      rating: 4.2,
      staff: ['john.doe@city.gov', 'jane.smith@city.gov'],
      impactScore: 8.5,
      contactEmail: 'roads@city.gov',
      contactPhone: '+1-555-ROAD-001'
    },
    {
      id: 'sanitation',
      name: 'Sanitation Department',
      categories: ['garbage', 'pollution'],
      responseTime: 12,
      rating: 4.5,
      staff: ['cleanup@city.gov', 'waste@city.gov'],
      impactScore: 7.8,
      contactEmail: 'sanitation@city.gov',
      contactPhone: '+1-555-SANI-001'
    },
    {
      id: 'electrical',
      name: 'Electrical Department',
      categories: ['streetlights'],
      responseTime: 6,
      rating: 4.7,
      staff: ['electrical@city.gov'],
      impactScore: 9.1,
      contactEmail: 'electrical@city.gov',
      contactPhone: '+1-555-ELEC-001'
    },
    {
      id: 'water',
      name: 'Water Department',
      categories: ['water-leaks'],
      responseTime: 4,
      rating: 4.8,
      staff: ['water@city.gov', 'emergency@city.gov'],
      impactScore: 9.5,
      contactEmail: 'water@city.gov',
      contactPhone: '+1-555-WATER-001'
    },
    {
      id: 'traffic',
      name: 'Traffic Management',
      categories: ['traffic'],
      responseTime: 8,
      rating: 4.3,
      staff: ['traffic@city.gov'],
      impactScore: 8.2,
      contactEmail: 'traffic@city.gov',
      contactPhone: '+1-555-TRAF-001'
    },
    {
      id: 'environmental',
      name: 'Environmental Department',
      categories: ['noise', 'pollution'],
      responseTime: 48,
      rating: 4.0,
      staff: ['environment@city.gov'],
      impactScore: 6.5,
      contactEmail: 'environment@city.gov',
      contactPhone: '+1-555-ENV-001'
    },
    {
      id: 'public-safety',
      name: 'Public Safety',
      categories: ['public-safety'],
      responseTime: 2,
      rating: 4.9,
      staff: ['safety@city.gov', 'emergency@city.gov'],
      impactScore: 9.8,
      contactEmail: 'safety@city.gov',
      contactPhone: '+1-555-SAFE-001'
    },
    {
      id: 'general',
      name: 'General Services',
      categories: ['other'],
      responseTime: 72,
      rating: 3.8,
      staff: ['general@city.gov'],
      impactScore: 5.2,
      contactEmail: 'general@city.gov',
      contactPhone: '+1-555-GEN-001'
    }
  ];

  // Find department by category
  const department = departments.find(dept => dept.categories.includes(category));
  
  if (!department) {
    return departments[departments.length - 1]; // Return general department as fallback
  }

  // Apply location-based routing logic if needed
  if (location) {
    // Could add location-based routing logic here
    // For example, different departments for different city zones
  }

  return department;
};

// Calculate impact score based on resolution metrics
export const calculateImpactScore = (
  resolvedIssues: number,
  totalIssues: number,
  averageResponseTime: number,
  citizenRating: number
): number => {
  const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;
  const responseScore = Math.max(0, 10 - (averageResponseTime / 24)); // Penalize longer response times
  const ratingScore = citizenRating * 2; // Convert 5-star rating to 10-point scale
  
  return Math.round(((resolutionRate * 0.4) + (responseScore * 0.3) + (ratingScore * 0.3)) * 10) / 10;
};

// Get department performance metrics
export const getDepartmentPerformance = (department: Department) => {
  return {
    name: department.name,
    impactScore: department.impactScore,
    responseTime: department.responseTime,
    rating: department.rating,
    contactInfo: {
      email: department.contactEmail,
      phone: department.contactPhone
    }
  };
};
