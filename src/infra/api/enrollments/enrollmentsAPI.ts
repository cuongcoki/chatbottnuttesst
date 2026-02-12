import axiosInstance from "../conflig/axiosInstance";
import { API_ENDPOINTS } from "../conflig/apiEndpoints";
import { IEnrollmentResponse, IStudentClassesResponse } from "@/domain/interfaces/IErollment";

class ClassAPI {
  /**
   * Lấy danh sách comments theo blogId
   */
  async getEnrollmentsByClass(classId: string): Promise<IEnrollmentResponse> {
    const response = await axiosInstance.get<IEnrollmentResponse>(
      API_ENDPOINTS.ENROLLMENTS.GETBYCLASS(classId)
    );
    return response.data;
  }

  async getEnrollmentsByStudent(studentId: string): Promise<IStudentClassesResponse> {
    const response = await axiosInstance.get<IStudentClassesResponse>(
      API_ENDPOINTS.ENROLLMENTS.GETBYSTUDENT(studentId)
    );
    return response.data;
  }

}

export default new ClassAPI();
