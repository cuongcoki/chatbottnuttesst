import { create } from "zustand";
import ClassAPI from "@/infra/api/teacher/teacherAPI";
import { IClass } from "@/domain/interfaces/IClass";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

interface ClassState {
  // State
  classes: IClass[];
  isLoading: boolean;
  error: IApiError | null;
  idClass: string;

  // Actions
  getClassesByTeacher: (teacherId: string) => Promise<void>;
  setClasses: (classes: IClass[]) => void;
  setIdClass: (idClass: string) => void;
  getIdClass: () => string;
  clearClasses: () => void;
  clearError: () => void;
}

export const useClassStore = create<ClassState>()((set, get) => ({
  // Initial State
  classes: [],
  isLoading: false,
  error: null,
  idClass: "",

  // Actions
  getIdClass: () => get().idClass,
  setIdClass: (idClass: string) => set({ idClass }),

  /**
   * Lấy danh sách lớp học theo teacherId
   */
  getClassesByTeacher: async (teacherId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ClassAPI.getClassesByTeacher(teacherId);

      set({
        classes: response.data || [],
        isLoading: false,
      });

      // toast.success("Tải danh sách lớp học thành công!");
    } catch (error) {
      const apiError = handleApiError(error);

      set({
        isLoading: false,
        error: apiError,
        classes: [],
      });
    }
  },

  /**
   * Set classes trực tiếp
   */
  setClasses: (classes: IClass[]) => {
    set({ classes });
  },

  /**
   * Clear danh sách classes
   */
  clearClasses: () => {
    set({ classes: [], error: null });
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },
}));
