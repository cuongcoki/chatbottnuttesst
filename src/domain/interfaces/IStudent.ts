import { DifficultyLevel, GradeLevel, IBaseEntity, LearningStyle } from "./IEnum";
export interface IStudent extends IBaseEntity {
  user_id: string;
  student_code: string;
  avatar?: string;
  grade_level: GradeLevel;
  current_class?: string;
  school_name: string;
  learning_style?: LearningStyle;
  difficulty_preference?: DifficultyLevel;
  last_active?: Date;
}

export interface IUserBasic {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  phone?: string;
}


export interface IStudentResponseData {
  _id: string;
  user_id: IUserBasic;
  student_code: string;
  avatar?: string;
  grade_level: GradeLevel;
  current_class?: string;
  school_name: string;
  learning_style?: LearningStyle;
  difficulty_preference?: DifficultyLevel;
  last_active?: string;  // API trả về dạng ISO string
  created_at: string;
  updated_at: string;
}

export interface IStudentResponse {
  success: boolean;
  message: string;
  data: IStudentResponseData;
}

