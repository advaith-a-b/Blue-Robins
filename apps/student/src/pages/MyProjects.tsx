import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockState } from '@bluerobins/api';
import { useProjects } from '@bluerobins/hooks';
import { Card, CardContent, Button, Progress, Badge, Avatar } from '@bluerobins/ui';
import { MessageSquare, Award, ExternalLink } from 'lucide-react';

export default function MyProjects() {
  const navigate = useNavigate();
  const { studentProjects, studentEnrollments } = useProjects();
  const { sessions, certificates } = useMockState();
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'not_started' | 'completed'>('all');

  const filtered = studentProjects.filter((p) => {
    if (filterTab === 'all') return true;
    return p.status === filterTab;
  });

  const getSessionsForProject = (projectId: string) => {
    return sessions.filter((s) => s.projectId === projectId);
  };

  const getCertificateForProject = (projectId: string) => {
    return certificates.find((c) => c.projectId === projectId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your active, scheduled and completed project mentorships.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        {(['all', 'in_progress', 'not_started', 'completed'] as const).map((tab) => {
          const count = tab === 'all'
            ? studentProjects.length
            : studentProjects.filter((p) => p.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`pb-3 text-sm font-bold capitalize border-b-2 transition-all relative ${
                filterTab === tab
                  ? 'border-[#354E80] text-[#354E80]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const enrollment = studentEnrollments.find((e) => e.projectId === proj.id);
            const projSessions = getSessionsForProject(proj.id);
            const cert = getCertificateForProject(proj.id);
            
            return (
              <Card key={proj.id} hoverable className="flex flex-col h-full justify-between">
                <div className="relative">
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={
                      proj.status === 'completed' ? 'success' :
                      proj.status === 'in_progress' ? 'primary' : 'warning'
                    }>
                      {proj.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 h-12">
                      {proj.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <Avatar src={proj.mentorAvatar} name={proj.mentorName} size="sm" />
                      <span className="text-xs text-slate-500 font-semibold">By {proj.mentorName}</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-400">Next Session:</span>
                        <span className="font-bold text-slate-800">Today, 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-400">Duration:</span>
                        <span className="font-bold text-slate-800">{proj.durationWeeks} Weeks</span>
                      </div>
                    </div>

                    {enrollment && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                          <span>Progress</span>
                          <span>{enrollment.progressSessions}/{enrollment.totalSessions} Sessions</span>
                        </div>
                        <Progress value={enrollment.progressSessions} max={enrollment.totalSessions} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Button variant="outline" className="flex-1 gap-1.5" onClick={() => navigate('/help')}>
                      <MessageSquare className="w-4 h-4" /> Chat
                    </Button>

                    {proj.status === 'completed' && cert ? (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1"
                      >
                        <Button variant="primary" className="w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                          <Award className="w-4 h-4" /> View certificate
                        </Button>
                      </a>
                    ) : (
                      <Button variant="primary" className="flex-1" onClick={() => navigate('/help')}>
                        View more
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-3">
          <span className="text-5xl">📁</span>
          <h3 className="font-bold text-slate-700 text-lg">No Projects Found</h3>
          <p className="text-slate-400 text-sm">You do not have any projects listed in this filter.</p>
        </div>
      )}
    </div>
  );
}
