import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  LoginRequest,
  LoginResponse,
  GoldenBook,
  GoldenBookRequest,
  Artifact,
  ArtifactRequest,
  History,
  HistoryRequest,
  Introduction,
  IntroductionRequest,
  BaseResponse,
} from './types';

// Auth Service
export const authService = {
  login: async (credentials: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, false);
  },
};

// Golden Book Service
export const goldenBookService = {
  getAll: async (): Promise<BaseResponse<GoldenBook[]>> => {
    return apiClient.get<GoldenBook[]>(API_ENDPOINTS.GOLDEN_BOOK.BASE, false);
  },

  getById: async (id: number): Promise<BaseResponse<GoldenBook>> => {
    return apiClient.get<GoldenBook>(API_ENDPOINTS.GOLDEN_BOOK.BY_ID(id), false);
  },

  create: async (data: GoldenBookRequest): Promise<BaseResponse<GoldenBook>> => {
    return apiClient.post<GoldenBook>(API_ENDPOINTS.GOLDEN_BOOK.BASE, data);
  },

  update: async (id: number, data: GoldenBookRequest): Promise<BaseResponse<GoldenBook>> => {
    return apiClient.put<GoldenBook>(API_ENDPOINTS.GOLDEN_BOOK.BY_ID(id), data);
  },

  delete: async (id: number): Promise<BaseResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.GOLDEN_BOOK.BY_ID(id));
  },
};

// Artifacts Service
export const artifactsService = {
  getAll: async (): Promise<BaseResponse<Artifact[]>> => {
    return apiClient.get<Artifact[]>(API_ENDPOINTS.ARTIFACTS.BASE, false);
  },

  getById: async (id: number): Promise<BaseResponse<Artifact>> => {
    return apiClient.get<Artifact>(API_ENDPOINTS.ARTIFACTS.BY_ID(id), false);
  },

  create: async (data: ArtifactRequest): Promise<BaseResponse<Artifact>> => {
    return apiClient.post<Artifact>(API_ENDPOINTS.ARTIFACTS.BASE, data);
  },

  update: async (id: number, data: ArtifactRequest): Promise<BaseResponse<Artifact>> => {
    return apiClient.put<Artifact>(API_ENDPOINTS.ARTIFACTS.BY_ID(id), data);
  },

  delete: async (id: number): Promise<BaseResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.ARTIFACTS.BY_ID(id));
  },
};

// History Service
export const historyService = {
  getAll: async (): Promise<BaseResponse<History[]>> => {
    return apiClient.get<History[]>(API_ENDPOINTS.HISTORIES.BASE, false);
  },

  getById: async (id: number): Promise<BaseResponse<History>> => {
    return apiClient.get<History>(API_ENDPOINTS.HISTORIES.BY_ID(id), false);
  },

  create: async (data: HistoryRequest): Promise<BaseResponse<History>> => {
    return apiClient.post<History>(API_ENDPOINTS.HISTORIES.BASE, data);
  },

  update: async (id: number, data: HistoryRequest): Promise<BaseResponse<History>> => {
    return apiClient.put<History>(API_ENDPOINTS.HISTORIES.BY_ID(id), data);
  },

  delete: async (id: number): Promise<BaseResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.HISTORIES.BY_ID(id));
  },
};

// Introduction Service
export const introductionService = {
  getAll: async (): Promise<BaseResponse<Introduction[]>> => {
    return apiClient.get<Introduction[]>(API_ENDPOINTS.INTRODUCTIONS.BASE, false);
  },

  getById: async (id: number): Promise<BaseResponse<Introduction>> => {
    return apiClient.get<Introduction>(API_ENDPOINTS.INTRODUCTIONS.BY_ID(id), false);
  },

  create: async (data: IntroductionRequest): Promise<BaseResponse<Introduction>> => {
    return apiClient.post<Introduction>(API_ENDPOINTS.INTRODUCTIONS.BASE, data);
  },

  update: async (id: number, data: IntroductionRequest): Promise<BaseResponse<Introduction>> => {
    return apiClient.put<Introduction>(API_ENDPOINTS.INTRODUCTIONS.BY_ID(id), data);
  },

  delete: async (id: number): Promise<BaseResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.INTRODUCTIONS.BY_ID(id));
  },
};

