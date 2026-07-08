import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge } from '@bluerobins/ui';
import { BookOpen, FolderOpen, Award, CheckSquare, Clock } from 'lucide-react';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { projects, submissions, currentUser, badges } = useMockState();

  // Filter projects by this mentor
  const mentorProjects = projects.filter((p) => p.mentorId === currentUser?.id);
  const mentorProjectIds = mentorProjects.map((p) => p.id);

  // Filter submissions for this mentor's projects
  const pendingSubmissions = submissions.filter(
    (s) => s.status === 'submitted' && mentorProjectIds.includes(s.projectId)
  );

  const awardedBadges = badges.filter((b) => b.awardedBy === currentUser?.id);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">
          👩‍🏫
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {currentUser?.name || 'Mentor'}!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your courses, schedule live Zoom meetings, review assignments, and award certificates.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">My Courses</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{mentorProjects.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">📁</div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate('/grading')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Grading</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{pendingSubmissions.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">
              {pendingSubmissions.length > 0 ? '🔥' : '✅'}
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate('/sessions')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Sessions Scheduled</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">3</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-xl">🎥</div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate('/badges')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Badges Given</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{awardedBadges.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl">🎗️</div>
          </CardContent>
        </Card>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Course management listing */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#354E80]" /> Active Mentorship Projects
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {mentorProjects.map((p) => (
                <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{p.title}</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      {p.durationWeeks} Weeks | Status:{' '}
                      <span className="font-semibold capitalize text-slate-600">{p.status.replace('_', ' ')}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">{p.enrolledCount} / {p.capacity}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Students Joined</p>
                    </div>
                    <Badge variant={p.status === 'completed' ? 'success' : 'primary'}>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending submissions list panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#354E80]" /> Grading Queue Shortcuts
                </h3>
                {pendingSubmissions.length > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded-full">
                    {pendingSubmissions.length} Review
                  </span>
                )}
              </div>
              
              <div className="p-6 space-y-4">
                {pendingSubmissions.length > 0 ? (
                  pendingSubmissions.slice(0, 3).map((sub) => (
                    <div key={sub.id} className="border border-slate-50 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{sub.studentName}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold truncate w-44">
                          {sub.assignmentTitle}
                        </p>
                        {sub.isLate && (
                          <Badge variant="danger" className="text-[9px] mt-2">Late submission</Badge>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={() => navigate('/grading')}>
                        Review
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 space-y-2">
                    <span className="text-3xl">✅</span>
                    <p className="text-xs text-slate-400 font-semibold">All submissions graded!</p>
                  </div>
                )}
              </div>
            </div>

            {pendingSubmissions.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => navigate('/grading')}
                className="w-full text-center text-xs font-bold text-[#354E80] py-4 border-t border-slate-50 rounded-none hover:underline"
              >
                Go to Grading Dashboard
              </Button>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
