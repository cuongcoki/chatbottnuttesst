// ============================================
// QUIZ TYPES
// ============================================

/**
 * Quiz Item - Một bài kiểm tra
 */
export interface IQuiz {
  id: string;
  student_id: string;
  date: Date; // ISO date string
  daily_count: number;
  content: string; // Markdown content chứa đề bài
  subject: string; // Môn học (Toán, Lý, Hóa, etc.)
  topic: string; // Chủ đề (Hàm số, Đạo hàm, etc.)
  difficulty: string; // Độ khó (dễ, trung bình, khó)
  num_questions: number; // Số câu hỏi
  time_limit: number; // Thời gian làm bài (phút)
  answer_key: string; // Đáp án đúng, format: "1-B,2-C,3-A,..."
  status: "pending" | "in_progress" | "completed" | "expired"; // Trạng thái bài kiểm tra
  created_at: Date; // Timestamp
}

/**
 * Quiz Filters - Bộ lọc khi tìm kiếm quiz
 */
export interface IQuizFilters {
  student_id: string | null;
  subject: string | null;
  difficulty: string | null;
  date_from: Date | null; // ISO date string
  date_to: Date | null; // ISO date string
}

/**
 * Quiz Response - Response từ API khi lấy danh sách quiz
 */
export interface IQuizResponse {
  success: boolean;
  total: number;
  filters: IQuizFilters;
  data: IQuiz[];
}

/**
 * Single Quiz Response - Response khi lấy chi tiết 1 quiz
 */
export interface ISingleQuizResponse {
  success: boolean;
  data: IQuiz;
}

/**
 * Create Quiz Request - Body khi tạo quiz mới
 */
export interface ICreateQuizRequest {
  student_id: string;
  subject: string;
  topic: string;
  difficulty: "dễ" | "trung bình" | "khó";
  num_questions: number;
  time_limit: number;
}

/**
 * Create Quiz Response - Response khi tạo quiz thành công
 */
export interface ICreateQuizResponse {
  success: boolean;
  message: string;
  data: IQuiz;
}