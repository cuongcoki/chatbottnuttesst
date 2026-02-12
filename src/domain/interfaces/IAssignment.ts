/**
 * Interface for Attachment
 */
export interface IAttachment {
  filename: string;
  url: string;
  size: number;
  type: string;
}

/**
 * Interface for Assignment
 */
export interface IAssignment {
  id?: string;
  class_id: string | IClassInfo;
  code: string;
  title: string;
  description?: string;
  subject_id: string | ISubjectInfo;
  due_date: string;
  max_score: number;
  total_submitted: number;
  total_unsubmitted: number;
  passing_score: number;
  attachments?: IAttachment[];
  auto_grade_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  // Virtuals
  total_assignments?: number;
  completion_rate?: number;
  days_until_due?: number;
}

/**
 * Interface for Class info (populated)
 */
export interface IClassInfo {
  _id?: string;
  name: string;
  code: string;
}

/**
 * Interface for Subject info (populated)
 */
export interface ISubjectInfo {
  _id?: string;
  name: string;
  code: string;
}

/**
 * Interface for creating assignment
 */
export interface ICreateAssignment {
  class_id: string;
  code: string;
  title: string;
  description?: string;
  subject_id: string;
  due_date: string;
  max_score?: number;
  passing_score: number;
  attachments?: IAttachment[];
  auto_grade_enabled?: boolean;
}

/**
 * Interface for updating assignment
 */
export interface IUpdateAssignment {
  title?: string;
  description?: string;
  due_date?: string;
  max_score?: number;
  passing_score?: number;
  attachments?: IAttachment[];
  auto_grade_enabled?: boolean;
}

/**
 * Interface for assignment statistics
 */
export interface IAssignmentStatistics {
  total_students: number;
  submitted: number;
  not_submitted: number;
  graded: number;
  late: number;
  submission_rate: number;
  average_score: number;
  passed: number;
  failed: number;
}

/**
 * Interface for assignment statistics response
 */
export interface IAssignmentStatisticsResponse {
  assignment: IAssignment;
  statistics: IAssignmentStatistics;
}

/**
 * Interface for pagination
 */
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Interface for assignment list response
 */
export interface IAssignmentListResponse {
  success: boolean;
  message: string;
  data: {
    assignments: IAssignment[];
    pagination: IPagination;
  };
}

/**
 * Interface for single assignment response
 */
export interface IAssignmentResponse {
  success: boolean;
  message: string;
  data: IAssignment;
}

/**
 * Interface for statistics response
 */
export interface IStatisticsResponse {
  success: boolean;
  message: string;
  data: IAssignmentStatisticsResponse;
}

/**
 * Interface for query params
 */
export interface IAssignmentParams {
  page?: number;
  limit?: number;
  classId?: string;
  subjectId?: string;
  days?: number;
}
