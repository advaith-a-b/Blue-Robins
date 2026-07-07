export type NoteCategory = 'Session Notes' | 'Homework' | 'Reflection' | 'General';

export interface Note {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'mentor';
  category: string; // e.g. "Session 1 Homework" or "Session 2 Reflection"
  createdAt: string;
  updatedAt: string;
}
