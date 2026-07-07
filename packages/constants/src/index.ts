export const USER_ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  PARENT: 'parent',
  ADMIN: 'admin',
} as const;

export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RESUBMIT_REQUESTED: 'resubmit_requested',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  EXCUSED: 'excused',
} as const;

export const NOTIFICATION_CATEGORY = {
  PURCHASE: 'purchase',
  SESSION: 'session',
  ASSIGNMENT: 'assignment',
  CHAT: 'chat',
  BADGE: 'badge',
  CERTIFICATE: 'certificate',
  REFUND: 'refund',
  PAYMENT: 'payment',
} as const;

export const BADGE_ICONS = {
  WELCOME: 'welcome',
  ON_A_ROLL: 'on_a_roll',
  ROCKSTAR: 'rockstar',
} as const;
