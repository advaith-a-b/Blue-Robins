export type UserRole = 'student' | 'mentor' | 'parent' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Student extends User {
  parentId?: string;
  rating: number;
  enrolledProjectsCount: number;
}

export interface Parent extends User {
  childrenIds: string[];
}

export interface Mentor extends User {
  capacity: number;
  rating: number;
  bio?: string;
  specialties: string[];
}
