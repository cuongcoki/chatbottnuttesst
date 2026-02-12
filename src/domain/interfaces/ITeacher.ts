// domain/interfaces/ITeacher.ts
import { GradeLevel, IBaseEntity } from "./IEnum";

export interface IUserBasic {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  phone?: string;
}

export interface ITeacher extends IBaseEntity {
  user_id: string;
  teacher_code: string;
  bio?: string;
  avatar?: string;
  specialization: string[];
  grade_levels_taught: GradeLevel[];
  school_name: string;
}

// ✅ Response data từ API (có user_id populated)
export interface ITeacherResponseData {
  _id: string;
  user_id: IUserBasic;
  teacher_code: string;
  bio?: string;
  avatar?: string;
  specialization: string[];
  grade_levels_taught: GradeLevel[];
  school_name: string;
  created_at: string;
  updated_at: string;
}

// ✅ Response wrapper
export interface ITeacherResponse {
  success: boolean;
  message: string;
  data: ITeacherResponseData; // ✅ Đảm bảo field này có tên là "data"
}