import { create } from "zustand";
import chatbotAPI from "@/infra/apiRAG/chatbot/chatbotAPI";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

// === Types khớp với API test ===

interface ITestSession {
  session_id: string;
  title: string;
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
  isStreaming: boolean;
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
  isStreaming: false,
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
   * Gửi tin nhắn - POST /chat/stream (streaming SSE)
   * Luồng:
   *  1. isSending=true → thêm user message → hiển thị spinner "Đang suy nghĩ..."
   *  2. Nhận chunk đầu tiên → isSending=false, isStreaming=true → tạo assistant message
   *  3. Các chunk tiếp → nối vào assistant message từng ký tự
   *  4. Xong → isStreaming=false
   */
  sendMessage: async (sessionId: string, question: string) => {
    const beforeLength = get().messages.length;

    try {
      set({ isSending: true, error: null });

      const userMsg: ITestMessage = {
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
      };
      set((state) => ({ messages: [...state.messages, userMsg] }));

      let firstChunk = true;

      await chatbotAPI.sendMessageStream(sessionId, question, (chunk) => {
        if (firstChunk) {
          firstChunk = false;
          const assistantMsg: ITestMessage = {
            role: "assistant",
            content: chunk,
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, assistantMsg],
            isSending: false,
            isStreaming: true,
          }));
        } else {
          set((state) => {
            const msgs = [...state.messages];
            const last = msgs[msgs.length - 1];
            msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
            return { messages: msgs };
          });
        }
      });

      set({ isStreaming: false, isSending: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set((state) => ({
        messages: state.messages.slice(0, beforeLength),
        isSending: false,
        isStreaming: false,
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
    set({ currentSessionId: "", messages: [], isStreaming: false, error: null });
  },

  clearAll: () => {
    set({
      currentSessionId: "",
      sessions: [],
      messages: [],
      isLoading: false,
      isSending: false,
      isStreaming: false,
      error: null,
    });
  },
}));
