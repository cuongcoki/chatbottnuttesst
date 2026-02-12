import { UserRole } from "@/@core/components";
import { EnrollmentStatus, IBaseEntity } from "./IEnum";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IEnrollment extends IBaseEntity {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_at: Date;
  status: EnrollmentStatus;
  dropped_at?: Date;
  completed_at?: Date;
}


export interface IStudentInfo {
  _id: string;
  user_id: IUser;
  student_code: string;
  avatar: string;
  grade_level: number;
  current_class: string;
  school_name: string;
  learning_style: string;
  difficulty_preference: string;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface IEnrollmentItem {
  student_id: IStudentInfo;
  class_id: string;
  status: string;
  attendance_count: number;
  enrollment_date: string;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface IEnrollmentResponse {
  success: boolean;
  message: string;
  data: IEnrollmentItem[];
}




export interface IClass  {
  id: string;
  name: string;
  code: string;
  grade_level: number;
  teacher_id: string;
  subject_ids: string[];
  max_students: number;
  current_students: number;
  school_year: string;
  description: string;
  is_active: boolean;
  available_slots: number;
  created_at: Date;
  updated_at: Date;
}

// Hoặc tạo interface riêng cho trường hợp class_id là object populated
export interface IEnrollmentItemPopulated {
  student_id: string;
  class_id: IClass; // Class đã được populate
  status: string;
  attendance_count: number;
 enrollment_date: Date;
  created_at: Date;
  updated_at: Date;
  id: string;
}

// Response type cho danh sách lớp của học sinh (với class đã populated)
export interface IStudentClassesResponse {
  success: boolean;
  message: string;
  data: IEnrollmentItemPopulated[];
}