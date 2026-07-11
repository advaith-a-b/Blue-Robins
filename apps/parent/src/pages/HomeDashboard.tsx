import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge, Avatar, Progress } from '@bluerobins/ui';
import { formatDate, formatCurrency } from '@bluerobins/utils';
import { ShieldCheck, Award, Receipt, Clock, Star, Calendar } from 'lucide-react';
import { IMAGES } from '@bluerobins/assets';

export default function HomeDashboard() {
  const { users, projects, enrollments, submissions, badges, certificates } = useMockState();

  // Selected Child state
  const childId = 'student-pooja';
  const childUser = users.find((u) => u.id === childId) as any;

  // Filter child's projects
  const childEnrollments = enrollments.filter((e) => e.studentId === childId);
  const childProjects = projects.filter((p) =>
    childEnrollments.some((e) => e.projectId === p.id && e.status !== 'refunded')
  );

  const childSubmissions = submissions.filter((s) => s.studentId === childId);
  const childBadges = badges.filter((b) => b.awardedTo === childId);
  const childCerts = certificates.filter((c) => c.studentId === childId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">
          👨‍👩‍👧
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Parent Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Track educational progress, ratings, and course history for your children.</p>
        </div>
      </div>

      {/* Child selector & Quick Stats */}
      {childUser && (
        <Card className="border border-slate-100 shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar src={childUser.avatar} name={childUser.name} size="lg" />
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg">
                  CHILD ACCOUNT
                </span>
                <h3 className="font-extrabold text-slate-800 text-lg mt-1">{childUser.name}</h3>
                <p className="text-xs text-slate-400 font-medium">Joined June 2025</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="text-left border-l border-slate-100 pl-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Overall Rating</span>
                <div className="flex items-center gap-1 text-slate-800 mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-lg">{childUser.rating || '5.0'}</span>
                  <span className="text-slate-400 text-xs font-semibold">/ 5.0</span>
                </div>
              </div>

              <div className="text-left border-l border-slate-100 pl-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Enrolled Courses</span>
                <p className="font-extrabold text-slate-800 text-lg mt-1">{childProjects.length}</p>
              </div>

              <div className="text-left border-l border-slate-100 pl-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Badges Earned</span>
                <p className="font-extrabold text-slate-800 text-lg mt-1">{childBadges.length}</p>
              </div>

              <div className="text-left border-l border-slate-100 pl-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-semibold">Certificates</span>
                <p className="font-extrabold text-slate-800 text-lg mt-1">{childCerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Child Course Progress listing */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Course Attendance Progress</h3>
            </div>
            
            <div className="divide-y divide-slate-50">
              {childProjects.map((proj) => {
                const enroll = childEnrollments.find((e) => e.projectId === proj.id);
                if (!enroll) return null;
                const percent = Math.round((enroll.progressSessions / enroll.totalSessions) * 100);

                return (
                  <div key={proj.id} className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{proj.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Mentor: {proj.mentorName}</p>
                      </div>
                      <Badge variant={proj.status === 'completed' ? 'success' : 'primary'}>
                        {proj.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                        <span>Session Attendance</span>
                        <span>{enroll.progressSessions} / {enroll.totalSessions} Sessions ({percent}%)</span>
                      </div>
                      <Progress value={enroll.progressSessions} max={enroll.totalSessions} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Homework Feedback Tracking */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="px-6 py-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">Homework Submissions & Grades</h3>
              </div>
              
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {childSubmissions.length > 0 ? (
                  childSubmissions.map((sub) => (
                    <div key={sub.id} className="border border-slate-100 p-4 rounded-2xl space-y-2 hover:bg-slate-50 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800 text-xs truncate w-48">
                          {sub.assignmentTitle}
                        </span>
                        <Badge variant={sub.status === 'graded' ? 'success' : 'warning'}>
                          {sub.status === 'graded' ? `Grade: ${sub.grade}` : 'Reviewing'}
                        </Badge>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 leading-snug">{sub.projectName}</p>
                      
                      {sub.feedback && (
                        <p className="text-[10px] text-slate-500 italic mt-1 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          Mentor Feedback: "{sub.feedback}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs text-slate-400 font-semibold">No homework submissions found</div>
                )}
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Badges gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Child Badges */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Child Earned Badges</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {childBadges.map((b) => (
                <div key={b.id} className="border border-slate-100 p-4 rounded-2xl flex items-center gap-3 bg-white hover:shadow-sm transition-all">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center p-2.5">
                    <img
                      src={IMAGES.badgeWelcome}
                      alt={b.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs">{b.title}</h4>
                    <p className="text-[9px] text-slate-400 leading-none mt-0.5">{b.description}</p>
                    <p className="text-[9px] text-slate-400 mt-1 font-bold">Awarded {formatDate(b.awardedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tuition Invoices */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#354E80]" /> Billing Statements
              </h3>
            </div>
            
            <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
              {childEnrollments.map((enroll) => {
                const proj = projects.find((p) => p.id === enroll.projectId);
                return (
                  <div key={enroll.id} className="p-4 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-slate-800 truncate w-36">{proj?.title}</p>
                      <span className="text-[9px] text-slate-400">Paid {formatDate(enroll.enrolledAt)}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-800">{formatCurrency(499)}</p>
                      <Badge variant="success" className="text-[8px] py-0 px-1.5">Success</Badge>
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
