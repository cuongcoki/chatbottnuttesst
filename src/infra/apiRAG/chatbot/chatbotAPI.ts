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
