import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  CreditCard,
  Bell,
  ChevronDown,
  MessageSquare,
  Search
} from 'lucide-react';
import { useAuth } from '@bluerobins/hooks';
import { Avatar, Badge } from '@bluerobins/ui';

export default function DashboardLayout() {
  const { user, switchRole, users } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Force role to admin upon mount if not set to admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      const defaultAdmin = users.find(u => u.role === 'admin');
      if (defaultAdmin) {
        switchRole('admin');
      }
    }
  }, [user]);

  const menuItems = [
    { name: 'Admin Console', path: '/dashboard', icon: Home },
  ];

  const handleRoleChange = (role: 'student' | 'mentor' | 'parent' | 'admin') => {
    setShowRoleDropdown(false);
    switchRole(role);
    const ports = {
      student: 3000,
      mentor: 3001,
      parent: 3002,
      admin: 3003
    };
    if (role !== 'admin') {
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
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-white text-lg">
            B
          </div>
          <span className="text-xl font-bold tracking-tight">bluerobins</span>
        </div>

        <div className="px-6 py-2">
          <Badge variant="danger" className="text-[9px] py-1 font-extrabold tracking-widest bg-red-500/10 border-red-500/20 text-red-400">
            SYSTEM ADMIN
          </Badge>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
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
          <div className="w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search administration settings..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#354E80]"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 transition-all active:scale-95">
              <MessageSquare className="w-5 h-5" />
            </button>

            <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 transition-all active:scale-95 relative">
              <Bell className="w-5 h-5" />
            </button>

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
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#354E80] font-medium"
                  >
                    <span>Pooja Jain (Student)</span>
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
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#354E80] font-medium flex items-center justify-between"
                  >
                    <span>Admin Panel</span>
                    <Badge variant="success">Active</Badge>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
