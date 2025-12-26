import { API_CONFIG } from './config';
import { BaseResponse } from './types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Lấy token từ localStorage hoặc cookie
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Tạo headers cho request
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Xử lý response
  private async handleResponse<T>(response: Response): Promise<BaseResponse<T>> {
    const data = await response.json();

    // Trả về response data ngay cả khi có lỗi để frontend có thể xử lý
    // Frontend sẽ check response.success để biết thành công hay thất bại
    if (!response.ok) {
      // Nếu response có success field thì trả về luôn (để xử lý validation errors)
      if (data.success !== undefined) {
        return data;
      }
      // Nếu không có, tạo error response
      return {
        success: false,
        error: data.error || data.message || 'Đã xảy ra lỗi',
        message: data.message,
      } as BaseResponse<T>;
    }

    return data;
  }

  // GET request
  async get<T>(endpoint: string, requireAuth: boolean = true): Promise<BaseResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(requireAuth),
    });

    return this.handleResponse<T>(response);
  }

  // POST request
  async post<T>(
    endpoint: string,
    body: any,
    requireAuth: boolean = true
  ): Promise<BaseResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  // PUT request
  async put<T>(
    endpoint: string,
    body: any,
    requireAuth: boolean = true
  ): Promise<BaseResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  // DELETE request
  async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<BaseResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(requireAuth),
    });

    return this.handleResponse<T>(response);
  }

  // POST request với FormData (cho file upload)
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    requireAuth: boolean = true
  ): Promise<BaseResponse<T>> {
    const headers: HeadersInit = {};

    if (requireAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Không set Content-Type, browser sẽ tự động set với boundary cho FormData
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  // PUT request với FormData (cho file replace)
  async putFormData<T>(
    endpoint: string,
    formData: FormData,
    requireAuth: boolean = true
  ): Promise<BaseResponse<T>> {
    const headers: HeadersInit = {};

    if (requireAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();

