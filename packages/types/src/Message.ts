export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string; // e.g. "image", "pdf", "file"
  createdAt: string;
}
