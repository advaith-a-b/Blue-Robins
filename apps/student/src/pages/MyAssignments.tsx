import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { useAssignments, useAuth } from '@bluerobins/hooks';
import { Card, CardContent, Button, Badge, Modal, Input } from '@bluerobins/ui';
import { formatDate, checkIsLate } from '@bluerobins/utils';
import { MessageSquare, BookOpen, Upload, Calendar } from 'lucide-react';
import { IMAGES } from '@bluerobins/assets';

export default function MyAssignments() {
  const { db } = useMockState();
  const { user } = useAuth();
  const { studentAssignments, getStudentSubmission, uploadAssignment } = useAssignments();
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'not_started' | 'completed'>('all');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState<any | null>(null);
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');

  // Filters logic
  const filtered = studentAssignments.filter((assign) => {
    const sub = getStudentSubmission(assign.id);
    if (filterTab === 'all') return true;
    if (filterTab === 'completed') return sub && sub.status === 'graded';
    if (filterTab === 'in_progress') return sub && sub.status === 'submitted';
    if (filterTab === 'not_started') return !sub;
    return true;
  });

  const handleOpenUpload = (assign: any) => {
    setSelectedAssign(assign);
    setInputText('');
    setFileName('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssign) return;

    uploadAssignment(
      selectedAssign.id,
      selectedAssign.title,
      selectedAssign.projectId,
      selectedAssign.projectName,
      '/mock/uploads/' + (fileName || 'submission.zip'),
      fileName || 'submission.zip',
      fileName.endsWith('.pdf') ? 'PDF' : 'ZIP',
      inputText
    );

    setIsModalOpen(false);
    setSelectedAssign(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Assignments</h1>
        <p className="text-slate-500 text-sm mt-1">Submit your coursework assignments and receive mentor feedback.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        {(['all', 'in_progress', 'not_started', 'completed'] as const).map((tab) => {
          const count = studentAssignments.filter((assign) => {
            const sub = getStudentSubmission(assign.id);
            if (tab === 'all') return true;
            if (tab === 'completed') return sub && sub.status === 'graded';
            if (tab === 'in_progress') return sub && sub.status === 'submitted';
            if (tab === 'not_started') return !sub;
            return true;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`pb-3 text-sm font-bold capitalize border-b-2 transition-all ${
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

      {/* Assignments list */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((assign) => {
            const sub = getStudentSubmission(assign.id);
            const isLate = checkIsLate(assign.dueDate);
            const isDueSoon = !sub && !isLate;

            return (
              <Card key={assign.id} className="border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Left Thumbnail container */}
                <div className="md:w-72 relative shrink-0 h-44 md:h-auto">
                  <img
                    src={IMAGES.heartFailure}
                    alt={assign.projectName}
                    className="w-full h-full object-cover"
                  />
                  {isDueSoon && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="danger" className="animate-pulse">Due soon</Badge>
                    </div>
                  )}
                  {sub && (
                    <div className="absolute top-4 left-4">
                      <Badge variant={sub.status === 'graded' ? 'success' : 'warning'}>
                        {sub.status === 'graded' ? 'Graded' : 'Submitted'}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Right content container */}
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-snug">
                          {assign.projectName}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">By Yashvi</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Due {formatDate(assign.dueDate)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-50 pt-3">
                      <h4 className="text-sm font-bold text-slate-700">{assign.title}</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {assign.description}
                      </p>
                    </div>

                    {sub && (
                      <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 mt-2">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-700">Submission File:</span>
                          <span className="text-[#354E80] font-semibold hover:underline cursor-pointer">
                            {sub.fileName}
                          </span>
                        </div>
                        {sub.grade && (
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-700">Grade Awarded:</span>
                            <span className="text-emerald-600 font-extrabold text-sm">{sub.grade}</span>
                          </div>
                        )}
                        {sub.feedback && (
                          <div className="pt-1">
                            <span className="font-bold text-slate-700 block">Mentor Feedback:</span>
                            <p className="text-slate-500 italic mt-1 font-medium">"{sub.feedback}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col md:flex-row gap-3 items-center">
                    <Button variant="outline" className="w-full md:w-auto gap-1.5" onClick={() => {}}>
                      <MessageSquare className="w-4 h-4" /> Chat with Mentor
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto gap-1.5" onClick={() => {}}>
                      <BookOpen className="w-4 h-4" /> View Project
                    </Button>
                    
                    {!sub && (
                      <Button
                        variant="secondary"
                        className="w-full md:flex-1 py-3 text-sm font-extrabold tracking-wide rounded-xl shadow-md active:scale-95 bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => handleOpenUpload(assign)}
                      >
                        Upload Assignment
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
          <span className="text-5xl">📖</span>
          <h3 className="font-bold text-slate-700 text-lg">No Assignments</h3>
          <p className="text-slate-400 text-sm">You do not have any assignments listed here.</p>
        </div>
      )}

      {/* Upload Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Upload Submission: ${selectedAssign?.title}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSubmit}>Submit Assignment</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="File Name"
            placeholder="e.g. guide_to_gen_ai.pdf"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
            icon={<Upload className="w-4 h-4 text-slate-400" />}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Submission Notes</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#354E80] focus:ring-1 focus:ring-[#354E80]/10"
              placeholder="Provide comments or documentation URLs for your mentor..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
