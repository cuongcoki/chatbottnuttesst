import axiosInstance from "./api/conflig/axiosInstance";
import { API_ENDPOINTS } from "./api/conflig/apiEndpoints";
import { IAuthResponse, ILoginRequest } from "@/domain/interfaces/IAuth";

/**
 * Authentication Repository
 * Handles all authentication-related API calls
 */
class AuthRepository {
  /**
   * Login user
   */
  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    const response = await axiosInstance.post<IAuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      {
        withCredentials: true, // ✅ Ensure cookies are sent/received
      }
    );
    return response.data;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        withCredentials: true, // ✅ Clear cookies
      }
    );
  }

  /**
   * Refresh Access Token
   */
  async refreshAccessToken(): Promise<{ accessToken: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REFRESH,
      {},
      {
        withCredentials: true, // ✅ Send refresh token cookie
      }
    );
    return response.data.data;
  }

  /**
   * Register new user
   */
  // async register(data: IRegisterRequest): Promise<IAuthResponse> {
  //   const response = await axiosInstance.post<IAuthResponse>(
  //     API_ENDPOINTS.AUTH.REGISTER,
  //     data
  //   );
  //   return response.data;
  // }

  /**
   * Logout user
   */
  // async logout(): Promise<void> {
  //   await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  // }

  /**
   * Get current user info
   */
  // async getCurrentUser(): Promise<IUser> {
  //   const response = await axiosInstance.get<IUser>(API_ENDPOINTS.AUTH.ME);
  //   return response.data;
  // }

  /**
   * Refresh access token
   */
  // async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  //   const response = await axiosInstance.post<{ accessToken: string }>(
  //     API_ENDPOINTS.AUTH.REFRESH,
  //     { refreshToken }
  //   );
  //   return response.data;
  // }

  /**
   * Request password reset
   */
  // async forgotPassword(data: IForgotPasswordRequest): Promise<{ message: string }> {
  //   const response = await axiosInstance.post<{ message: string }>(
  //     API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
  //     data
  //   );
  //   return response.data;
  // }

  /**
   * Reset password with token
   */
  // async resetPassword(data: IResetPasswordRequest): Promise<{ message: string }> {
  //   const response = await axiosInstance.post<{ message: string }>(
  //     API_ENDPOINTS.AUTH.RESET_PASSWORD,
  //     data
  //   );
  //   return response.data;
  // }

  /**
   * Verify email with token
   */
  // async verifyEmail(token: string): Promise<{ message: string }> {
  //   const response = await axiosInstance.post<{ message: string }>(
  //     API_ENDPOINTS.AUTH.VERIFY_EMAIL,
  //     { token }
  //   );
  //   return response.data;
  // }
}

// Export singleton instance
export default new AuthRepository();
