export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  messageContent: string;
  timestamp: number;
}
