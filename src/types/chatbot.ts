export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string; // ISO string to be JSON serializable
}

export interface ChatSession {
  messages: Message[];
  isLoading: boolean;
}

export interface SuggestionChip {
  text: string;
  icon: string;
  query: string;
}
