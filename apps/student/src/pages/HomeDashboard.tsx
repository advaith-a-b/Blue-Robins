import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MessageSquare, ExternalLink, Award, Share2 } from 'lucide-react';
import { useMockState } from '@bluerobins/api';
import { useProjects, useAssignments } from '@bluerobins/hooks';
import { Card, CardContent, Button, Progress, Badge, Avatar } from '@bluerobins/ui';
import { formatDate } from '@bluerobins/utils';
import { IMAGES } from '@bluerobins/assets';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { currentUser, db, sessions, notes, badges, certificates } = useMockState();
  const { studentProjects, studentEnrollments } = useProjects();
  const { studentAssignments, getStudentSubmission } = useAssignments();

  // Project Tabs (In-progress, Not started, Completed)
  const [projectTab, setProjectTab] = useState<'in_progress' | 'not_started' | 'completed'>('in_progress');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filter projects by status
  const filteredProjects = studentProjects.filter((p) => p.status === projectTab);

  const nextProject = () => {
    if (carouselIndex < filteredProjects.length - 1) {
      setCarouselIndex((prev) => prev + 1);
    }
  };

  const prevProject = () => {
    if (carouselIndex > 0) {
      setCarouselIndex((prev) => prev - 1);
    }
  };

  // Mock Calendar Days
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = [
    { dayNum: 23, name: 'Mon', active: true },
    { dayNum: 24, name: 'Tue' },
    { dayNum: 25, name: 'Wed' },
    { dayNum: 26, name: 'Thu' },
    { dayNum: 27, name: 'Fri' },
    { dayNum: 28, name: 'Sat' },
    { dayNum: 29, name: 'Sun' },
  ];

  // Active student sessions
  const activeProjectIds = studentProjects.map(p => p.id);
  const studentSessions = sessions.filter(s => activeProjectIds.includes(s.projectId));

  // Current active project in carousel
  const activeProj = filteredProjects[carouselIndex];
  const activeEnrollment = activeProj ? studentEnrollments.find(e => e.projectId === activeProj.id) : null;

  // Tab right column
  const [rightTab, setRightTab] = useState<'assignments' | 'notes'>('assignments');
  const [badgesTab, setBadgesTab] = useState<'badges' | 'certificates'>('badges');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">
          🦉
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome to BlueRobins, {currentUser?.name}!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            You are making great progress. Check your schedule and weekly assignments below.
          </p>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card onClick={() => navigate('/projects')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">My Projects</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{studentProjects.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">📁</div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate('/notes')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">My Notes</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{notes.filter(n => n.authorId === currentUser?.id).length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">📝</div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate('/assignments')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Assignments</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{studentAssignments.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-xl">📖</div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate('/achievements')} className="cursor-pointer hover:border-slate-300">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Achievements</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{badges.filter(b => b.awardedTo === currentUser?.id).length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl">🎗️</div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Projects Widget */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h3 className="font-bold text-slate-800">Projects</h3>
                <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl">
                  {(['in_progress', 'not_started', 'completed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setProjectTab(tab);
                        setCarouselIndex(0);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                        projectTab === tab
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Card */}
              {activeProj ? (
                <div className="mt-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <img
                      src={activeProj.thumbnailUrl}
                      alt={activeProj.title}
                      className="w-full h-40 object-cover rounded-2xl"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{activeProj.title}</h4>
                      <p className="text-slate-400 text-xs mt-1">By {activeProj.mentorName}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Next Session:</span>
                        <p className="font-bold text-slate-700 mt-0.5">14th Aug | 10:00 PM</p>
                      </div>
                      <Badge variant="primary">Join</Badge>
                    </div>

                    {activeEnrollment && (
                      <Progress
                        value={activeEnrollment.progressSessions}
                        max={activeEnrollment.totalSessions}
                        showLabel
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Button variant="outline" className="flex-1 gap-1.5" onClick={() => navigate(`/help`)}>
                      <MessageSquare className="w-4 h-4" /> Chat
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => navigate('/projects')}>
                      View more
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl">📁</span>
                  <p className="text-slate-400 text-xs mt-2 font-medium">No projects in this category</p>
                </div>
              )}

              {/* Carousel Pagination */}
              {filteredProjects.length > 1 && (
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-6">
                  <div className="flex gap-1">
                    {filteredProjects.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === carouselIndex ? 'bg-[#354E80] w-4' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevProject}
                      disabled={carouselIndex === 0}
                      className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={nextProject}
                      disabled={carouselIndex === filteredProjects.length - 1}
                      className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE COLUMN: Calendar & Schedule */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Calendar</h3>
                  <Badge variant="neutral" className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> June 2025
                  </Badge>
                </div>

                {/* Day selector row */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => (
                    <button
                      key={day.dayNum}
                      className={`flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all ${
                        day.active
                          ? 'bg-[#F59E0B] text-white'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span>{day.name}</span>
                      <span className="text-sm mt-1">{day.dayNum}</span>
                    </button>
                  ))}
                </div>

                {/* Schedule list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule</h4>
                    <span className="text-[10px] bg-blue-50 text-[#354E80] font-bold px-2 py-0.5 rounded-full">
                      {studentSessions.length} Available
                    </span>
                  </div>

                  {studentSessions.slice(0, 2).map((sess) => (
                    <div key={sess.id} className="border border-slate-100 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xl">
                          🎥
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 truncate w-40">{sess.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">By {sess.mentorId === 'mentor-yashvi' ? 'Yashvi' : 'Anirudh S'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[11px] text-slate-500 font-medium">
                        <span>Today, {sess.startTime} - {sess.endTime}</span>
                        <a
                          href={sess.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-500 font-bold hover:underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/projects')}
                className="w-full text-center text-xs font-bold text-[#354E80] hover:underline mt-6 pt-4 border-t border-slate-50 flex items-center justify-center gap-1"
              >
                View All Schedule <ChevronRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Tabs (Assignments/Notes & Badges/Certificates) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assignments / Notes Card */}
          <Card className="flex flex-col">
            <CardContent className="p-6">
              <div className="flex border-b border-slate-50 pb-3">
                <button
                  onClick={() => setRightTab('assignments')}
                  className={`flex-1 text-center font-bold text-sm pb-1 border-b-2 transition-all ${
                    rightTab === 'assignments'
                      ? 'border-[#354E80] text-[#354E80]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Assignments Submission
                </button>
                <button
                  onClick={() => setRightTab('notes')}
                  className={`flex-1 text-center font-bold text-sm pb-1 border-b-2 transition-all ${
                    rightTab === 'notes'
                      ? 'border-[#354E80] text-[#354E80]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Notes
                </button>
              </div>

              <div className="mt-4 space-y-4 min-h-[160px]">
                {rightTab === 'assignments' ? (
                  studentAssignments.slice(0, 2).map((assign) => {
                    const sub = getStudentSubmission(assign.id);
                    return (
                      <div key={assign.id} className="flex justify-between items-center border border-slate-50 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-all">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{assign.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{assign.projectName}</p>
                          <div className="flex gap-2 mt-2">
                            {sub ? (
                              <Badge variant={sub.status === 'graded' ? 'success' : 'warning'}>
                                {sub.status === 'graded' ? `Grade: ${sub.grade}` : 'Reviewing'}
                              </Badge>
                            ) : (
                              <Badge variant="danger">Due soon</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={sub ? 'outline' : 'secondary'}
                          size="sm"
                          onClick={() => navigate('/assignments')}
                        >
                          {sub ? 'Review' : 'Submit'}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  notes.filter(n => n.authorId === currentUser?.id).slice(0, 2).map((note) => (
                    <div
                      key={note.id}
                      onClick={() => navigate('/notes')}
                      className="border border-slate-50 p-3.5 rounded-2xl hover:bg-slate-50/50 cursor-pointer transition-all space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg">
                          {note.category}
                        </span>
                        <span className="text-[9px] text-slate-400">{formatDate(note.updatedAt)}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{note.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{note.content}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => navigate(rightTab === 'assignments' ? '/assignments' : '/notes')}
                className="w-full text-center text-xs font-bold text-[#354E80] hover:underline mt-4 pt-3 border-t border-slate-50 flex items-center justify-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          {/* Badges / Certificates Card */}
          <Card className="flex flex-col">
            <CardContent className="p-6">
              <div className="flex border-b border-slate-50 pb-3">
                <button
                  onClick={() => setBadgesTab('badges')}
                  className={`flex-1 text-center font-bold text-sm pb-1 border-b-2 transition-all ${
                    badgesTab === 'badges'
                      ? 'border-[#354E80] text-[#354E80]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Badges
                </button>
                <button
                  onClick={() => setBadgesTab('certificates')}
                  className={`flex-1 text-center font-bold text-sm pb-1 border-b-2 transition-all ${
                    badgesTab === 'certificates'
                      ? 'border-[#354E80] text-[#354E80]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Certificates
                </button>
              </div>

              <div className="mt-4 space-y-4 min-h-[160px]">
                {badgesTab === 'badges' ? (
                  badges.filter(b => b.awardedTo === currentUser?.id).slice(0, 1).map((b) => (
                    <div key={b.id} className="flex justify-between items-center border border-slate-50 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <Avatar src={IMAGES.badgeWelcome} name={b.title} size="sm" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{b.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{b.description}</p>
                          <p className="text-[9px] text-[#354E80] mt-1 font-medium">Given by {b.awardedByName}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </Button>
                    </div>
                  ))
                ) : (
                  certificates.filter(c => c.studentId === currentUser?.id).slice(0, 1).map((c) => (
                    <div key={c.id} className="flex justify-between items-center border border-slate-50 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">
                          🎓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.projectName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Mentor: {c.mentorName}</p>
                          <p className="text-[9px] text-[#354E80] mt-1 font-medium">Issued {formatDate(c.issuedAt)}</p>
                        </div>
                      </div>
                      <a
                        href={c.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 shrink-0"
                      >
                        PDF <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => navigate('/achievements')}
                className="w-full text-center text-xs font-bold text-[#354E80] hover:underline mt-4 pt-3 border-t border-slate-50 flex items-center justify-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
