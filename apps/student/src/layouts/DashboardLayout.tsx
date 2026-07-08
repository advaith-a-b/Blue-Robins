import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Users,
  CreditCard,
  HelpCircle,
  Search,
  MessageSquare,
  Bell,
  ChevronDown,
  User as UserIcon,
  BookMarked,
  FileText,
  Award
} from 'lucide-react';
import { useAuth } from '@bluerobins/hooks';
import { Avatar, Badge } from '@bluerobins/ui';

export default function DashboardLayout() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Read notifications from context to show badge counter
  const { notifications, db } = useAuth(); // useAuth returns context states as well
  const unreadNotifs = notifications ? notifications.filter(n => !n.isRead && n.userId === user?.id) : [];

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'My Projects', path: '/projects', icon: BookOpen },
    { name: 'Assignments', path: '/assignments', icon: BookMarked },
    { name: 'My Notes', path: '/notes', icon: FileText },
    { name: 'Achievements', path: '/achievements', icon: Award },
    { name: 'Billing & Plans', path: '/billing', icon: CreditCard },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  const handleRoleChange = (role: 'student' | 'mentor' | 'parent' | 'admin') => {
    setShowRoleDropdown(false);
    switchRole(role);
    // In a multi-port monorepo, we direct to respective ports
    const ports = {
      student: 3000,
      mentor: 3001,
      parent: 3002,
      admin: 3003
    };
    // If not on student port, redirect window
    if (role !== 'student') {
      window.location.href = `http://localhost:${ports[role]}/`;
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#354E80] text-slate-100 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          {/* BlueRobins logo */}
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-white text-lg">
            B
          </div>
          <span className="text-xl font-bold tracking-tight">bluerobins</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 text-xs text-slate-400 text-center">
          &copy; 2026 BlueRobins Inc.
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10 shrink-0">
          {/* Search bar */}
          <div className="w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for projects, certificates, achievements..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#354E80] focus:ring-1 focus:ring-[#354E80] transition-all duration-200"
            />
          </div>

          {/* User actions */}
          <div className="flex items-center gap-5">
            {/* Chat Icon */}
            <button 
              onClick={() => navigate('/help')}
              className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 transition-all active:scale-95 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale-up">
                  <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <button 
                        onClick={() => {
                          unreadNotifs.forEach(n => db.markNotificationAsRead(n.id));
                          setShowNotifications(false);
                        }}
                        className="text-xs text-[#354E80] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications && notifications.filter(n => n.userId === user?.id).length > 0 ? (
                      notifications
                        .filter(n => n.userId === user?.id)
                        .slice(0, 5)
                        .map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              db.markNotificationAsRead(notif.id);
                              setShowNotifications(false);
                            }}
                            className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-b-0 cursor-pointer transition-all ${
                              !notif.isRead ? 'bg-blue-50/20' : ''
                            }`}
                          >
                            <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{notif.content}</p>
                          </div>
                        ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 border border-slate-100 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
              >
                <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                <div className="text-left hidden md:block select-none">
                  <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale-up">
                  <div className="px-4 py-2 border-b border-slate-50 text-xs text-slate-400 font-bold tracking-wide uppercase select-none">
                    Switch Sandbox View
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#354E80] font-medium flex items-center justify-between"
                  >
                    <span>Pooja Jain (Student)</span>
                    <Badge variant="success">Active</Badge>
                  </button>
                  <button
                    onClick={() => handleRoleChange('mentor')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#354E80] font-medium"
                  >
                    <span>Yashvi (Mentor)</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('parent')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#354E80] font-medium"
                  >
                    <span>Mr. Jain (Parent)</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#354E80] font-medium"
                  >
                    <span>Admin Panel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
