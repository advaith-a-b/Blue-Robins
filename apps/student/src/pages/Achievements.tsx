import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { useAuth } from '@bluerobins/hooks';
import { Card, CardContent, Button, Badge, Avatar } from '@bluerobins/ui';
import { formatDate } from '@bluerobins/utils';
import { Share2, Grid, List, Award, ExternalLink } from 'lucide-react';
import { IMAGES } from '@bluerobins/assets';

export default function Achievements() {
  const { badges, certificates } = useMockState();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates'>('badges');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  const studentBadges = badges.filter((b) => b.awardedTo === user?.id);
  const studentCerts = certificates.filter((c) => c.studentId === user?.id);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'welcome': return IMAGES.badgeWelcome;
      case 'on_a_roll': return IMAGES.badgeOnARoll;
      case 'rockstar': return IMAGES.badgeRockstar;
      default: return IMAGES.badgeWelcome;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Achievements</h1>
          <p className="text-slate-500 text-sm mt-1">Unlock badges and completion certificates awarded by your course mentors.</p>
        </div>
        
        {/* Grid/List Layout toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewLayout === 'grid' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewLayout('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewLayout === 'list' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs list switcher */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'badges'
              ? 'border-[#354E80] text-[#354E80]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Badges ({studentBadges.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'certificates'
              ? 'border-[#354E80] text-[#354E80]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Certificates ({studentCerts.length})
        </button>
      </div>

      {/* Grid or List Layout display */}
      {activeTab === 'badges' ? (
        studentBadges.length > 0 ? (
          <div className={
            viewLayout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {studentBadges.map((badge) => (
              <Card key={badge.id} className="border border-slate-100">
                <CardContent className={`p-6 flex ${
                  viewLayout === 'list' ? 'flex-row items-center justify-between' : 'flex-col items-center text-center space-y-4'
                } gap-4`}>
                  {/* Left or Top Icon */}
                  <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center p-3 select-none">
                    <img
                      src={getBadgeIcon(badge.iconName)}
                      alt={badge.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Middle description */}
                  <div className={`flex-1 ${viewLayout === 'list' ? 'text-left' : 'space-y-1'}`}>
                    <h3 className="font-extrabold text-slate-800 text-sm">{badge.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5 leading-snug">{badge.description}</p>
                    <div className="flex items-center gap-1.5 justify-center md:justify-start mt-2">
                      <span className="text-[10px] text-slate-400 font-semibold">Awarded by:</span>
                      <span className="text-[10px] text-[#354E80] font-bold">{badge.awardedByName}</span>
                    </div>
                  </div>

                  {/* Share button */}
                  <Button variant="secondary" size="sm" className="gap-1.5 shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-3">
            <span className="text-5xl">🦉</span>
            <h3 className="font-bold text-slate-700 text-lg">No Badges Yet</h3>
            <p className="text-slate-400 text-sm">Attend live sessions and upload homework on time to earn achievements!</p>
          </div>
        )
      ) : (
        studentCerts.length > 0 ? (
          <div className={
            viewLayout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {studentCerts.map((cert) => (
              <Card key={cert.id} className="border border-slate-100 overflow-hidden">
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-center text-2xl shrink-0">
                      🎓
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                        {cert.projectName}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Issued {formatDate(cert.issuedAt)}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400">Mentor: {cert.mentorName}</span>
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-500 font-extrabold hover:underline flex items-center gap-1 shrink-0"
                    >
                      PDF <ExternalLink className="w-3 h-3 text-amber-500" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-3">
            <span className="text-5xl">🎓</span>
            <h3 className="font-bold text-slate-700 text-lg">No Certificates</h3>
            <p className="text-slate-400 text-sm">Certificates appear here after your final project is marked complete.</p>
          </div>
        )
      )}
    </div>
  );
}
