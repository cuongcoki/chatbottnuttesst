// ==================== ENUMS ====================

export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  DROPPED = "dropped",
  COMPLETED = "completed",
}

export enum LearningStyle {
  VISUAL = "visual",
  AUDITORY = "auditory",
  KINESTHETIC = "kinesthetic",
  READING_WRITING = "reading_writing",
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum GradeLevel {
  GRADE_10 = 10,
  GRADE_11 = 11,
  GRADE_12 = 12,
}

// ==================== BASE INTERFACE ====================

export interface IBaseEntity {
  _id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IBaseEntity1 {
  id: string;
  created_at: Date;
  updated_at: Date;
}