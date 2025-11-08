import { apiClient } from './api';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export class ChatService {
  async sendMessage(message: string, history: Message[] = []): Promise<string> {
    try {
      const response = await apiClient.chat(message, history);
      return response.botResponse;
    } catch (error) {
      console.error('Chat error:', error);
      return 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.';
    }
  }
}

export const chatService = new ChatService();