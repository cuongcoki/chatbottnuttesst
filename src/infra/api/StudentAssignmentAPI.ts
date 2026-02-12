import axiosInstance from "./conflig/axiosInstance";
import { API_ENDPOINTS } from "./conflig/apiEndpoints";
import {
  // IStudentAssignment,
  ICreateStudentAssignment,
  ISubmitAssignment,
  IGradeAssignment,
  IUpdateStudentAssignment,
  IStudentAssignmentListResponse,
  IStudentAssignmentResponse,
  IStudentAssignmentArrayResponse,
  IStudentAssignmentParams,
  IBasicResponse,
} from "@/domain/interfaces/IStudentAssignment";

class StudentAssignmentAPI {
  /**
   * Tạo student assignment thủ công
   */
  async createStudentAssignment(
    data: ICreateStudentAssignment
  ): Promise<IStudentAssignmentResponse> {
    const response = await axiosInstance.post<IStudentAssignmentResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.CREATE,
      data
    );
    return response.data;
  }

  /**
   * Lấy tất cả student assignments
   */
  async getAllStudentAssignments(
    params?: IStudentAssignmentParams
  ): Promise<IStudentAssignmentListResponse> {
    const response = await axiosInstance.get<IStudentAssignmentListResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_ALL,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy student assignment theo ID
   */
  async getStudentAssignmentById(
    studentAssignmentId: string
  ): Promise<IStudentAssignmentResponse> {
    const response = await axiosInstance.get<IStudentAssignmentResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_BY_ID(studentAssignmentId)
    );
    return response.data;
  }

  /**
   * Lấy assignments của chính mình (student)
   */
  async getMyAssignments(
    params?: IStudentAssignmentParams
  ): Promise<IStudentAssignmentListResponse> {
    const response = await axiosInstance.get<IStudentAssignmentListResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_MY_ASSIGNMENTS,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy bài chưa nộp của chính mình (student)
   */
  async getMyUnsubmitted(): Promise<IStudentAssignmentArrayResponse> {
    const response = await axiosInstance.get<IStudentAssignmentArrayResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_MY_UNSUBMITTED
    );
    return response.data;
  }

  /**
   * Lấy bài đã chấm của tôi (teacher)
   */
  async getGradedByMe(
    params?: IStudentAssignmentParams
  ): Promise<IStudentAssignmentListResponse> {
    const response = await axiosInstance.get<IStudentAssignmentListResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_GRADED_BY_ME,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy submissions của một assignment
   */
  async getSubmissionsByAssignment(
    params: IStudentAssignmentParams
  ): Promise<IStudentAssignmentListResponse> {
    const response = await axiosInstance.get<IStudentAssignmentListResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_SUBMISSIONS,
      { params }
    );
    return response.data;
  }

  /**
   * Lấy assignments của một student
   */
  async getAssignmentsByStudent(
    studentId: string,
    params?: IStudentAssignmentParams
  ): Promise<IStudentAssignmentListResponse> {
    const response = await axiosInstance.get<IStudentAssignmentListResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_BY_STUDENT(studentId),
      { params }
    );
    return response.data;
  }

  /**
   * Lấy bài chưa nộp của student
   */
  async getUnsubmittedByStudent(
    studentId: string
  ): Promise<IStudentAssignmentArrayResponse> {
    const response = await axiosInstance.get<IStudentAssignmentArrayResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GET_UNSUBMITTED_BY_STUDENT(studentId)
    );
    return response.data;
  }

  /**
   * Nộp bài (student)
   */
  async submitAssignment(
    studentAssignmentId: string,
    data: ISubmitAssignment
  ): Promise<IStudentAssignmentResponse> {
    const response = await axiosInstance.post<IStudentAssignmentResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.SUBMIT(studentAssignmentId),
      data
    );
    return response.data;
  }

  /**
   * Chấm điểm (teacher)
   */
  async gradeAssignment(
    studentAssignmentId: string,
    data: IGradeAssignment
  ): Promise<IStudentAssignmentResponse> {
    const response = await axiosInstance.post<IStudentAssignmentResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.GRADE(studentAssignmentId),
      data
    );
    return response.data;
  }

  /**
   * Cập nhật student assignment
   */
  async updateStudentAssignment(
    studentAssignmentId: string,
    data: IUpdateStudentAssignment
  ): Promise<IStudentAssignmentResponse> {
    const response = await axiosInstance.put<IStudentAssignmentResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.UPDATE(studentAssignmentId),
      data
    );
    return response.data;
  }

  /**
   * Xóa student assignment
   */
  async deleteStudentAssignment(
    studentAssignmentId: string
  ): Promise<IBasicResponse> {
    const response = await axiosInstance.delete<IBasicResponse>(
      API_ENDPOINTS.STUDENT_ASSIGNMENTS.DELETE(studentAssignmentId)
    );
    return response.data;
  }
}

export default new StudentAssignmentAPI();
