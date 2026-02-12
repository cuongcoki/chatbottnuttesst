// types/api.types.ts
export interface IApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface IApiSuccess<T = any> {
  success: true;
  message: string;
  data: T;
  // statusCode?: number;
}

export type IApiResponse<T = any> = IApiSuccess<T> | IApiError;