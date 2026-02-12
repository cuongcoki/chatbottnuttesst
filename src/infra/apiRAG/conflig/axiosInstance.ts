import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { storage } from '@/utility/lib/storage';

// Base URL from environment or default
const BASE_URL = import.meta.env.VITE_API_RAG_URL || 'http://14.225.211.7:8504';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from storage
    const token = storage.get<string>('auth_token', '');
    
    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    // console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = storage.get<string>('refresh_token', '');
      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
          const { accessToken } = response.data;

          storage.set('access_token', accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('🔒 Refresh token failed',refreshError);
        }
      }

      // 👉 Nếu refresh thất bại → chuyển đến trang thông báo
      storage.remove('access_token');
      storage.remove('user');

      // Dẫn tới trang báo lỗi session
      // window.location.href = '/session-expired';
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      window.location.href = '/not-authorized';
    }

    if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;