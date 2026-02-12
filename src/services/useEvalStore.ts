import { create } from "zustand";
import quizAPI from "@/infra/apiRAG/quiz/quizAPI";
import {
  IEvalResponse,
  IEvalQuery,
  IEvalHistoryItem,
  IEvalSummary,
} from "@/infra/apiRAG/type/IEval";
import { handleApiError } from "@/utility/lib/errorHandler";
import { IApiError } from "@/utility/lib/IError";

// ============================================
// Eval Store State
// ============================================

interface EvalState {
  // State
  evalSummary: IEvalSummary | null;
  evalHistory: IEvalHistoryItem[];
  evalQuery: IEvalQuery;

  // UI State
  isLoading: boolean;
  error: IApiError | null;

  // Actions
  /**
   * Lấy lịch sử eval cho 1 student
   * - student_id bắt buộc
   * - days optional (ưu tiên param, nếu không có thì lấy từ evalQuery.days)
   */
  getAllEval: (student_id: string, days?: number) => Promise<void>;
  setEvalQuery: (query: Partial<IEvalQuery>) => void;

  // Clear
  clearEval: () => void;
  clearError: () => void;
  clearAll: () => void;
}

// ============================================
// Zustand Store
// ============================================

export const useEvalStore = create<EvalState>()((set, get) => ({
  // Initial State
  evalSummary: null,
  evalHistory: [],
  evalQuery: {
    days: 7,
    start_date: null,
    end_date: null,
  },

  isLoading: false,
  error: null,

  // ============================================
  // ACTION: Get All Eval (fix to call evalAPI.getAllEval)
  // ============================================
  getAllEval: async (student_id: string, days?: number) => {
    try {
      set({ isLoading: true, error: null });

      if (!student_id) {
        throw new Error("student_id is required");
      }

      // Prefer explicit days param, otherwise fallback to stored query.days
      const finalDays =
        typeof days === "number" ? days : get().evalQuery.days ?? undefined;

      // Call the API method you provided: getAllEval(student_id, days?)
      const response: IEvalResponse = await quizAPI.getAllEval(
        student_id,
        finalDays
      );

      set({
        evalSummary: response.summary,
        evalHistory: response.history,
        evalQuery: response.query,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError,
        evalSummary: null,
        evalHistory: [],
      });
      throw apiError;
    }
  },

  // ============================================
  // ACTION: Set Query Filters
  // ============================================
  setEvalQuery: (query: Partial<IEvalQuery>) => {
    set((state) => ({
      evalQuery: { ...state.evalQuery, ...query },
    }));
  },

  // ============================================
  // CLEAR FUNCTIONS
  // ============================================
  clearEval: () => {
    set({
      evalSummary: null,
      evalHistory: [],
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAll: () => {
    set({
      evalSummary: null,
      evalHistory: [],
      evalQuery: {
        days: 7,
        start_date: null,
        end_date: null,
      },
      isLoading: false,
      error: null,
    });
  },
}));
