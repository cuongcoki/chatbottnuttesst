// ============================================
// QUIZ STATISTICS TYPES
// ============================================

import { IQuiz } from "../IQuiz";
import { ISubmission } from "../ISubmission";

/**
 * Quiz Statistics - Thống kê về bài kiểm tra
 */
export interface IQuizStatistics {
  total_quizzes: number;
  completed_quizzes: number;
  pending_quizzes: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  subjects: {
    subject: string;
    count: number;
    average_score: number;
  }[];
  difficulty_breakdown: {
    difficulty: string;
    count: number;
    average_score: number;
  }[];
}

/**
 * Quiz Statistics Response
 */
export interface IQuizStatisticsResponse {
  success: boolean;
  data: IQuizStatistics;
}

// ============================================
// PARSED TYPES (For Client Use)
// ============================================

/**
 * Parsed Question - Câu hỏi đã parse từ markdown
 */
export interface IParsedQuestion {
  number: number;
  content: string;
  options: {
    key: string; // A, B, C, D
    value: string;
  }[];
}

/**
 * Parsed Quiz - Quiz đã parse content markdown
 */
export interface IParsedQuiz extends Omit<IQuiz, 'content'> {
  title: string;
  studentName: string;
  className: string;
  questions: IParsedQuestion[];
  rawContent: string; // Original markdown content
}

/**
 * Answer Map - Map câu trả lời của học sinh
 */
export interface IAnswerMap {
  [questionNumber: number]: string; // { 1: "A", 2: "B", ... }
}

/**
 * Quiz Result - Kết quả chi tiết của bài làm
 */
export interface IQuizResult {
  submission: ISubmission;
  quiz: IQuiz;
  correctAnswers: IAnswerMap;
  studentAnswers: IAnswerMap;
  questionResults: {
    questionNumber: number;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  score: number;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Quiz Difficulty - Union type cho độ khó
 */
export type QuizDifficulty = "dễ" | "trung bình" | "khó";

/**
 * Quiz Status - Union type cho trạng thái
 */
export type QuizStatus = "pending" | "in_progress" | "completed" | "expired";

/**
 * Answer Key - Type cho đáp án
 */
export type AnswerKey = string; // Format: "1-B,2-C,3-A,..."

/**
 * Student Answers - Type cho câu trả lời học sinh
 */
export type StudentAnswers = string; // Format: "1-B,2-C,3-A,..."