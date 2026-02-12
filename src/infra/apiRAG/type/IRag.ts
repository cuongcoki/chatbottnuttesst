

// Rag Query
export interface ISession {
  id: string;
  name: string;
  student_id: string;
  message_count: number;
}

export interface IRagQueryResponse {
  success: boolean;
  user_input: string;
  has_image: boolean;
  session: ISession;
  response: string;
}


// Create Session
export interface ISession1 {
  id: string;
  student_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
}

export interface IStudentInfo {
  id: string;
  name: string;
  grade: number;
  class: string;
}

export interface ICreateSessionResponse {
  success: boolean;
  session: ISession1;
  student_info: IStudentInfo;
  response: string | null;
  has_first_message: boolean;
}


// list Get Session History

export interface ISessionItem {
  id: string;
  student_id: string;
  name: string;
  first_message: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
  is_archived: number; // 0 = chưa lưu trữ, 1 = đã lưu trữ
}

export interface ISessionHistoryResponse {
  success: boolean;
  student_id: string;
  count: number;
  sessions: ISessionItem[];
}

// Get Session detail

export interface IUserMessage {
  content: string;
  timestamp: string;
  image?: string;
}

export interface IChatbotMessage {
  content: string;
  timestamp: string;
}

export interface IConversationPair {
  user: IUserMessage;
  chatbot: IChatbotMessage;
}

export interface ISessionDetail {
  id: string;
  name: string;
  student_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  is_archived: number;
}

export interface ISessionDetailResponse {
  success: boolean;
  session: ISessionDetail;
  conversation: IConversationPair[];
  total_pairs: number;
}

