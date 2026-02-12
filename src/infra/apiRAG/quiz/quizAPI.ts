import axiosInstance from "../conflig/axiosInstance";
import { API_ENDPOINTS } from "../conflig/apiEndpoints";
import {
  IQuizResponse,
  IQuizFilters,
} from "../type/IQuiz";
import {
  ISubmissionResponse,
  ISubmissionFilters,
} from "../type/ISubmission";
import { IEvalResponse } from "../type/IEval";

class QuizAPI {

async getAllEval(student_id: string, days?: number): Promise<IEvalResponse> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.EVAL.GET_EVAL(student_id, days)
    );
    return response.data;
  }



  /**
   * 🔹 Lấy danh sách tất cả quiz với filters
   * @param filters - Bộ lọc (student_id, subject, difficulty, date range)
   */
  async getAllQuiz(filters?: Partial<IQuizFilters>): Promise<IQuizResponse> {
    const defaultFilters: IQuizFilters = {
      student_id: null,
      subject: null,
      difficulty: null,
      date_from: null,
      date_to: null,
      ...filters,
    };

    const response = await axiosInstance.get(
      API_ENDPOINTS.QUIZ.GET_QUIZZES(defaultFilters)
    );
    return response.data;
  }

  /**
   * 🔹 Lấy danh sách submissions với filters
   * @param filters - Bộ lọc (student_id, quiz_id, date range)
   */
  async getSubmissions(
    filters?: Partial<ISubmissionFilters>
  ): Promise<ISubmissionResponse> {
    const defaultFilters: ISubmissionFilters = {
      student_id: null,
      quiz_id: null,
      date_from: null,
      date_to: null,
      ...filters,
    };

    const response = await axiosInstance.get(
      API_ENDPOINTS.SUBMISSION.GET_SUBMISSIONS(defaultFilters)
    );
    return response.data;
  }
}

export default new QuizAPI();