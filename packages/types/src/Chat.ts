import { Message } from './Message';

export type ChatType = 'direct' | 'group';

export interface Chat {
  id: string;
  name?: string; // Optional (group chat name)
  projectId?: string; // Linked project if group chat
  type: ChatType;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
}
