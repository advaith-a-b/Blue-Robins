import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge, Input } from '@bluerobins/ui';
import { formatDate } from '@bluerobins/utils';
import { Award, ShieldCheck, Milestone } from 'lucide-react';

export default function BadgeIssuer() {
  const { users, projects, enrollments, db, refresh } = useMockState();

  // Badge Form States
  const [selectedStudent, setSelectedStudent] = useState('student-pooja');
  const [badgeTitle, setBadgeTitle] = useState('Welcome!');
  const [badgeDesc, setBadgeDesc] = useState('Start your first ever Project.');
  const [badgeIcon, setBadgeIcon] = useState('welcome');

  // Filter students and enrollments under this mentor
  const mentorProjects = projects.filter((p) => p.mentorId === 'mentor-yashvi');
  const mentorProjectIds = mentorProjects.map((p) => p.id);

  // Enrollments taught by this mentor
  const mentorEnrollments = enrollments.filter((e) => mentorProjectIds.includes(e.projectId));

  const handleAwardBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !badgeTitle || !badgeDesc) return;

    const studentUser = users.find((u) => u.id === selectedStudent);
    if (!studentUser) return;

    db.awardBadge(
      selectedStudent,
      badgeTitle,
      badgeDesc,
      badgeIcon,
      'mentor-yashvi',
      'Yashvi'
    );

    // Reset badge details based on template selection
    alert(`Badge "${badgeTitle}" awarded to ${studentUser.name}!`);
    refresh();
  };

  const handleIssueCert = (enroll: any) => {
    db.issueCertificate(enroll.projectId, enroll.studentId, 'mentor-yashvi');
    alert(`Certificate successfully generated for this course!`);
    refresh();
  };

  const getStudentName = (id: string) => users.find((u) => u.id === id)?.name || 'Student';
  const getProjectTitle = (id: string) => projects.find((p) => p.id === id)?.title || 'Course';

  const badgeTemplates = [
    { title: 'Welcome!', desc: 'Start your first ever Project.', icon: 'welcome' },
    { title: 'On a roll!', desc: 'Complete your first assignment!', icon: 'on_a_roll' },
    { title: 'Rockstar!', desc: 'Complete a Project, without missing any deadlines.', icon: 'rockstar' },
  ];

  const handleSelectTemplate = (tpl: typeof badgeTemplates[0]) => {
    setBadgeTitle(tpl.title);
    setBadgeDesc(tpl.desc);
    setBadgeIcon(tpl.icon);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Badge & Certificate Issuer</h1>
        <p className="text-slate-500 text-sm mt-1">Award achievements and issue PDF completion certificates once criteria are met.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Award Badges Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#354E80]" /> Award Badge
              </h3>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleAwardBadge} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Select Student</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:outline-none focus:border-[#354E80]"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    {users.filter(u => u.role === 'student').map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                {/* Template quick selects */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase block">Template Shortcuts</label>
                  <div className="flex gap-2">
                    {badgeTemplates.map((tpl) => (
                      <button
                        type="button"
                        key={tpl.title}
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`flex-1 text-xs border p-2 rounded-xl text-center font-bold transition-all ${
                          badgeTitle === tpl.title
                            ? 'bg-[#354E80] border-[#354E80] text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {tpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Badge Title"
                  placeholder="e.g. Rockstar!"
                  value={badgeTitle}
                  onChange={(e) => setBadgeTitle(e.target.value)}
                  required
                />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Badge Description</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#354E80]"
                    placeholder="Award rationale detail..."
                    value={badgeDesc}
                    onChange={(e) => setBadgeDesc(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="secondary" className="w-full py-3 text-sm font-extrabold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md">
                  Award Badge
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Issue Course Certificates list */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-[#354E80]" /> Enrolled Student Completion Status
              </h3>
            </div>
            
            <div className="divide-y divide-slate-50">
              {mentorEnrollments.map((enroll) => {
                const isComplete = enroll.progressSessions >= enroll.totalSessions;
                const alreadyIssued = enroll.status === 'completed';

                return (
                  <div key={enroll.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-slate-800 leading-snug">{getStudentName(enroll.studentId)}</p>
                      <p className="text-xs text-slate-400 font-medium truncate w-56">{getProjectTitle(enroll.projectId)}</p>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        Attendance: <span className={isComplete ? 'text-emerald-600 font-bold' : 'text-slate-600 font-bold'}>{enroll.progressSessions} / {enroll.totalSessions} Sessions</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {alreadyIssued ? (
                        <Badge variant="success" className="py-1">Certificate Issued</Badge>
                      ) : (
                        <Button
                          variant={isComplete ? 'primary' : 'outline'}
                          size="sm"
                          disabled={!isComplete}
                          onClick={() => handleIssueCert(enroll)}
                          className={isComplete ? 'bg-emerald-600 hover:bg-emerald-700 border-none' : ''}
                        >
                          {isComplete ? 'Issue Certificate' : 'Incomplete'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
