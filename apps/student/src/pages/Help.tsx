import React, { useState, useEffect } from 'react';
import { useMockState } from '@bluerobins/api';
import { useAuth } from '@bluerobins/hooks';
import { Card, CardContent, Button, Avatar } from '@bluerobins/ui';
import { Send, Image, FileText, ChevronRight } from 'lucide-react';
import { IMAGES } from '@bluerobins/assets';

export default function Help() {
  const { db, chats, messages, refresh } = useMockState();
  const { user } = useAuth();
  
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Select first chat by default
    if (chats && chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

  // Filter messages for current chat
  const chatMessages = messages.filter((m) => m.chatId === selectedChat?.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat || !user) return;

    db.sendMessage(selectedChat.id, user.id, user.name, messageText);
    setMessageText('');
    refresh();

    // Simulating auto-reply from Mentor after 2 seconds to make the UI feel alive!
    if (selectedChat.type === 'direct') {
      setTimeout(() => {
        db.sendMessage(
          selectedChat.id,
          'mentor-yashvi',
          'Yashvi',
          "Got it, Pooja! Let's discuss this during our weekly sync today at 5:00 PM."
        );
        refresh();
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 h-[80vh] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">Support & Chat</h1>
        <p className="text-slate-500 text-sm mt-1">Chat 1:1 with your mentors, group cohorts, and support desk.</p>
      </div>

      {/* Chat Panels */}
      <Card className="flex-1 flex overflow-hidden border border-slate-100 min-h-0">
        
        {/* Left Panel: Chats List */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-slate-50 font-bold text-slate-700 text-sm">Conversations</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {chats.map((c) => {
              const isGroup = c.type === 'group';
              const lastMsg = c.lastMessage;
              const isActive = selectedChat?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedChat(c)}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    isActive ? 'bg-slate-50/70 border-l-4 border-[#354E80]' : ''
                  }`}
                >
                  <Avatar
                    src={isGroup ? IMAGES.heartFailure : IMAGES.mentorAvatar1}
                    name={isGroup ? c.name : 'Yashvi'}
                    size="md"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{isGroup ? c.name : 'Yashvi'}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                      {lastMsg ? lastMsg.content : 'No messages yet'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Box */}
        <div className="flex-1 flex flex-col bg-slate-50/50 min-h-0">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center gap-3 shrink-0">
                <Avatar
                  src={selectedChat.type === 'group' ? IMAGES.heartFailure : IMAGES.mentorAvatar1}
                  name={selectedChat.type === 'group' ? selectedChat.name : 'Yashvi'}
                  size="sm"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {selectedChat.type === 'group' ? selectedChat.name : 'Yashvi'}
                  </p>
                  <p className="text-[9px] text-emerald-500 font-bold capitalize mt-0.5">Active Sandbox</p>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0">
                {chatMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2.5`}
                    >
                      {!isMe && <Avatar src={msg.senderAvatar} name={msg.senderName} size="sm" />}
                      <div
                        className={`max-w-md rounded-2xl px-4 py-3 text-xs shadow-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#354E80] text-white rounded-br-none'
                            : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                        }`}
                      >
                        {!isMe && selectedChat.type === 'group' && (
                          <p className="text-[10px] font-bold text-amber-500 mb-1 leading-none">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="font-medium">{msg.content}</p>
                        <span className={`text-[8px] block text-right mt-1.5 font-bold ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3 shrink-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#354E80] focus:ring-1 focus:ring-[#354E80] font-medium"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="p-2.5 rounded-xl text-slate-400 shrink-0">
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button type="submit" variant="primary" className="p-2.5 rounded-xl shrink-0 gap-1 font-bold">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-2">
              <span className="text-4xl">💬</span>
              <p className="text-slate-400 text-xs font-semibold">Select a conversation to start chatting</p>
            </div>
          )}
        </div>

      </Card>
    </div>
  );
}
