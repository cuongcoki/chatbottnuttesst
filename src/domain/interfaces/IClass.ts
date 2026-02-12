
import { ISubject } from "./ISubject";
import { ITeacher } from "./ITeacher";

export interface IClass  {
  id: string;
  name: string;
  code: string;
  grade_level: number;
  teacher_id: string;
  subject_ids: string[];          
  subjects?: ISubject[];          
  max_students: number;
  current_students: number;
  school_year: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  available_slots: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClassResponse {
  success: boolean;
  message: string;
  data: IClass[];
}

export interface ITeacherResponse {
  success: boolean;
  message: string;
  data: ITeacher;
}