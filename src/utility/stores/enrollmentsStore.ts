import { create } from "zustand";
import enrollmentsAPI from "@/infra/api/enrollments/enrollmentsAPI";
import { IEnrollmentItem, IEnrollmentItemPopulated } from "@/domain/interfaces/IErollment";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

interface EnrollmentState {
  // State
  enrollments: IEnrollmentItem[];
  studentClasses: IEnrollmentItemPopulated[];
  selectedStudentClass: IEnrollmentItemPopulated | null;
  isLoading: boolean;
  error: IApiError | null;
  // Actions
  getEnrollmentsByClass: (classId: string) => Promise<void>;
  getEnrollmentsByStudent: (studentId: string) => Promise<void>;
  setEnrollments: (enrollments: IEnrollmentItem[]) => void;
  setSelectedStudentClass: (enrollment: IEnrollmentItemPopulated | null) => void;
  clearEnrollments: () => void;
  clearError: () => void;
}

export const useEnrollmentStore = create<EnrollmentState>()((set) => ({
  // Initial State
  enrollments: [],
  studentClasses: [],
  selectedStudentClass: null,
  isLoading: false,
  error: null,

  /**
   * Lấy danh sách enrollments theo classId
   */
  getEnrollmentsByClass: async (classId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await enrollmentsAPI.getEnrollmentsByClass(classId);

      set({
        enrollments: response.data || [],
        isLoading: false,
      });

      // toast.success("Tải danh sách học viên thành công!");
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        error: apiError,
        isLoading: false,
        enrollments: [],
      });

      throw error;
    }
  },

  /**
   * Lấy danh sách lớp học của học sinh theo studentId
   */
  getEnrollmentsByStudent: async (studentId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await enrollmentsAPI.getEnrollmentsByStudent(studentId);

      set({
        studentClasses: response.data || [],
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        error: apiError,
        isLoading: false,
        studentClasses: [],
      });

      throw error;
    }
  },

  /**
   * Set enrollments trực tiếp
   */
  setEnrollments: (enrollments: IEnrollmentItem[]) => {
    set({ enrollments });
  },

  /**
   * Set selected student class
   */
  setSelectedStudentClass: (enrollment: IEnrollmentItemPopulated | null) => {
    set({ selectedStudentClass: enrollment });
  },

  /**
   * Clear danh sách enrollments
   */
  clearEnrollments: () => {
    set({ enrollments: [], error: null, selectedStudentClass: null });
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },
}));