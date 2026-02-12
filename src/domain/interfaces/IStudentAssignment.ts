import { IAssignment } from "./IAssignment";
import { IPagination } from "./IAssignment";

/**
 * Interface for Student info (populated)
 */
export interface IStudentInfo {
  _id?: string;
  student_code: string;
  user_id?: string | IUserInfo;
}

/**
 * Interface for User info (populated)
 */
export interface IUserInfo {
  _id?: string;
  full_name?: string;
  email?: string;
  username?: string;
  avatar?: string;
}

/**
 * Interface for Teacher info (populated)
 */
export interface ITeacherInfo {
  _id?: string;
  teacher_code: string;
  user_id?: string | IUserInfo;
}

/**
 * Student Assignment status
 */
export type StudentAssignmentStatus = 'not_submitted' | 'submitted' | 'graded' | 'late';

/**
 * Interface for StudentAssignment
 */
export interface IStudentAssignment {
  id?: string;
  student_id: string | IStudentInfo;
  assignment_id: string | IAssignment;
  submission_file?: string;
  submission_text?: string;
  submitted_at?: string;
  due_date: string;
  score?: number;
  feedback?: string;
  status: StudentAssignmentStatus;
  graded_at?: string;
  graded_by?: string | ITeacherInfo;
  created_at?: string;
  updated_at?: string;
  // Virtuals
  is_late?: boolean;
  days_late?: number;
}

/**
 * Interface for creating student assignment
 */
export interface ICreateStudentAssignment {
  student_id: string;
  assignment_id: string;
  due_date?: string;
}

/**
 * Interface for submitting assignment
 */
export interface ISubmitAssignment {
  submission_file?: string;
  submission_text?: string;
}

/**
 * Interface for grading assignment
 */
export interface IGradeAssignment {
  score: number;
  feedback?: string;
}

/**
 * Interface for updating student assignment
 */
export interface IUpdateStudentAssignment {
  submission_file?: string;
  submission_text?: string;
  score?: number;
  feedback?: string;
  status?: StudentAssignmentStatus;
}

/**
 * Interface for student assignment list response
 */
export interface IStudentAssignmentListResponse {
  success: boolean;
  message: string;
  data: {
    studentAssignments: IStudentAssignment[];
    pagination: IPagination;
  };
}

/**
 * Interface for single student assignment response
 */
export interface IStudentAssignmentResponse {
  success: boolean;
  message: string;
  data: IStudentAssignment;
}

/**
 * Interface for student assignment array response (no pagination)
 */
export interface IStudentAssignmentArrayResponse {
  success: boolean;
  message: string;
  data: IStudentAssignment[];
}

/**
 * Interface for query params
 */
export interface IStudentAssignmentParams {
  page?: number;
  limit?: number;
  assignmentId?: string;
}

/**
 * Interface for basic response
 */
export interface IBasicResponse {
  success: boolean;
  message: string;
}
