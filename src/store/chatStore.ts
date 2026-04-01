import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tokens?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  modelLoaded: boolean;
  memoryUsage: number;
  
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setModelLoaded: (loaded: boolean) => void;
  setMemoryUsage: (usage: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  modelLoaded: false,
  memoryUsage: 0,

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setModelLoaded: (loaded: boolean) => set({ modelLoaded: loaded }),
  setMemoryUsage: (usage: number) => set({ memoryUsage: usage }),
}));
