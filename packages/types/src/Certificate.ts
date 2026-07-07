export interface Certificate {
  id: string;
  projectId: string;
  projectName: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  issuedAt: string;
  certificateUrl: string; // PDF link or route
}
