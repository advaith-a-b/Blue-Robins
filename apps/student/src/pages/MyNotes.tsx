import React, { useState } from 'react';
import { useMockState } from '@bluerobins/api';
import { useAuth } from '@bluerobins/hooks';
import { Card, CardContent, Button, Badge, Modal, Input, Avatar } from '@bluerobins/ui';
import { formatDate } from '@bluerobins/utils';
import { IMAGES } from '@bluerobins/assets';
import { Plus, Edit2, BookOpen } from 'lucide-react';

export default function MyNotes() {
  const { notes, db, refresh } = useMockState();
  const { user } = useAuth();
  const [filterTab, setFilterTab] = useState<'all' | 'by_you' | 'by_mentor'>('all');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');

  // Filtering
  const filtered = notes.filter((n) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'by_you') return n.authorRole === 'student';
    if (filterTab === 'by_mentor') return n.authorRole === 'mentor';
    return true;
  });

  const handleOpenCreate = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('General');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: any) => {
    if (note.authorRole === 'mentor') return; // Mentor notes are read-only!
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!noteTitle || !noteContent) return;

    if (selectedNote) {
      // Edit existing student note
      db.updateNote(selectedNote.id, noteContent);
    } else {
      // Create new student note
      db.addNote({
        projectId: 'proj-heart-failure',
        projectName: 'Heart Failure Risk Prediction with Interpretable ML',
        title: noteTitle,
        content: noteContent,
        authorId: user?.id || 'student-pooja',
        authorName: user?.name || 'Pooja Jain',
        authorRole: 'student',
        category: noteCategory,
      });
    }

    setIsModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
          <p className="text-slate-500 text-sm mt-1">Write your reflection diaries and browse notes uploaded by mentors.</p>
        </div>
        <Button variant="secondary" className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Note
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        {(['all', 'by_you', 'by_mentor'] as const).map((tab) => {
          const count = notes.filter((n) => {
            if (tab === 'all') return true;
            if (tab === 'by_you') return n.authorRole === 'student';
            if (tab === 'by_mentor') return n.authorRole === 'mentor';
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
              {tab === 'by_you' ? 'By You' : tab === 'by_mentor' ? 'By Mentor' : 'All'} ({count})
            </button>
          );
        })}
      </div>

      {/* Notes Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((note) => {
            const isMentorNote = note.authorRole === 'mentor';
            return (
              <Card
                key={note.id}
                hoverable
                onClick={() => handleOpenEdit(note)}
                className={`flex flex-col justify-between cursor-pointer border border-slate-100 ${
                  !isMentorNote ? 'hover:border-[#354E80]/40' : ''
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant={isMentorNote ? 'secondary' : 'neutral'}>
                      {note.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Edited {formatDate(note.updatedAt)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">{note.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-6">
                      {note.content}
                    </p>
                  </div>
                </CardContent>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={isMentorNote ? IMAGES.mentorAvatar3 : IMAGES.studentAvatar}
                      name={note.authorName}
                      size="sm"
                    />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-700 leading-none">{note.authorName}</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                        {isMentorNote ? 'Mentor' : 'You'}
                      </p>
                    </div>
                  </div>

                  {!isMentorNote && (
                    <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#354E80] transition-colors" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-3">
          <span className="text-5xl">📝</span>
          <h3 className="font-bold text-slate-700 text-lg">No Notes Available</h3>
          <p className="text-slate-400 text-sm">Write reflections or check notes shared by your course mentors.</p>
        </div>
      )}

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedNote ? 'Edit Notes Details' : 'Create Reflection Note'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={handleSave}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. My thoughts on Session 3"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            disabled={!!selectedNote} // Don't let title update for edit
            icon={<BookOpen className="w-4 h-4 text-slate-400" />}
          />
          <Input
            label="Category"
            placeholder="e.g. Session 3 Reflection"
            value={noteCategory}
            onChange={(e) => setNoteCategory(e.target.value)}
            disabled={!!selectedNote}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Content Details</label>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#354E80] focus:ring-1 focus:ring-[#354E80]/10"
              placeholder="Jot down notes or reflection metrics here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
