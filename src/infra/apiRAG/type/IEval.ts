// ============================================
// EVAL TYPES
// ============================================

/**
 * Eval Rating Distribution - phân bố đánh giá theo loại (Giỏi, Khá, Trung bình...)
 */
export interface IEvalRatingDistribution {
  [rating: string]: number;
}

/**
 * Eval Query - tham số query khi gọi API
 */
export interface IEvalQuery {
  days: number | null;
  start_date: string | null; // ISO date string
  end_date: string | null;   // ISO date string
}

/**
 * Eval Summary - tổng hợp thống kê
 */
export interface IEvalSummary {
  total_days: number;
  avg_total_score: number;
  avg_daily_submissions: number;
  avg_score: number;
  rating_distribution: IEvalRatingDistribution;
  date_range: {
    from: string; // ISO date string
    to: string;   // ISO date string
  };
}

/**
 * Eval History Item - lịch sử đánh giá theo ngày
 */
export interface IEvalHistoryItem {
  id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  total_submissions: number;
  avg_score: number;
  on_time_rate: number;
  participation_score: number;
  competence_score: number;
  discipline_score: number;
  total_score: number;
  rating: string;
  teacher_comment: string | null;
  created_at: string; // Timestamp ISO
  updated_at: string; // Timestamp ISO
}

/**
 * Eval Response - response từ API
 */
export interface IEvalResponse {
  success: boolean;
  student_id: string;
  query: IEvalQuery;
  summary: IEvalSummary;
  history: IEvalHistoryItem[];
}
