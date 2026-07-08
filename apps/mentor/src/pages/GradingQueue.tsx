import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge, Modal, Input } from '@bluerobins/ui';
import { formatDate } from '@bluerobins/utils';
import { Check, Clipboard, Clock } from 'lucide-react';

export default function GradingQueue() {
  const { submissions, db, refresh } = useMockState();
  const [filterTab, setFilterTab] = useState<'pending' | 'graded'>('pending');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [gradeInput, setGradeInput] = useState('A');
  const [feedbackInput, setFeedbackInput] = useState('');

  const filtered = submissions.filter((s) => {
    if (filterTab === 'pending') return s.status === 'submitted';
    return s.status === 'graded';
  });

  const handleOpenGrade = (sub: any) => {
    setSelectedSub(sub);
    setGradeInput('A');
    setFeedbackInput('');
    setIsModalOpen(true);
  };

  const handleSaveGrade = () => {
    if (!selectedSub) return;
    
    db.gradeSubmission(
      selectedSub.id,
      gradeInput,
      feedbackInput || 'Excellent work! Keep it up.',
      'mentor-yashvi'
    );

    setIsModalOpen(false);
    setSelectedSub(null);
    refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Grading Queue</h1>
        <p className="text-slate-500 text-sm mt-1">Review files submitted by students, leave feedback comments, and assign grades.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setFilterTab('pending')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            filterTab === 'pending'
              ? 'border-[#354E80] text-[#354E80]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pending Review ({submissions.filter((s) => s.status === 'submitted').length})
        </button>
        <button
          onClick={() => setFilterTab('graded')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            filterTab === 'graded'
              ? 'border-[#354E80] text-[#354E80]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Graded ({submissions.filter((s) => s.status === 'graded').length})
        </button>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((sub) => (
            <Card key={sub.id} className="border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-300">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-800 text-sm">{sub.studentName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">• Enrolled Student</span>
                  
                  {sub.isLate && (
                    <Badge variant="danger" className="text-[9px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Late submission
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">{sub.projectName}</h4>
                  <p className="font-bold text-slate-800 text-sm mt-1 leading-snug">{sub.assignmentTitle}</p>
                </div>

                <div className="bg-slate-50/75 rounded-xl p-3.5 text-xs text-slate-500 font-medium">
                  <span className="font-bold text-slate-700 block mb-1">Student Notes:</span>
                  <p className="italic">"{sub.submittedText || 'No comments provided by student.'}"</p>
                </div>

                <div className="flex gap-4 text-[10px] text-slate-400 font-semibold">
                  <span>File: <span className="text-[#354E80] hover:underline cursor-pointer">{sub.fileName}</span></span>
                  <span>Submitted {formatDate(sub.submittedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex gap-3 items-center">
                {sub.status === 'submitted' ? (
                  <Button
                    variant="secondary"
                    className="font-extrabold tracking-wide py-2.5 rounded-xl shadow-md active:scale-95 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => handleOpenGrade(sub)}
                  >
                    Grade Submission
                  </Button>
                ) : (
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500">Grade: <span className="text-emerald-600 font-extrabold text-sm">{sub.grade}</span></p>
                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">Feedback: "{sub.feedback}"</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-3">
          <span className="text-5xl">✅</span>
          <h3 className="font-bold text-slate-700 text-lg">Queue Clean</h3>
          <p className="text-slate-400 text-sm">No student submissions found in this list.</p>
        </div>
      )}

      {/* Grading dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Grade: ${selectedSub?.studentName}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSaveGrade}>Confirm & Post Grade</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-700">Project:</span>
              <span className="text-slate-800 font-bold text-right">{selectedSub?.projectName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-700">Assignment:</span>
              <span className="text-slate-800 font-bold text-right">{selectedSub?.assignmentTitle}</span>
            </div>
            {selectedSub?.isLate && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>Lateness Check:</span>
                <span>Late submission (rating penalty applies)</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Select Grade</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:outline-none focus:border-[#354E80]"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
            >
              <option value="A">Grade A (Excellent)</option>
              <option value="B">Grade B (Good)</option>
              <option value="C">Grade C (Average)</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Review Feedback</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#354E80] focus:ring-1 focus:ring-[#354E80]/10"
              placeholder="Enter critique, guidance details or comments..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
