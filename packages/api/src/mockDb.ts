import {
  User,
  Student,
  Mentor,
  Parent,
  Project,
  Enrollment,
  Session,
  Attendance,
  Assignment,
  Submission,
  Badge,
  Certificate,
  Notification,
  Chat,
  Message,
  Note
} from '@bluerobins/types';
import { IMAGES } from '@bluerobins/assets';
import { calculateStudentRating } from '@bluerobins/utils';

// DEFAULT SEED DATA
const defaultUsers: User[] = [
  {
    id: 'student-pooja',
    email: 'pooja@bluerobins.com',
    name: 'Pooja Jain',
    role: 'student',
    avatar: IMAGES.studentAvatar,
    createdAt: '2025-06-01T00:00:00Z',
  } as Student,
  {
    id: 'mentor-yashvi',
    email: 'yashvi@bluerobins.com',
    name: 'Yashvi',
    role: 'mentor',
    avatar: IMAGES.mentorAvatar1,
    createdAt: '2025-05-01T00:00:00Z',
  } as Mentor,
  {
    id: 'mentor-anirudh',
    email: 'anirudh@bluerobins.com',
    name: 'Anirudh S',
    role: 'mentor',
    avatar: IMAGES.mentorAvatar2,
    createdAt: '2025-05-01T00:00:00Z',
  } as Mentor,
  {
    id: 'mentor-john',
    email: 'john@bluerobins.com',
    name: 'John Walker',
    role: 'mentor',
    avatar: IMAGES.mentorAvatar3,
    createdAt: '2025-05-01T00:00:00Z',
  } as Mentor,
  {
    id: 'parent-jain',
    email: 'parent.jain@gmail.com',
    name: 'Mr. Jain',
    role: 'parent',
    avatar: IMAGES.parentAvatar,
    createdAt: '2025-06-01T00:00:00Z',
  } as Parent,
  {
    id: 'admin-user',
    email: 'admin@bluerobins.com',
    name: 'Admin User',
    role: 'admin',
    avatar: IMAGES.adminAvatar,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

const defaultProjects: Project[] = [
  {
    id: 'proj-heart-failure',
    title: 'Heart Failure Risk Prediction with Interpretable ML',
    description: 'Understanding the use of AI. Create a basic summary of heart failure using an AI of your choice.',
    mentorId: 'mentor-yashvi',
    mentorName: 'Yashvi',
    mentorAvatar: IMAGES.mentorAvatar1,
    capacity: 15,
    enrolledCount: 12,
    durationWeeks: 8,
    status: 'in_progress',
    startDate: '2025-06-15T00:00:00Z',
    endDate: '2025-08-15T00:00:00Z',
    thumbnailUrl: IMAGES.heartFailure,
    completionCriteria: { attendanceRate: 80, assignmentsCompleted: 4, mentorApprovalRequired: true },
  },
  {
    id: 'proj-drones',
    title: 'Drones: Concepts, building and execution',
    description: 'Learn drone aerodynamics, assembly, calibration and manual execution protocols.',
    mentorId: 'mentor-yashvi',
    mentorName: 'Yashvi',
    mentorAvatar: IMAGES.mentorAvatar1,
    capacity: 10,
    enrolledCount: 8,
    durationWeeks: 8,
    status: 'not_started',
    startDate: '2025-07-20T00:00:00Z',
    endDate: '2025-09-20T00:00:00Z',
    thumbnailUrl: IMAGES.drones,
    completionCriteria: { attendanceRate: 90, assignmentsCompleted: 5, mentorApprovalRequired: true },
  },
  {
    id: 'proj-wind-tunnels',
    title: 'Utilizing wind tunnels as an energy source',
    description: 'Examine renewable aerodynamics utilizing wind tunnel tests for micro-generation designs.',
    mentorId: 'mentor-yashvi',
    mentorName: 'Yashvi',
    mentorAvatar: IMAGES.mentorAvatar1,
    capacity: 12,
    enrolledCount: 12,
    durationWeeks: 8,
    status: 'completed',
    startDate: '2025-04-10T00:00:00Z',
    endDate: '2025-06-10T00:00:00Z',
    thumbnailUrl: IMAGES.windTunnels,
    completionCriteria: { attendanceRate: 80, assignmentsCompleted: 6, mentorApprovalRequired: true },
  },
  {
    id: 'proj-dance-quant',
    title: 'On the Beat Quantifying Dance Timing and Form from Pose Data',
    description: 'Analyze skeletal coordinates extracted from camera feeds to score performance metrics.',
    mentorId: 'mentor-anirudh',
    mentorName: 'Anirudh S',
    mentorAvatar: IMAGES.mentorAvatar2,
    capacity: 8,
    enrolledCount: 5,
    durationWeeks: 8,
    status: 'not_started',
    startDate: '2025-08-14T00:00:00Z',
    endDate: '2025-10-14T00:00:00Z',
    thumbnailUrl: IMAGES.dancePose,
    completionCriteria: { attendanceRate: 85, assignmentsCompleted: 5, mentorApprovalRequired: true },
  },
];

const defaultEnrollments: Enrollment[] = [
  {
    id: 'enroll-1',
    projectId: 'proj-heart-failure',
    studentId: 'student-pooja',
    status: 'active',
    progressSessions: 3,
    totalSessions: 12,
    enrolledAt: '2025-06-10T00:00:00Z',
  },
  {
    id: 'enroll-2',
    projectId: 'proj-drones',
    studentId: 'student-pooja',
    status: 'active',
    progressSessions: 0,
    totalSessions: 12,
    enrolledAt: '2025-06-12T00:00:00Z',
  },
  {
    id: 'enroll-3',
    projectId: 'proj-wind-tunnels',
    studentId: 'student-pooja',
    status: 'completed',
    progressSessions: 12,
    totalSessions: 12,
    enrolledAt: '2025-04-05T00:00:00Z',
  },
];

const defaultSessions: Session[] = [
  {
    id: 'sess-1',
    projectId: 'proj-heart-failure',
    title: 'Session 3: ML Interpretability with SHAP/LIME',
    description: 'Diving deep into model visualization.',
    date: new Date().toISOString(), // Today
    startTime: '5:00 PM',
    endTime: '5:30 PM',
    meetingUrl: 'https://zoom.us/j/123456789',
    mentorId: 'mentor-yashvi',
  },
  {
    id: 'sess-2',
    projectId: 'proj-drones',
    title: 'Session 1: Aerodynamics Principles',
    description: 'Introduction to drag and lift vectors.',
    date: new Date().toISOString(), // Today
    startTime: '5:00 PM',
    endTime: '5:30 PM',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    mentorId: 'mentor-yashvi',
  },
  {
    id: 'sess-3',
    projectId: 'proj-wind-tunnels',
    title: 'Session 12: Final Project Presentations',
    description: 'Students defend wind tunnel designs.',
    date: new Date().toISOString(), // Today
    startTime: '5:00 PM',
    endTime: '5:30 PM',
    meetingUrl: 'https://zoom.us/j/987654321',
    mentorId: 'mentor-yashvi',
  },
  {
    id: 'sess-4',
    projectId: 'proj-dance-quant',
    title: 'Session 1: Introductory skeletal modeling',
    description: 'Visual tracking setup.',
    date: '2025-08-14T22:00:00Z',
    startTime: '10:00 PM',
    endTime: '10:30 PM',
    meetingUrl: 'https://meet.google.com/xyz-1234-uvw',
    mentorId: 'mentor-anirudh',
  },
];

const defaultAssignments: Assignment[] = [
  {
    id: 'assign-1',
    projectId: 'proj-heart-failure',
    projectName: 'Heart Failure Risk Prediction with Interpretable ML',
    title: 'Session 3 Assignment',
    description: 'Understanding the use of AI. Create a basic summary of heart failure using an AI of your choice.',
    dueDate: '2025-06-30T23:59:59Z',
    mentorId: 'mentor-yashvi',
    mentorName: 'Yashvi',
    createdAt: '2025-06-23T00:00:00Z',
  },
  {
    id: 'assign-2',
    projectId: 'proj-heart-failure',
    projectName: 'Heart Failure Risk Prediction with Interpretable ML',
    title: 'Session 2 Assignment',
    description: 'Prepare your guide to Generative AI model training pipelines.',
    dueDate: '2025-06-23T23:59:59Z',
    mentorId: 'mentor-yashvi',
    mentorName: 'Yashvi',
    createdAt: '2025-06-16T00:00:00Z',
  },
];

const defaultSubmissions: Submission[] = [
  {
    id: 'sub-2',
    assignmentId: 'assign-2',
    assignmentTitle: 'Session 2 Assignment',
    projectId: 'proj-heart-failure',
    projectName: 'Heart Failure Risk Prediction with Interpretable ML',
    studentId: 'student-pooja',
    studentName: 'Pooja Jain',
    status: 'graded',
    fileUrl: '/mock/docs/guide_to_gen_ai.pdf',
    fileName: 'guide_to_gen_ai.pdf',
    fileType: 'PDF',
    submittedAt: '2025-06-22T14:30:00Z',
    grade: 'A',
    feedback: 'Fantastic analysis, very clear details on SHAP values.',
    reviewedBy: 'mentor-yashvi',
    reviewedAt: '2025-06-23T09:00:00Z',
    isLate: false,
  },
];

const defaultBadges: Badge[] = [
  {
    id: 'badge-1',
    title: 'Welcome!',
    description: 'Start your first ever Project.',
    iconName: 'welcome',
    awardedTo: 'student-pooja',
    awardedBy: 'mentor-john',
    awardedByName: 'John Walker',
    awardedAt: '2025-06-16T10:00:00Z',
  },
  {
    id: 'badge-2',
    title: 'On a roll!',
    description: 'Complete your first assignment!',
    iconName: 'on_a_roll',
    awardedTo: 'student-pooja',
    awardedBy: 'mentor-john',
    awardedByName: 'John Walker',
    awardedAt: '2025-06-23T11:00:00Z',
  },
  {
    id: 'badge-3',
    title: 'Rockstar!',
    description: 'Complete a Project, without missing any deadlines.',
    iconName: 'rockstar',
    awardedTo: 'student-pooja',
    awardedBy: 'mentor-john',
    awardedByName: 'John Walker',
    awardedAt: '2025-06-25T15:00:00Z',
  },
];

const defaultCertificates: Certificate[] = [
  {
    id: 'cert-1',
    projectId: 'proj-wind-tunnels',
    projectName: 'Utilizing wind tunnels as an energy source',
    studentId: 'student-pooja',
    studentName: 'Pooja Jain',
    mentorId: 'mentor-yashvi',
    mentorName: 'Yashvi',
    issuedAt: '2025-06-10T12:00:00Z',
    certificateUrl: '/mock/certificates/utilizing_wind_tunnels.pdf',
  },
];

const defaultNotes: Note[] = [
  {
    id: 'note-1',
    projectId: 'proj-heart-failure',
    projectName: 'Heart Failure Risk Prediction with Interpretable ML',
    title: 'Ways to tackle the assignment',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Focus on SHAP feature importance charts. Prepare model prediction graphs.',
    authorId: 'mentor-john',
    authorName: 'John Walker',
    authorRole: 'mentor',
    category: 'Session 1 Homework',
    createdAt: '2025-06-23T10:00:00Z',
    updatedAt: '2025-06-23T10:00:00Z',
  },
  {
    id: 'note-2',
    projectId: 'proj-heart-failure',
    projectName: 'Heart Failure Risk Prediction with Interpretable ML',
    title: 'My thoughts on Session 2',
    content: 'Reviewing model architectures. SHAP is extremely helpful in understanding heart disease feature dependencies.',
    authorId: 'student-pooja',
    authorName: 'Pooja Jain',
    authorRole: 'student',
    category: 'Session 2 Reflection',
    createdAt: '2025-06-23T12:00:00Z',
    updatedAt: '2025-06-23T12:00:00Z',
  },
];

const defaultNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-pooja',
    title: 'Assignment Graded',
    content: 'Your Session 2 Assignment has been graded A by Yashvi.',
    type: 'success',
    category: 'assignment',
    isRead: false,
    createdAt: '2025-06-23T09:05:00Z',
  },
  {
    id: 'notif-2',
    userId: 'student-pooja',
    title: 'New Session Added',
    content: 'Session 1 for Drones starts today at 5:00 PM.',
    type: 'info',
    category: 'session',
    isRead: true,
    createdAt: '2025-06-24T08:00:00Z',
  },
];

const defaultChats: Chat[] = [
  {
    id: 'chat-yashvi',
    type: 'direct',
    participantIds: ['student-pooja', 'mentor-yashvi'],
    updatedAt: '2025-06-24T18:00:00Z',
  },
  {
    id: 'chat-group-heart',
    name: 'Heart Failure ML Group',
    projectId: 'proj-heart-failure',
    type: 'group',
    participantIds: ['student-pooja', 'mentor-yashvi', 'mentor-john'],
    updatedAt: '2025-06-24T12:00:00Z',
  },
];

const defaultMessages: Message[] = [
  {
    id: 'msg-1',
    chatId: 'chat-yashvi',
    senderId: 'mentor-yashvi',
    senderName: 'Yashvi',
    senderAvatar: IMAGES.mentorAvatar1,
    content: 'Hi Pooja, how is progress on the ML assignment going?',
    createdAt: '2025-06-24T17:58:00Z',
  },
  {
    id: 'msg-2',
    chatId: 'chat-yashvi',
    senderId: 'student-pooja',
    senderName: 'Pooja Jain',
    senderAvatar: IMAGES.studentAvatar,
    content: 'Just uploading it now! I used SHAP analysis as John suggested.',
    createdAt: '2025-06-24T18:00:00Z',
  },
];

// STATE DATABASE ADAPTER WITH LOCALSTORAGE PERSISTENCE
class MockDatabase {
  private get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(`bluerobins_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bluerobins_${key}`, JSON.stringify(value));
      // Trigger a custom event to notify listeners about structural updates
      window.dispatchEvent(new Event('bluerobins_db_update'));
    }
  }

  public reset(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.dispatchEvent(new Event('bluerobins_db_update'));
    }
  }

  // Getters
  get users(): User[] { return this.get('users', defaultUsers); }
  get projects(): Project[] { return this.get('projects', defaultProjects); }
  get enrollments(): Enrollment[] { return this.get('enrollments', defaultEnrollments); }
  get sessions(): Session[] { return this.get('sessions', defaultSessions); }
  get assignments(): Assignment[] { return this.get('assignments', defaultAssignments); }
  get submissions(): Submission[] { return this.get('submissions', defaultSubmissions); }
  get badges(): Badge[] { return this.get('badges', defaultBadges); }
  get certificates(): Certificate[] { return this.get('certificates', defaultCertificates); }
  get notes(): Note[] { return this.get('notes', defaultNotes); }
  get notifications(): Notification[] { return this.get('notifications', defaultNotifications); }
  get chats(): Chat[] { return this.get('chats', defaultChats); }
  get messages(): Message[] { return this.get('messages', defaultMessages); }

  // Setters
  set users(val: User[]) { this.set('users', val); }
  set projects(val: Project[]) { this.set('projects', val); }
  set enrollments(val: Enrollment[]) { this.set('enrollments', val); }
  set sessions(val: Session[]) { this.set('sessions', val); }
  set assignments(val: Assignment[]) { this.set('assignments', val); }
  set submissions(val: Submission[]) { this.set('submissions', val); }
  set badges(val: Badge[]) { this.set('badges', val); }
  set certificates(val: Certificate[]) { this.set('certificates', val); }
  set notes(val: Note[]) { this.set('notes', val); }
  set notifications(val: Notification[]) { this.set('notifications', val); }
  set chats(val: Chat[]) { this.set('chats', val); }
  set messages(val: Message[]) { this.set('messages', val); }

  // Mutation helpers (Interactive states)
  public addSubmission(submission: Omit<Submission, 'id' | 'submittedAt' | 'status' | 'isLate'>): Submission {
    const list = this.submissions;
    const assignment = this.assignments.find(a => a.id === submission.assignmentId);
    const isLate = assignment ? new Date().getTime() > new Date(assignment.dueDate).getTime() : false;
    
    const newSub: Submission = {
      ...submission,
      id: `sub-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      isLate,
    };
    this.submissions = [...list, newSub];

    // Trigger parent & student notifications
    this.addNotification('student-pooja', 'Assignment Uploaded', `You submitted ${newSub.assignmentTitle} successfully.`, 'success', 'assignment');
    this.addNotification('mentor-yashvi', 'New Submission', `${newSub.studentName} submitted ${newSub.assignmentTitle}.`, 'info', 'assignment');

    return newSub;
  }

  public gradeSubmission(submissionId: string, grade: string, feedback: string, mentorId: string): void {
    const subList = this.submissions;
    const index = subList.findIndex(s => s.id === submissionId);
    if (index === -1) return;

    const sub = subList[index];
    sub.status = 'graded';
    sub.grade = grade;
    sub.feedback = feedback;
    sub.reviewedBy = mentorId;
    sub.reviewedAt = new Date().toISOString();
    
    this.submissions = [...subList];

    // Update student ratings automatically on grade if late
    if (sub.isLate) {
      const studentId = sub.studentId;
      const userList = this.users;
      const userIdx = userList.findIndex(u => u.id === studentId);
      if (userIdx !== -1) {
        const student = userList[userIdx] as Student;
        // Count late submissions of student
        const lates = this.submissions.filter(s => s.studentId === studentId && s.isLate && s.status === 'graded').length;
        student.rating = calculateStudentRating(5.0, lates);
        this.users = [...userList];
      }
    }

    this.addNotification(sub.studentId, 'Assignment Graded', `Your submission for ${sub.assignmentTitle} was graded ${grade}.`, 'success', 'assignment');
  }

  public addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const list = this.notes;
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes = [...list, newNote];
    return newNote;
  }

  public updateNote(noteId: string, content: string): void {
    const list = this.notes;
    const idx = list.findIndex(n => n.id === noteId);
    if (idx === -1) return;
    list[idx].content = content;
    list[idx].updatedAt = new Date().toISOString();
    this.notes = [...list];
  }

  public awardBadge(studentId: string, title: string, description: string, iconName: string, mentorId: string, mentorName: string): void {
    const list = this.badges;
    const newBadge: Badge = {
      id: `badge-${Date.now()}`,
      title,
      description,
      iconName,
      awardedTo: studentId,
      awardedBy: mentorId,
      awardedByName: mentorName,
      awardedAt: new Date().toISOString(),
    };
    this.badges = [...list, newBadge];

    this.addNotification(studentId, 'Badge Awarded!', `You received the "${title}" badge!`, 'success', 'badge');
  }

  public issueCertificate(projectId: string, studentId: string, mentorId: string): void {
    const project = this.projects.find(p => p.id === projectId);
    const student = this.users.find(u => u.id === studentId);
    const mentor = this.users.find(u => u.id === mentorId);
    
    if (!project || !student || !mentor) return;

    const list = this.certificates;
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      projectId,
      projectName: project.title,
      studentId,
      studentName: student.name,
      mentorId,
      mentorName: mentor.name,
      issuedAt: new Date().toISOString(),
      certificateUrl: `/mock/certificates/${projectId}.pdf`,
    };
    this.certificates = [...list, newCert];

    // Mark enrollment as completed
    const enrolls = this.enrollments;
    const eIdx = enrolls.findIndex(e => e.projectId === projectId && e.studentId === studentId);
    if (eIdx !== -1) {
      enrolls[eIdx].status = 'completed';
      enrolls[eIdx].progressSessions = enrolls[eIdx].totalSessions; // Complete attendance progress
      this.enrollments = [...enrolls];
    }

    this.addNotification(studentId, 'Certificate Issued', `Congratulations! You earned a completion certificate for "${project.title}".`, 'success', 'certificate');
  }

  public sendMessage(chatId: string, senderId: string, senderName: string, content: string): Message {
    const list = this.messages;
    const sender = this.users.find(u => u.id === senderId);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      senderName,
      senderAvatar: sender?.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    this.messages = [...list, newMsg];

    // Update chat last message
    const chatList = this.chats;
    const cIdx = chatList.findIndex(c => c.id === chatId);
    if (cIdx !== -1) {
      chatList[cIdx].lastMessage = newMsg;
      chatList[cIdx].updatedAt = new Date().toISOString();
      this.chats = [...chatList];
    }

    return newMsg;
  }

  public addNotification(userId: string, title: string, content: string, type: 'info' | 'success' | 'warning' | 'error', category: any): void {
    const list = this.notifications;
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      content,
      type,
      category,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications = [...list, newNotif];
  }

  public markNotificationAsRead(id: string): void {
    const list = this.notifications;
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx].isRead = true;
      this.notifications = [...list];
    }
  }

  public processRefund(enrollmentId: string): void {
    const enrolls = this.enrollments;
    const idx = enrolls.findIndex(e => e.id === enrollmentId);
    if (idx !== -1) {
      enrolls[idx].status = 'refunded';
      this.enrollments = [...enrolls];
      this.addNotification(enrolls[idx].studentId, 'Refund Processed', `Your refund for project enrollment has been approved.`, 'warning', 'refund');
    }
  }
}

export const mockDb = new MockDatabase();
export default mockDb;
