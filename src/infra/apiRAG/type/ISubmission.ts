// ============================================
// SUBMISSION TYPES
// ============================================

/**
 * Submission Item - Một bài làm đã nộp
 */
export interface ISubmission {
  id: string;
  quiz_id: string;
  student_id: string;
  student_answers: string; // Câu trả lời của học sinh, format: "1-B,2-C,3-A,..."
  score: number; // Điểm số (0-10)
  daily_count: number; // Số bài làm trong ngày
  submitted_at: Date; // ISO timestamp
  duration: number; // Thời gian làm bài (phút)
}

/**
 * Submission Filters - Bộ lọc khi tìm kiếm submission
 */
export interface ISubmissionFilters {
  student_id: string | null;
  quiz_id: string | null;
  date_from: Date | null; // ISO date string
  date_to: Date | null; // ISO date string
}

/**
 * Submission Response - Response từ API khi lấy danh sách submission
 */
export interface ISubmissionResponse {
  success: boolean;
  total: number;
  filters: ISubmissionFilters;
  data: ISubmission[];
}

/**
 * Single Submission Response - Response khi lấy chi tiết 1 submission
 */
export interface ISingleSubmissionResponse {
  success: boolean;
  data: ISubmission;
}

/**
 * Submit Quiz Request - Body khi nộp bài
 */
export interface ISubmitQuizRequest {
  quiz_id: string;
  student_id: string;
  student_answers: string; // Format: "1-B,2-C,3-A,..."
  duration: number; // Thời gian làm bài (phút)
}

/**
 * Submit Quiz Response - Response khi nộp bài thành công
 */
export interface ISubmitQuizResponse {
  success: boolean;
  message: string;
  data: ISubmission;
  score: number;
  correct_answers: number;
  total_questions: number;
}