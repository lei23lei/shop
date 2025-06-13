// API Error Types
export type ApiError = {
  data?: {
    error?: string;
    message?: string;
    detail?: string;
    non_field_errors?: string[];
  };
  status?: number;
};

// Common API Response Types
export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};
