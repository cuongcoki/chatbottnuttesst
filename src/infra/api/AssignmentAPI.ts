import axiosInstance from "./conflig/axiosInstance";
import { API_ENDPOINTS } from "./conflig/apiEndpoints";
import {
  IAssignment,
  ICreateAssignment,
  IUpdateAssignment,
  IAssignmentListResponse,
  IAssignmentResponse,
  IStatisticsResponse,
  IAssignmentParams,
} from "@/domain/interfaces/IAssignment";

class AssignmentAPI {
  /**
   * Tạo assignment mới với file upload
   */
  async createAssignment(data: ICreateAssignment, files?: File[]): Promise<IAssignmentResponse> {
    const formData = new FormData();

    // Append form fields
    formData.append('code', data.code);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('class_id', data.class_id);
    if (data.subject_id) formData.append('subject_id', data.subject_id);
    formData.append('due_date', data.due_date);
    formData.append('max_score', String(data.max_score));
    formData.append('passing_score', String(data.passing_score));
    formData.append('auto_grade_enabled', String(data.auto_grade_enabled));

    // Append files
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await axiosInstance.post<IAssignmentResponse>(
      API_ENDPOINTS.ASSIGNMENTS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Lấy tất cả assignments
   */
  async getAllAssignments(params?: IAssignmentParams): Promise<IAssignmentListResponse> {
    const response = await axiosInstance.get<IAssignmentListResponse>(
      API_ENDPOINTS.ASSIGNMENTS.GET_ALL,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy assignment theo ID
   */
  async getAssignmentById(assignmentId: string): Promise<IAssignmentResponse> {
    const response = await axiosInstance.get<IAssignmentResponse>(
      API_ENDPOINTS.ASSIGNMENTS.GET_BY_ID(assignmentId)
    );
    return response.data;
  }

  /**
   * Lấy assignments theo class
   */
  async getAssignmentsByClass(params: IAssignmentParams): Promise<IAssignmentListResponse> {
    const response = await axiosInstance.get<IAssignmentListResponse>(
      API_ENDPOINTS.ASSIGNMENTS.GET_BY_CLASS,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy assignments theo subject
   */
  async getAssignmentsBySubject(params: IAssignmentParams): Promise<IAssignmentListResponse> {
    const response = await axiosInstance.get<IAssignmentListResponse>(
      API_ENDPOINTS.ASSIGNMENTS.GET_BY_SUBJECT,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy assignments sắp đến hạn
   */
  async getUpcomingAssignments(params: IAssignmentParams): Promise<{
    success: boolean;
    message: string;
    data: IAssignment[];
  }> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ASSIGNMENTS.GET_UPCOMING,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy assignments quá hạn
   */
  async getPastDueAssignments(params: IAssignmentParams): Promise<{
    success: boolean;
    message: string;
    data: IAssignment[];
  }> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ASSIGNMENTS.GET_PAST_DUE,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy thống kê assignment
   */
  async getAssignmentStatistics(assignmentId: string): Promise<IStatisticsResponse> {
    const response = await axiosInstance.get<IStatisticsResponse>(
      API_ENDPOINTS.ASSIGNMENTS.GET_STATISTICS(assignmentId)
    );
    return response.data;
  }

  /**
   * Cập nhật assignment
   */
  async updateAssignment(
    assignmentId: string,
    data: IUpdateAssignment
  ): Promise<IAssignmentResponse> {
    const response = await axiosInstance.put<IAssignmentResponse>(
      API_ENDPOINTS.ASSIGNMENTS.UPDATE(assignmentId),
      data
    );
    return response.data;
  }

  /**
   * Xóa assignment
   */
  async deleteAssignment(assignmentId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.ASSIGNMENTS.DELETE(assignmentId)
    );
    return response.data;
  }
}

export default new AssignmentAPI();
