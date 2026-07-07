export interface Session {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  date: string; // ISO Date String
  startTime: string; // e.g. "10:00 PM"
  endTime: string; // e.g. "10:30 PM"
  meetingUrl?: string; // Zoom or Google Meet Link
  mentorId: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface Attendance {
  id: string;
  sessionId: string;
  projectId: string;
  studentId: string;
  status: AttendanceStatus;
  recordedAt: string;
}
