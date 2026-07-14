import { useMockState } from '@bluerobins/api';
import { User, Project, Enrollment, Assignment, Submission } from '@bluerobins/types';

// HOOK 1: Authentication & Role Switcher state
export function useAuth() {
  const { currentUser, setCurrentUser, users, db } = useMockState();

  const switchRole = (role: 'student' | 'mentor' | 'parent' | 'admin') => {
    // Find first user with that role
    const matched = users.find((u) => u.role === role) || null;
    if (matched) {
      setCurrentUser(matched);
      // Trigger update event to notify all apps
      window.dispatchEvent(new Event('bluerobins_db_update'));
    }
  };

  return {
    user: currentUser,
    users,
    isAuthenticated: !!currentUser,
    switchRole,
    setUser: setCurrentUser,
    db,
    notifications: db.notifications,
  };
}

// HOOK 2: Project list and filters
export function useProjects() {
  const { projects, enrollments, currentUser } = useMockState();

  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === currentUser?.id
  );

  const studentProjects = projects.filter((p) =>
    studentEnrollments.some((e) => e.projectId === p.id && e.status !== 'refunded')
  );

  const getEnrollmentForProject = (projectId: string) => {
    return studentEnrollments.find((e) => e.projectId === projectId);
  };

  const getMentorProjects = (mentorId: string) => {
    return projects.filter((p) => p.mentorId === mentorId);
  };

  return {
    allProjects: projects,
    studentProjects,
    studentEnrollments,
    getEnrollmentForProject,
    getMentorProjects,
  };
}

// HOOK 3: Assignments & Submissions queue
export function useAssignments() {
  const { assignments, submissions, currentUser, db } = useMockState();

  // Get all assignments for projects student is active in
  const getStudentAssignments = () => {
    const activeProjectIds = db.enrollments
      .filter((e) => e.studentId === currentUser?.id && e.status !== 'refunded')
      .map((e) => e.projectId);

    return assignments.filter((a) => activeProjectIds.includes(a.projectId));
  };

  // Find student submission for a specific assignment
  const getStudentSubmission = (assignmentId: string) => {
    return submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === currentUser?.id
    );
  };

  const uploadAssignment = (assignmentId: string, assignmentTitle: string, projectId: string, projectName: string, fileUrl: string, fileName: string, fileType: string, submittedText: string) => {
    if (!currentUser) return;
    db.addSubmission({
      assignmentId,
      assignmentTitle,
      projectId,
      projectName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      fileUrl,
      fileName,
      fileType,
      submittedText,
    });
  };

  return {
    allAssignments: assignments,
    studentAssignments: getStudentAssignments(),
    submissions,
    getStudentSubmission,
    uploadAssignment,
  };
}
