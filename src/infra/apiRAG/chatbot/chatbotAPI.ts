import axiosInstance from "../conflig/axiosInstance";
import { API_ENDPOINTS } from "../conflig/apiEndpoints";

class ChatBotAPI {
  /**
   * Tạo phiên chat mới (session)
   * POST /create_session
   */
  async createSession() {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RAG.CREATE_SESSIONS
    );
    return response.data;
  }

  /**
   * Gửi câu hỏi đến RAG model và nhận phản hồi
   * POST /chat
   */
  async sendMessage(session_id: string, question: string) {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RAG.RAG_QUERY,
      {
        session_id,
        question,
        use_bm25: false,
        top_k: 7,
      }
    );
    return response.data;
  }

  /**
   * Lấy danh sách tất cả sessions
   * GET /sessions
   */
  async getSessions() {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RAG.GET_SESSIONS
    );
    return response.data;
  }

  /**
   * Lấy lịch sử chat của 1 session
   * GET /history/{session_id}
   */
  async getHistory(session_id: string) {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RAG.GET_HISTORY(session_id)
    );
    return response.data;
  }

  /**
   * Gửi câu hỏi và nhận phản hồi dạng stream (SSE)
   * POST /chat/stream
   * Backend trả về: "data: <chunk>\n\n" mỗi token, kết thúc bằng "data: [DONE]\n\n"
   */
  async sendMessageStream(
    session_id: string,
    question: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const BASE_URL = import.meta.env.VITE_API_RAG_URL || "http://14.225.211.7:8504";

    const response = await fetch(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, question, use_bm25: false, top_k: 7 }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        try {
          // Backend gửi: {"content": "...", "done": false/true, "sources": [...]}
          const parsed = JSON.parse(raw) as { content: string; done: boolean };
          if (parsed.done) return;
          if (parsed.content) onChunk(parsed.content);
        } catch {
          // fallback: plain text chunk
          onChunk(raw);
        }
      }
    }
  }

  /**
   * Xóa session
   * DELETE /delete_session/{session_id}
   */
  async deleteSession(session_id: string) {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.RAG.DELETE_SESSION(session_id)
    );
    return response.data;
  }
}

export default new ChatBotAPI();
