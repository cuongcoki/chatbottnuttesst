import { create } from "zustand";
import AssignmentAPI from "@/infra/api/AssignmentAPI";
import {
  IAssignment,
  ICreateAssignment,
  IUpdateAssignment,
  IAssignmentParams,
  IAssignmentStatistics,
  IPagination,
} from "@/domain/interfaces/IAssignment";
import toast from "react-hot-toast";
import { handleApiError } from "../lib/errorHandler";
import { IApiError } from "../lib/IError";

interface AssignmentState {
  // State
  assignments: IAssignment[];
  currentAssignment: IAssignment | null;
  statistics: IAssignmentStatistics | null;
  pagination: IPagination | null;
  isLoading: boolean;
  error: IApiError | null;

  // Actions - CRUD
  fetchAssignments: (params?: IAssignmentParams) => Promise<void>;
  fetchAssignmentById: (assignmentId: string) => Promise<void>;
  createAssignment: (data: ICreateAssignment, files?: File[]) => Promise<IAssignment>;
  updateAssignment: (assignmentId: string, data: IUpdateAssignment) => Promise<void>;
  deleteAssignment: (assignmentId: string) => Promise<void>;

  // Actions - Queries
  fetchAssignmentsByClass: (params: IAssignmentParams) => Promise<void>;
  fetchAssignmentsBySubject: (params: IAssignmentParams) => Promise<void>;
  fetchUpcomingAssignments: (params: IAssignmentParams) => Promise<void>;
  fetchPastDueAssignments: (params: IAssignmentParams) => Promise<void>;
  fetchAssignmentStatistics: (assignmentId: string) => Promise<void>;

  // Helpers
  setCurrentAssignment: (assignment: IAssignment | null) => void;
  clearAssignments: () => void;
  clearError: () => void;
}

export const useAssignmentStore = create<AssignmentState>()((set) => ({
  // Initial State
  assignments: [],
  currentAssignment: null,
  statistics: null,
  pagination: null,
  isLoading: false,
  error: null,

  /**
   * Fetch all assignments
   */
  fetchAssignments: async (params?: IAssignmentParams) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getAllAssignments(params);

      set({
        assignments: response.data.assignments || [],
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
   * Fetch assignment by ID
   */
  fetchAssignmentById: async (assignmentId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getAssignmentById(assignmentId);

      set({
        currentAssignment: response.data,
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
   * Create assignment with file upload
   */
  createAssignment: async (data: ICreateAssignment, files?: File[]) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.createAssignment(data, files);

      // Add to list
      set((state) => ({
        assignments: [response.data, ...state.assignments],
        isLoading: false,
      }));

      toast.success("Tạo bài tập thành công!");

      return response.data;
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error("Tạo bài tập thất bại!");
      throw error;
    }
  },

  /**
   * Update assignment
   */
  updateAssignment: async (assignmentId: string, data: IUpdateAssignment) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.updateAssignment(assignmentId, data);

      // Update in list
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a.id === assignmentId ? response.data : a
        ),
        currentAssignment:
          state.currentAssignment?.id === assignmentId
            ? response.data
            : state.currentAssignment,
        isLoading: false,
      }));

      toast.success("Cập nhật bài tập thành công!");
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error("Cập nhật bài tập thất bại!");
      throw error;
    }
  },

  /**
   * Delete assignment
   */
  deleteAssignment: async (assignmentId: string) => {
    try {
      set({ isLoading: true, error: null });

      await AssignmentAPI.deleteAssignment(assignmentId);

      // Remove from list
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== assignmentId),
        currentAssignment:
          state.currentAssignment?.id === assignmentId
            ? null
            : state.currentAssignment,
        isLoading: false,
      }));

      toast.success("Xóa bài tập thành công!");
    } catch (error) {
      const apiError = error as IApiError;
      const errorMessage = handleApiError(apiError);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error("Xóa bài tập thất bại!");
      throw error;
    }
  },

  /**
   * Fetch assignments by class
   */
  fetchAssignmentsByClass: async (params: IAssignmentParams) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getAssignmentsByClass(params);

      set({
        assignments: response.data.assignments || [],
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
   * Fetch assignments by subject
   */
  fetchAssignmentsBySubject: async (params: IAssignmentParams) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getAssignmentsBySubject(params);

      set({
        assignments: response.data.assignments || [],
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
   * Fetch upcoming assignments
   */
  fetchUpcomingAssignments: async (params: IAssignmentParams) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getUpcomingAssignments(params);

      set({
        assignments: response.data || [],
        pagination: null,
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
   * Fetch past due assignments
   */
  fetchPastDueAssignments: async (params: IAssignmentParams) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getPastDueAssignments(params);

      set({
        assignments: response.data || [],
        pagination: null,
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
   * Fetch assignment statistics
   */
  fetchAssignmentStatistics: async (assignmentId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await AssignmentAPI.getAssignmentStatistics(assignmentId);

      set({
        currentAssignment: response.data.assignment,
        statistics: response.data.statistics,
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
   * Set current assignment
   */
  setCurrentAssignment: (assignment: IAssignment | null) => {
    set({ currentAssignment: assignment });
  },

  /**
   * Clear assignments
   */
  clearAssignments: () => {
    set({
      assignments: [],
      currentAssignment: null,
      statistics: null,
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
}));
