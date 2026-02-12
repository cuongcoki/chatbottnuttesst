import { create } from "zustand";
import StudentAssignmentAPI from "@/infra/api/StudentAssignmentAPI";
import {
  IStudentAssignment,
  ICreateStudentAssignment,
  ISubmitAssignment,
  IGradeAssignment,
  IUpdateStudentAssignment,
  IStudentAssignmentParams,
} from "@/domain/interfaces/IStudentAssignment";
import { IPagination } from "@/domain/interfaces/IAssignment";
import toast from "react-hot-toast";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

interface StudentAssignmentState {
  // State
  studentAssignments: IStudentAssignment[];
  myAssignments: IStudentAssignment[];
  myUnsubmitted: IStudentAssignment[];
  gradedByMe: IStudentAssignment[];
  currentStudentAssignment: IStudentAssignment | null;
  pagination: IPagination | null;
  isLoading: boolean;
  error: IApiError | null;

  // Actions - CRUD
  fetchAllStudentAssignments: (params?: IStudentAssignmentParams) => Promise<void>;
  fetchStudentAssignmentById: (studentAssignmentId: string) => Promise<void>;
  createStudentAssignment: (data: ICreateStudentAssignment) => Promise<IStudentAssignment>;
  updateStudentAssignment: (
    studentAssignmentId: string,
    data: IUpdateStudentAssignment
  ) => Promise<void>;
  deleteStudentAssignment: (studentAssignmentId: string) => Promise<void>;

  // Actions - Student
  fetchMyAssignments: (params?: IStudentAssignmentParams) => Promise<void>;
  fetchMyUnsubmitted: () => Promise<void>;
  submitAssignment: (
    studentAssignmentId: string,
    data: ISubmitAssignment
  ) => Promise<void>;

  // Actions - Teacher
  fetchGradedByMe: (params?: IStudentAssignmentParams) => Promise<void>;
  fetchSubmissionsByAssignment: (params: IStudentAssignmentParams) => Promise<void>;
  fetchAssignmentsByStudent: (
    studentId: string,
    params?: IStudentAssignmentParams
  ) => Promise<void>;
  fetchUnsubmittedByStudent: (studentId: string) => Promise<void>;
  gradeAssignment: (
    studentAssignmentId: string,
    data: IGradeAssignment
  ) => Promise<void>;

  // Helpers
  setCurrentStudentAssignment: (studentAssignment: IStudentAssignment | null) => void;
  clearStudentAssignments: () => void;
  clearError: () => void;
}

export const useStudentAssignmentStore = create<StudentAssignmentState>()(
  (set) => ({
    // Initial State
    studentAssignments: [],
    myAssignments: [],
    myUnsubmitted: [],
    gradedByMe: [],
    currentStudentAssignment: null,
    pagination: null,
    isLoading: false,
    error: null,

    /**
     * Fetch all student assignments (admin/teacher)
     */
    fetchAllStudentAssignments: async (params?: IStudentAssignmentParams) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getAllStudentAssignments(params);

        set({
          studentAssignments: response.data.studentAssignments || [],
          pagination: response.data.pagination || null,
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Fetch student assignment by ID
     */
    fetchStudentAssignmentById: async (studentAssignmentId: string) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getStudentAssignmentById(
          studentAssignmentId
        );

        set({
          currentStudentAssignment: response.data,
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Create student assignment
     */
    createStudentAssignment: async (data: ICreateStudentAssignment) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.createStudentAssignment(data);

        set((state) => ({
          studentAssignments: [response.data, ...state.studentAssignments],
          isLoading: false,
        }));

        toast.success("Tạo student assignment thành công!");

        return response.data;
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        toast.error("Tạo student assignment thất bại!");
        throw error;
      }
    },

    /**
     * Update student assignment
     */
    updateStudentAssignment: async (
      studentAssignmentId: string,
      data: IUpdateStudentAssignment
    ) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.updateStudentAssignment(
          studentAssignmentId,
          data
        );

        // Update in all lists
        const updateList = (list: IStudentAssignment[]) =>
          list.map((sa) => (sa.id === studentAssignmentId ? response.data : sa));

        set((state) => ({
          studentAssignments: updateList(state.studentAssignments),
          myAssignments: updateList(state.myAssignments),
          gradedByMe: updateList(state.gradedByMe),
          currentStudentAssignment:
            state.currentStudentAssignment?.id === studentAssignmentId
              ? response.data
              : state.currentStudentAssignment,
          isLoading: false,
        }));

        toast.success("Cập nhật thành công!");
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        toast.error("Cập nhật thất bại!");
        throw error;
      }
    },

    /**
     * Delete student assignment
     */
    deleteStudentAssignment: async (studentAssignmentId: string) => {
      try {
        set({ isLoading: true, error: null });

        await StudentAssignmentAPI.deleteStudentAssignment(studentAssignmentId);

        // Remove from all lists
        const filterList = (list: IStudentAssignment[]) =>
          list.filter((sa) => sa.id !== studentAssignmentId);

        set((state) => ({
          studentAssignments: filterList(state.studentAssignments),
          myAssignments: filterList(state.myAssignments),
          myUnsubmitted: filterList(state.myUnsubmitted),
          gradedByMe: filterList(state.gradedByMe),
          currentStudentAssignment:
            state.currentStudentAssignment?.id === studentAssignmentId
              ? null
              : state.currentStudentAssignment,
          isLoading: false,
        }));

        toast.success("Xóa thành công!");
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        toast.error("Xóa thất bại!");
        throw error;
      }
    },

    /**
     * Fetch my assignments (student)
     */
    fetchMyAssignments: async (params?: IStudentAssignmentParams) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getMyAssignments(params);

        set({
          myAssignments: response.data.studentAssignments || [],
          pagination: response.data.pagination || null,
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Fetch my unsubmitted (student)
     */
    fetchMyUnsubmitted: async () => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getMyUnsubmitted();

        set({
          myUnsubmitted: response.data || [],
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Submit assignment (student)
     */
    submitAssignment: async (
      studentAssignmentId: string,
      data: ISubmitAssignment
    ) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.submitAssignment(
          studentAssignmentId,
          data
        );

        // Update in lists
        const updateList = (list: IStudentAssignment[]) =>
          list.map((sa) => (sa.id === studentAssignmentId ? response.data : sa));

        set((state) => ({
          myAssignments: updateList(state.myAssignments),
          myUnsubmitted: state.myUnsubmitted.filter(
            (sa) => sa.id !== studentAssignmentId
          ),
          currentStudentAssignment:
            state.currentStudentAssignment?.id === studentAssignmentId
              ? response.data
              : state.currentStudentAssignment,
          isLoading: false,
        }));

        toast.success("Nộp bài thành công!");
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        toast.error("Nộp bài thất bại!");
        throw error;
      }
    },

    /**
     * Fetch graded by me (teacher)
     */
    fetchGradedByMe: async (params?: IStudentAssignmentParams) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getGradedByMe(params);

        set({
          gradedByMe: response.data.studentAssignments || [],
          pagination: response.data.pagination || null,
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Fetch submissions by assignment (teacher)
     */
    fetchSubmissionsByAssignment: async (params: IStudentAssignmentParams) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getSubmissionsByAssignment(
          params
        );

        set({
          studentAssignments: response.data.studentAssignments || [],
          pagination: response.data.pagination || null,
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Fetch assignments by student (teacher)
     */
    fetchAssignmentsByStudent: async (
      studentId: string,
      params?: IStudentAssignmentParams
    ) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getAssignmentsByStudent(
          studentId,
          params
        );

        set({
          studentAssignments: response.data.studentAssignments || [],
          pagination: response.data.pagination || null,
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Fetch unsubmitted by student (teacher)
     */
    fetchUnsubmittedByStudent: async (studentId: string) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.getUnsubmittedByStudent(
          studentId
        );

        set({
          studentAssignments: response.data || [],
          isLoading: false,
        });
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        throw error;
      }
    },

    /**
     * Grade assignment (teacher)
     */
    gradeAssignment: async (
      studentAssignmentId: string,
      data: IGradeAssignment
    ) => {
      try {
        set({ isLoading: true, error: null });

        const response = await StudentAssignmentAPI.gradeAssignment(
          studentAssignmentId,
          data
        );

        // Update in lists
        const updateList = (list: IStudentAssignment[]) =>
          list.map((sa) => (sa.id === studentAssignmentId ? response.data : sa));

        set((state) => ({
          studentAssignments: updateList(state.studentAssignments),
          gradedByMe: [response.data, ...state.gradedByMe],
          currentStudentAssignment:
            state.currentStudentAssignment?.id === studentAssignmentId
              ? response.data
              : state.currentStudentAssignment,
          isLoading: false,
        }));

        toast.success("Chấm điểm thành công!");
      } catch (error) {
        const apiError = error as IApiError;
        const errorMessage = handleApiError(apiError);

        set({
          error: errorMessage,
          isLoading: false,
        });

        toast.error("Chấm điểm thất bại!");
        throw error;
      }
    },

    /**
     * Set current student assignment
     */
    setCurrentStudentAssignment: (
      studentAssignment: IStudentAssignment | null
    ) => {
      set({ currentStudentAssignment: studentAssignment });
    },

    /**
     * Clear student assignments
     */
    clearStudentAssignments: () => {
      set({
        studentAssignments: [],
        myAssignments: [],
        myUnsubmitted: [],
        gradedByMe: [],
        currentStudentAssignment: null,
        pagination: null,
        error: null,
      });
    },

    /**
     * Clear error
     */
    clearError: () => {
      set({ error: null });
    },
  })
);
