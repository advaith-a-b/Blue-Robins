import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge, Avatar } from '@bluerobins/ui';
import { formatDate, formatCurrency } from '@bluerobins/utils';
import { ShieldCheck, ShieldAlert, Receipt, Search, Users as UsersIcon, CreditCard } from 'lucide-react';
import { IMAGES } from '@bluerobins/assets';

export default function HomeDashboard() {
  const { users, projects, enrollments, db, refresh } = useMockState();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'billing'>('users');

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getProjectTitle = (id: string) => projects.find((p) => p.id === id)?.title || 'Course';
  const getStudentName = (id: string) => users.find((u) => u.id === id)?.name || 'Student';

  // Calculate gross revenue (active + completed)
  const paidEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'completed');
  const grossRevenue = paidEnrollments.length * 499;

  const handleRefund = (enrollmentId: string) => {
    if (confirm('Are you sure you want to approve this refund? This will cancel the course enrollment.')) {
      db.processRefund(enrollmentId);
      alert('Refund successfully processed. Student has been notified.');
      refresh();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">
          ⚙️
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Administration Console</h1>
          <p className="text-slate-500 text-sm mt-1">Manage user account permissions, review transactions, and audit refund approvals.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{users.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">👥</div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Gross Revenue</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{formatCurrency(grossRevenue)}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">💵</div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Enrollments</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {enrollments.filter((e) => e.status === 'active').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-xl">📁</div>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Refunded Accounts</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {enrollments.filter((e) => e.status === 'refunded').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl">🛡️</div>
          </CardContent>
        </Card>
      </div>

      {/* Main controller card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-1 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'users' ? 'border-[#354E80] text-[#354E80]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                User Accounts
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`pb-1 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'billing' ? 'border-[#354E80] text-[#354E80]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Billing Logs & Refunds
              </button>
            </div>

            {/* Local table Search */}
            <div className="w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tab Render: Users list */}
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-3 rounded-l-xl">User Profile</th>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 rounded-r-xl">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.name} size="sm" />
                        <span className="font-bold text-slate-800">{u.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          u.role === 'admin' ? 'danger' :
                          u.role === 'mentor' ? 'warning' :
                          u.role === 'student' ? 'primary' : 'success'
                        }>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Tab Render: Billing & Refunds
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-3 rounded-l-xl">Student Name</th>
                    <th className="px-6 py-3">Mentorship Project</th>
                    <th className="px-6 py-3">Tuition Cost</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enrollments.map((enroll) => (
                    <tr key={enroll.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {getStudentName(enroll.studentId)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-500 max-w-xs truncate">
                        {getProjectTitle(enroll.projectId)}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-800">{formatCurrency(499)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={enroll.status === 'refunded' ? 'danger' : 'success'}>
                          {enroll.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {enroll.status === 'active' ? (
                          <Button
                            variant="danger"
                            size="sm"
                            className="py-1 px-3 text-[10px] rounded-lg"
                            onClick={() => handleRefund(enroll.id)}
                          >
                            Approve Refund
                          </Button>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[10px] uppercase">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
