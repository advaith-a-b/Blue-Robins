import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDb } from './mockDb';
import {
  User,
  Project,
  Enrollment,
  Session,
  Assignment,
  Submission,
  Badge,
  Certificate,
  Note,
  Notification,
  Chat,
  Message
} from '@bluerobins/types';

interface MockStateContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  projects: Project[];
  enrollments: Enrollment[];
  sessions: Session[];
  assignments: Assignment[];
  submissions: Submission[];
  badges: Badge[];
  certificates: Certificate[];
  notes: Note[];
  notifications: Notification[];
  chats: Chat[];
  messages: Message[];
  db: typeof mockDb;
  refresh: () => void;
}

const MockStateContext = createContext<MockStateContextType | undefined>(undefined);

export const MockStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  
  // Local state replicas to force React re-renders on DB edits
  const [dbState, setDbState] = useState({
    users: mockDb.users,
    projects: mockDb.projects,
    enrollments: mockDb.enrollments,
    sessions: mockDb.sessions,
    assignments: mockDb.assignments,
    submissions: mockDb.submissions,
    badges: mockDb.badges,
    certificates: mockDb.certificates,
    notes: mockDb.notes,
    notifications: mockDb.notifications,
    chats: mockDb.chats,
    messages: mockDb.messages,
  });

  const refresh = () => {
    setDbState({
      users: mockDb.users,
      projects: mockDb.projects,
      enrollments: mockDb.enrollments,
      sessions: mockDb.sessions,
      assignments: mockDb.assignments,
      submissions: mockDb.submissions,
      badges: mockDb.badges,
      certificates: mockDb.certificates,
      notes: mockDb.notes,
      notifications: mockDb.notifications,
      chats: mockDb.chats,
      messages: mockDb.messages,
    });
  };

  // Sync current user logic
  useEffect(() => {
    const cachedUser = localStorage.getItem('bluerobins_current_user');
    if (cachedUser) {
      setCurrentUserState(JSON.parse(cachedUser));
    } else {
      // Default to Pooja Jain (student) if none set
      const defaultStudent = mockDb.users.find(u => u.role === 'student') || null;
      if (defaultStudent) {
        setCurrentUserState(defaultStudent);
        localStorage.setItem('bluerobins_current_user', JSON.stringify(defaultStudent));
      }
    }
  }, []);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('bluerobins_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bluerobins_current_user');
    }
  };

  // Listen to window-level custom events to sync across tabs/sub-apps
  useEffect(() => {
    const handleUpdate = () => {
      refresh();
      // Sync cached user as well
      const cached = localStorage.getItem('bluerobins_current_user');
      if (cached) {
        setCurrentUserState(JSON.parse(cached));
      }
    };
    
    window.addEventListener('bluerobins_db_update', handleUpdate);
    return () => {
      window.removeEventListener('bluerobins_db_update', handleUpdate);
    };
  }, []);

  return (
    <MockStateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        ...dbState,
        db: mockDb,
        refresh,
      }}
    >
      {children}
    </MockStateContext.Provider>
  );
};

export const useMockState = () => {
  const context = useContext(MockStateContext);
  if (!context) {
    throw new Error('useMockState must be used within a MockStateProvider');
  }
  return context;
};
