import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge, Modal, Input } from '@bluerobins/ui';
import { formatDate } from '@bluerobins/utils';
import { Video, ClipboardSignature, FilePlus, BookOpen } from 'lucide-react';

export default function SessionManager() {
  const { sessions, projects, enrollments, users, db, refresh } = useMockState();

  // Modals
  const [activeModal, setActiveModal] = useState<'attendance' | 'note' | 'assignment' | null>(null);
  const [selectedSess, setSelectedSess] = useState<any | null>(null);

  // Form states
  const [attendanceList, setAttendanceList] = useState<Record<string, 'present' | 'absent' | 'excused'>>({});
  
  // Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Assignment Form
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');

  // Get enrolled students for session's project
  const getSessionStudents = (projectId: string) => {
    const studentIds = enrollments
      .filter((e) => e.projectId === projectId && e.status !== 'refunded')
      .map((e) => e.studentId);
    return users.filter((u) => studentIds.includes(u.id));
  };

  const handleOpenAttendance = (sess: any) => {
    setSelectedSess(sess);
    const students = getSessionStudents(sess.projectId);
    const initialRecord: Record<string, 'present' | 'absent' | 'excused'> = {};
    students.forEach((s) => {
      initialRecord[s.id] = 'present';
    });
    setAttendanceList(initialRecord);
    setActiveModal('attendance');
  };

  const handleSaveAttendance = () => {
    if (!selectedSess) return;
    
    // Simulating attendance database update
    const students = getSessionStudents(selectedSess.projectId);
    students.forEach((s) => {
      db.addNotification(
        s.id,
        'Attendance Logged',
        `You were marked present for ${selectedSess.title}.`,
        'success',
        'session'
      );
    });

    setActiveModal(null);
    setSelectedSess(null);
    refresh();
  };

  const handleOpenNote = (sess: any) => {
    setSelectedSess(sess);
    setNoteTitle('');
    setNoteContent('');
    setActiveModal('note');
  };

  const handleSaveNote = () => {
    if (!selectedSess || !noteTitle || !noteContent) return;

    db.addNote({
      projectId: selectedSess.projectId,
      projectName: projects.find((p) => p.id === selectedSess.projectId)?.title || 'Course Notes',
      title: noteTitle,
      content: noteContent,
      authorId: 'mentor-yashvi',
      authorName: 'Yashvi',
      authorRole: 'mentor',
      category: selectedSess.title.split(':')[0] || 'Session Notes',
    });

    setActiveModal(null);
    setSelectedSess(null);
    refresh();
  };

  const handleOpenAssign = (sess: any) => {
    setSelectedSess(sess);
    setAssignTitle('');
    setAssignDesc('');
    setAssignDueDate('2025-07-15T23:59:59Z');
    setActiveModal('assignment');
  };

  const handleSaveAssign = () => {
    if (!selectedSess || !assignTitle || !assignDesc) return;

    const proj = projects.find((p) => p.id === selectedSess.projectId);
    const newList = db.assignments;
    db.assignments = [
      ...newList,
      {
        id: `assign-${Date.now()}`,
        projectId: selectedSess.projectId,
        projectName: proj?.title || 'Course Assignment',
        title: assignTitle,
        description: assignDesc,
        dueDate: assignDueDate || new Date().toISOString(),
        mentorId: 'mentor-yashvi',
        mentorName: 'Yashvi',
        createdAt: new Date().toISOString(),
      },
    ];

    // Dispatch notification alert to all students enrolled
    const enrolledStudents = getSessionStudents(selectedSess.projectId);
    enrolledStudents.forEach((s) => {
      db.addNotification(
        s.id,
        'New Assignment Released',
        `"${assignTitle}" is now active in ${proj?.title}.`,
        'warning',
        'assignment'
      );
    });

    setActiveModal(null);
    setSelectedSess(null);
    refresh();
  };

  const mentorSessions = sessions.filter((s) => s.mentorId === 'mentor-yashvi');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Session Manager</h1>
        <p className="text-slate-500 text-sm mt-1">Configure meeting channels, record student attendance registers, and deploy weekly syllabi notes.</p>
      </div>

      {/* Sessions list */}
      <div className="space-y-6">
        {mentorSessions.map((sess) => {
          const proj = projects.find((p) => p.id === sess.projectId);
          const students = getSessionStudents(sess.projectId);

          return (
            <Card key={sess.id} className="border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {proj?.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">• {students.length} Enrolled</span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base leading-snug">{sess.title}</h3>
                  
                  {sess.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{sess.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      Today, {sess.startTime} - {sess.endTime}
                    </span>
                    <span>
                      Meeting Link:{' '}
                      <a href={sess.meetingUrl} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">
                        {sess.meetingUrl}
                      </a>
                    </span>
                  </div>
                </div>

                {/* Actions group */}
                <div className="flex flex-wrap gap-2.5 items-center shrink-0">
                  <Button variant="outline" size="sm" className="gap-1 font-bold text-xs" onClick={() => handleOpenAttendance(sess)}>
                    <ClipboardSignature className="w-4 h-4 text-slate-500" /> Log Attendance
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 font-bold text-xs" onClick={() => handleOpenNote(sess)}>
                    <FilePlus className="w-4 h-4 text-slate-500" /> Post Note
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-1 font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleOpenAssign(sess)}>
                    <BookOpen className="w-4 h-4" /> Post Assignment
                  </Button>
                </div>

              </div>
            </Card>
          );
        })}
      </div>

      {/* Attendance Modal */}
      <Modal
        isOpen={activeModal === 'attendance'}
        onClose={() => setActiveModal(null)}
        title="Record Session Attendance"
        footer={
          <>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSaveAttendance}>Save Register</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-500 text-xs font-semibold">Select presence status for each active student:</p>
          <div className="divide-y divide-slate-50">
            {selectedSess &&
              getSessionStudents(selectedSess.projectId).map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{s.name}</span>
                  <div className="flex gap-3 text-xs">
                    {(['present', 'absent', 'excused'] as const).map((status) => (
                      <label key={status} className="flex items-center gap-1.5 cursor-pointer capitalize font-medium text-slate-600">
                        <input
                          type="radio"
                          name={`attendance-${s.id}`}
                          checked={attendanceList[s.id] === status}
                          onChange={() => setAttendanceList((prev) => ({ ...prev, [s.id]: status }))}
                        />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={activeModal === 'note'}
        onClose={() => setActiveModal(null)}
        title="Publish Session Notes"
        footer={
          <>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSaveNote}>Publish Note</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Note Title"
            placeholder="e.g. Session 3: Core tips for SHAP plots"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Note Content</label>
            <textarea
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#354E80]"
              placeholder="Type notes detail context..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={activeModal === 'assignment'}
        onClose={() => setActiveModal(null)}
        title="Deploy Course Assignment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSaveAssign}>Deploy Assignment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Session 3 Assignment"
            value={assignTitle}
            onChange={(e) => setAssignTitle(e.target.value)}
            required
          />
          <Input
            label="Due Date"
            type="datetime-local"
            value={assignDueDate}
            onChange={(e) => setAssignDueDate(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Assignment Description</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#354E80]"
              placeholder="Describe assignment tasks details..."
              value={assignDesc}
              onChange={(e) => setAssignDesc(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
