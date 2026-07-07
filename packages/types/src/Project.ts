export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

export interface CompletionCriteria {
  attendanceRate: number; // e.g. 80 (for 80%)
  assignmentsCompleted: number; // e.g. 5 (out of 6)
  mentorApprovalRequired: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  capacity: number;
  enrolledCount: number;
  durationWeeks: number; // Default 8 weeks
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  thumbnailUrl?: string;
  completionCriteria: CompletionCriteria;
}

export interface Enrollment {
  id: string;
  projectId: string;
  studentId: string;
  status: 'active' | 'completed' | 'refunded';
  progressSessions: number; // e.g. 3 sessions completed out of 12
  totalSessions: number; // e.g. 12
  enrolledAt: string;
}
