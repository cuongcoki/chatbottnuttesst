import { create } from "zustand";
import quizAPI from "@/infra/apiRAG/quiz/quizAPI";
import {
  IQuiz,
  IQuizFilters,

} from "@/infra/apiRAG/type/IQuiz";
import {
  ISubmission,
  ISubmissionFilters,
 
} from "@/infra/apiRAG/type/ISubmission";

import { IQuizResult,   IParsedQuiz,
  IAnswerMap,} from "@/infra/apiRAG/type/quiz/types";
import { handleApiError } from "@/utility/lib/errorHandler";
import { IApiError } from "@/utility/lib/IError";
import {
  parseAnswers,
  parseQuizContent,
} from "@/infra/apiRAG/type/quiz/helpers";

interface QuizState {
  // State - Quizzes
  quizzes: IQuiz[];
  currentQuiz: IQuiz | null;
  parsedQuiz: IParsedQuiz | null;
  
  // State - Submissions
  submissions: ISubmission[];
  currentSubmission: ISubmission | null;
  quizResult: IQuizResult | null;
  
  // Filters
  quizFilters: IQuizFilters;
  submissionFilters: ISubmissionFilters;
  
  // UI State
  isLoading: boolean;
  error: IApiError | null;
  
  // Quiz Interaction
  currentAnswers: IAnswerMap;
  timeRemaining: number; // seconds
  isQuizStarted: boolean;

  // Actions - Quiz
  getAllQuiz: (filters?: Partial<IQuizFilters>) => Promise<void>;
  setQuizFilters: (filters: Partial<IQuizFilters>) => void;
  
  // Actions - Submission
  getSubmissions: (filters?: Partial<ISubmissionFilters>) => Promise<void>;
  setSubmissionFilters: (filters: Partial<ISubmissionFilters>) => void;
  
  // Quiz Interaction Actions
  setCurrentQuiz: (quiz: IQuiz | null) => void;
  parseCurrentQuiz: (quiz: IQuiz) => void;
  setCurrentAnswer: (questionNumber: number, answer: string) => void;
  clearCurrentAnswers: () => void;
  startQuiz: (quiz: IQuiz) => void;
  endQuiz: () => void;
  setTimeRemaining: (seconds: number) => void;
  
  // Result Actions
  calculateQuizResult: (submission: ISubmission, quiz: IQuiz) => void;
  
  // Clear functions
  clearQuizzes: () => void;
  clearCurrentQuiz: () => void;
  clearSubmissions: () => void;
  clearError: () => void;
  clearAll: () => void;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  // Initial State
  quizzes: [],
  currentQuiz: null,
  parsedQuiz: null,
  submissions: [],
  currentSubmission: null,
  quizResult: null,
  
  quizFilters: {
    student_id: null,
    subject: null,
    difficulty: null,
    date_from: null,
    date_to: null,
  },
  submissionFilters: {
    student_id: null,
    quiz_id: null,
    date_from: null,
    date_to: null,
  },
  
  isLoading: false,
  error: null,
  
  currentAnswers: {},
  timeRemaining: 0,
  isQuizStarted: false,

  // ==================== QUIZ ACTIONS ====================

  /**
   * 🔹 Lấy danh sách quiz
   */
  getAllQuiz: async (filters?: Partial<IQuizFilters>) => {
    try {
      set({ isLoading: true, error: null });

      const finalFilters = { ...get().quizFilters, ...filters };
      const response = await quizAPI.getAllQuiz(finalFilters);
      console.log("tại sao ko ra",response)

      set({
        quizzes: response.data || [],
        quizFilters: response.filters,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError,
        quizzes: [],
      });
      throw apiError;
    }
  },

  /**
   * 🔹 Set quiz filters
   */
  setQuizFilters: (filters: Partial<IQuizFilters>) => {
    set((state) => ({
      quizFilters: { ...state.quizFilters, ...filters },
    }));
  },

  // ==================== SUBMISSION ACTIONS ====================

  /**
   * 🔹 Lấy danh sách submissions
   */
  getSubmissions: async (filters?: Partial<ISubmissionFilters>) => {
    try {
      set({ isLoading: true, error: null });

      const finalFilters = { ...get().submissionFilters, ...filters };
      const response = await quizAPI.getSubmissions(finalFilters);

      set({
        submissions: response.data || [],
        submissionFilters: response.filters,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError,
        submissions: [],
      });
      throw apiError;
    }
  },

  /**
   * 🔹 Set submission filters
   */
  setSubmissionFilters: (filters: Partial<ISubmissionFilters>) => {
    set((state) => ({
      submissionFilters: { ...state.submissionFilters, ...filters },
    }));
  },

  // ==================== QUIZ INTERACTION ====================

  /**
   * 🔹 Set current quiz
   */
  setCurrentQuiz: (quiz: IQuiz | null) => {
    set({ currentQuiz: quiz });
    
    if (quiz) {
      get().parseCurrentQuiz(quiz);
    } else {
      set({ parsedQuiz: null });
    }
  },

  /**
   * 🔹 Parse quiz content từ markdown
   */
  parseCurrentQuiz: (quiz: IQuiz) => {
    try {
      const questions = parseQuizContent(quiz.content);
      
      const parsedQuiz: IParsedQuiz = {
        ...quiz,
        title: `${quiz.subject} - ${quiz.topic}`,
        studentName: "", // Có thể lấy từ auth store
        className: "", // Có thể lấy từ auth store
        questions,
        rawContent: quiz.content,
      };

      set({ parsedQuiz });
    } catch (error) {
      console.error("Error parsing quiz content:", error);
      set({ parsedQuiz: null });
    }
  },

  /**
   * 🔹 Set câu trả lời hiện tại
   */
  setCurrentAnswer: (questionNumber: number, answer: string) => {
    set((state) => ({
      currentAnswers: {
        ...state.currentAnswers,
        [questionNumber]: answer,
      },
    }));
  },

  /**
   * 🔹 Clear tất cả câu trả lời
   */
  clearCurrentAnswers: () => {
    set({ currentAnswers: {} });
  },

  /**
   * 🔹 Bắt đầu làm quiz
   */
  startQuiz: (quiz: IQuiz) => {
    set({
      currentQuiz: quiz,
      isQuizStarted: true,
      timeRemaining: quiz.time_limit * 60, // Convert to seconds
      currentAnswers: {},
    });
    
    get().parseCurrentQuiz(quiz);
  },

  /**
   * 🔹 Kết thúc quiz
   */
  endQuiz: () => {
    set({
      isQuizStarted: false,
      timeRemaining: 0,
    });
  },

  /**
   * 🔹 Set thời gian còn lại
   */
  setTimeRemaining: (seconds: number) => {
    set({ timeRemaining: seconds });
  },

  // ==================== RESULT ACTIONS ====================

  /**
   * 🔹 Tính toán kết quả quiz
   */
  calculateQuizResult: (submission: ISubmission, quiz: IQuiz) => {
    try {
      const correctAnswers = parseAnswers(quiz.answer_key);
      const studentAnswers = parseAnswers(submission.student_answers);

      const questionResults = Object.keys(correctAnswers).map((key) => {
        const questionNumber = parseInt(key);
        const studentAnswer = studentAnswers[questionNumber] || "";
        const correctAnswer = correctAnswers[questionNumber];
        
        return {
          questionNumber,
          studentAnswer,
          correctAnswer,
          isCorrect: studentAnswer === correctAnswer,
        };
      });

      const correctCount = questionResults.filter((r) => r.isCorrect).length;
      const totalQuestions = Object.keys(correctAnswers).length;

      const quizResult: IQuizResult = {
        submission,
        quiz,
        correctAnswers,
        studentAnswers,
        questionResults,
        score: submission.score,
        correctCount,
        totalQuestions,
        percentage: (correctCount / totalQuestions) * 100,
      };

      set({
        currentSubmission: submission,
        quizResult,
      });
    } catch (error) {
      console.error("Error calculating quiz result:", error);
      set({ quizResult: null });
    }
  },

  // ==================== CLEAR FUNCTIONS ====================

  clearQuizzes: () => {
    set({ quizzes: [], error: null });
  },

  clearCurrentQuiz: () => {
    set({
      currentQuiz: null,
      parsedQuiz: null,
      currentAnswers: {},
      isQuizStarted: false,
      timeRemaining: 0,
      error: null,
    });
  },

  clearSubmissions: () => {
    set({ 
      submissions: [], 
      currentSubmission: null,
      quizResult: null,
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAll: () => {
    set({
      quizzes: [],
      currentQuiz: null,
      parsedQuiz: null,
      submissions: [],
      currentSubmission: null,
      quizResult: null,
      currentAnswers: {},
      isQuizStarted: false,
      timeRemaining: 0,
      isLoading: false,
      error: null,
    });
  },
}));