import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './client';
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

interface SupabaseStateContextType {
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
  loading: boolean;
  refresh: () => void;
}

const SupabaseStateContext = createContext<SupabaseStateContextType | undefined>(undefined);

export const SupabaseStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const refresh = async () => {
    // Fetch all data from Supabase
    await Promise.all([
      fetchUsers(),
      fetchProjects(),
      fetchEnrollments(),
      fetchSessions(),
      fetchAssignments(),
      fetchSubmissions(),
      fetchBadges(),
      fetchCertificates(),
      fetchNotes(),
      fetchNotifications(),
      fetchChats(),
      fetchMessages()
    ]);
  };

  // Fetch functions
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    if (data && !error) {
      setUsers(data as User[]);
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    if (data && !error) {
      setProjects(data as Project[]);
    }
  };

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*');
    if (data && !error) {
      setEnrollments(data as Enrollment[]);
    }
  };

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*');
    if (data && !error) {
      setSessions(data as Session[]);
    }
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*');
    if (data && !error) {
      setAssignments(data as Assignment[]);
    }
  };

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*');
    if (data && !error) {
      setSubmissions(data as Submission[]);
    }
  };

  const fetchBadges = async () => {
    const { data, error } = await supabase
      .from('badges')
      .select('*');
    if (data && !error) {
      setBadges(data as Badge[]);
    }
  };

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*');
    if (data && !error) {
      setCertificates(data as Certificate[]);
    }
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*');
    if (data && !error) {
      setNotes(data as Note[]);
    }
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*');
    if (data && !error) {
      setNotifications(data as Notification[]);
    }
  };

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*');
    if (data && !error) {
      setChats(data as Chat[]);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*');
    if (data && !error) {
      setMessages(data as Message[]);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCurrentUserState(profile as User);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCurrentUserState(profile as User);
        }
      } else {
        setCurrentUserState(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!currentUser) return;

    const subscriptions = [
      supabase.channel('projects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchProjects())
        .subscribe(),
      supabase.channel('enrollments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, () => {
          fetchEnrollments();
          fetchProjects(); // Update enrolled counts
        })
        .subscribe(),
      supabase.channel('sessions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, () => fetchSessions())
        .subscribe(),
      supabase.channel('assignments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => fetchAssignments())
        .subscribe(),
      supabase.channel('submissions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
          fetchSubmissions();
          fetchNotifications();
        })
        .subscribe(),
      supabase.channel('badges')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'badges' }, () => {
          fetchBadges();
          fetchNotifications();
        })
        .subscribe(),
      supabase.channel('certificates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => {
          fetchCertificates();
          fetchNotifications();
        })
        .subscribe(),
      supabase.channel('notes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => fetchNotes())
        .subscribe(),
      supabase.channel('notifications')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .subscribe(),
      supabase.channel('chats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => fetchChats())
        .subscribe(),
      supabase.channel('messages')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
          fetchMessages();
          fetchChats();
        })
        .subscribe(),
    ];

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [currentUser]);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
  };

  return (
    <SupabaseStateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        projects,
        enrollments,
        sessions,
        assignments,
        submissions,
        badges,
        certificates,
        notes,
        notifications,
        chats,
        messages,
        loading,
        refresh,
      }}
    >
      {children}
    </SupabaseStateContext.Provider>
  );
};

export const useSupabaseState = () => {
  const context = useContext(SupabaseStateContext);
  if (!context) {
    throw new Error('useSupabaseState must be used within a SupabaseStateProvider');
  }
  return context;
};
