import { create } from "zustand";
import chatbotAPI from "@/infra/apiRAG/chatbot/chatbotAPI";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

// === Types khớp với API test ===

interface ITestSession {
  session_id: string;
  created_at: string;
  message_count?: number;
}

interface ITestMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ITestHistoryResponse {
  session_id: string;
  created_at: string;
  messages: ITestMessage[];
}

interface ChatBotState {
  // State
  currentSessionId: string;
  sessions: ITestSession[];
  messages: ITestMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: IApiError | null;

  // Actions
  createSession: () => Promise<void>;
  sendMessage: (sessionId: string, question: string) => Promise<void>;
  getSessions: () => Promise<void>;
  getHistory: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // Setters
  setCurrentSessionId: (id: string) => void;

  // Clear functions
  clearCurrentSession: () => void;
  clearAll: () => void;
}

export const useChatBotStore = create<ChatBotState>()((set, get) => ({
  // Initial State
  currentSessionId: "",
  sessions: [],
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  /**
   * Tạo phiên chat mới - POST /create_session
   * Response: { session_id, created_at }
   */
  createSession: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await chatbotAPI.createSession();

      set({
        currentSessionId: response.session_id,
        messages: [],
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ isLoading: false, error: apiError });
      throw apiError;
    }
  },

  /**
   * Lấy danh sách tất cả sessions - GET /sessions
   * Response: [{ session_id, created_at, message_count }]
   */
  getSessions: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await chatbotAPI.getSessions();

      const sessions: ITestSession[] = Array.isArray(response) ? response : [];

      set({
        sessions,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ isLoading: false, error: apiError, sessions: [] });
      throw apiError;
    }
  },

  /**
   * Lấy lịch sử chat - GET /history/{session_id}
   * Response: { session_id, created_at, messages: [{ role, content, timestamp }] }
   */
  getHistory: async (sessionId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response: ITestHistoryResponse = await chatbotAPI.getHistory(sessionId);

      set({
        messages: response.messages || [],
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ isLoading: false, error: apiError, messages: [] });
      throw apiError;
    }
  },

  /**
   * Gửi tin nhắn - POST /chat
   */
  sendMessage: async (sessionId: string, question: string) => {
    try {
      set({ isSending: true, error: null });

      // Optimistic update - hiển thị message user ngay
      const userMsg: ITestMessage = {
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
      };

      set({
        messages: [...get().messages, userMsg],
      });

      // Gọi API
      const response = await chatbotAPI.sendMessage(sessionId, question);

      // Thêm assistant response
      const assistantMsg: ITestMessage = {
        role: "assistant",
        content: response.answer || "",
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isSending: false,
      }));
    } catch (error) {
      const apiError = handleApiError(error);

      // Rollback optimistic update
      set((state) => ({
        messages: state.messages.slice(0, -1),
        isSending: false,
        error: apiError,
      }));

      throw apiError;
    }
  },

  /**
   * Xóa session - DELETE /delete_session/{session_id}
   */
  deleteSession: async (sessionId: string) => {
    try {
      set({ isLoading: true, error: null });
      await chatbotAPI.deleteSession(sessionId);
      set({ isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ isLoading: false, error: apiError });
      throw apiError;
    }
  },

  // Setters
  setCurrentSessionId: (id: string) => {
    set({ currentSessionId: id });
  },

  // Clear functions
  clearCurrentSession: () => {
    set({ currentSessionId: "", messages: [], error: null });
  },

  clearAll: () => {
    set({
      currentSessionId: "",
      sessions: [],
      messages: [],
      isLoading: false,
      isSending: false,
      error: null,
    });
  },
}));
