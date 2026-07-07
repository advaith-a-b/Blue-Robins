export interface Assignment {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  mentorId: string;
  mentorName: string;
  createdAt: string;
}
