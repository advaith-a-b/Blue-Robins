export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  
  // Student Portal
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PROJECTS: '/student/projects',
    PROJECT_DETAILS: (id: string) => `/student/projects/${id}`,
    ASSIGNMENTS: '/student/assignments',
    NOTES: '/student/notes',
    ACHIEVEMENTS: '/student/achievements',
    BILLING: '/student/billing',
    HELP: '/student/help',
    SETTINGS: '/student/settings',
    PROFILE: '/student/profile',
  },

  // Mentor Portal
  MENTOR: {
    DASHBOARD: '/mentor/dashboard',
    PROJECTS: '/mentor/projects',
    SESSIONS: '/mentor/sessions',
    ASSIGNMENTS: '/mentor/assignments',
    GRADING: '/mentor/grading',
    NOTES: '/mentor/notes',
    BADGES: '/mentor/badges',
    SETTINGS: '/mentor/settings',
  },

  // Parent Portal
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILD_PROGRESS: (childId: string) => `/parent/child/${childId}`,
    BILLING: '/parent/billing',
    NOTIFICATIONS: '/parent/notifications',
    SETTINGS: '/parent/settings',
  },

  // Admin Portal
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PROJECTS: '/admin/projects',
    BILLING: '/admin/billing',
    MODERATION: '/admin/moderation',
    AUDIT_LOGS: '/admin/audit-logs',
    SETTINGS: '/admin/settings',
  },
} as const;

export const APP_THEME = {
  primary: '#354E80', // BlueRobins slate blue
  secondary: '#F59E0B', // Highlight/Amber Orange
  accent: '#10B981', // Success/Green
  danger: '#EF4444', // Danger/Red
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
} as const;
