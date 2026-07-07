export type SubmissionStatus = 'submitted' | 'graded' | 'resubmit_requested';

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  projectId: string;
  projectName: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  status: SubmissionStatus;
  fileUrl?: string;
  fileName?: string;
  fileType?: string; // e.g. "PDF", "ZIP", "URL", "Text"
  submittedText?: string;
  submittedAt: string;
  grade?: string;
  feedback?: string;
  reviewedBy?: string; // mentorId
  reviewedAt?: string;
  isLate: boolean;
}
