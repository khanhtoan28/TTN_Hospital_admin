// Base Response
export interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination Response
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  typeToken: string;
  accessToken: string;
}

// Golden Book
export interface GoldenBook {
  goldenBookId: number;
  goldenBookName: string;
  level: string;
  year: number;
  department: string;
  image?: string;
  description?: string;
}

export interface GoldenBookRequest {
  goldenBookName: string;
  level: string;
  year: number;
  department: string;
  image?: string;
  imageId?: number;
  description?: string;
}

// Artifacts
export interface Artifact {
  artifactId: number;
  artifactName: string;
  description?: string;
  imageUrl?: string;
  period?: string;
  type?: string;
  space?: string;
}

export interface ArtifactRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  imageId?: number;
  period?: string;
  type?: string;
  space?: string;
}

// History
export interface History {
  historyId: number;
  year: string;
  title: string;
  period: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface HistoryRequest {
  year: string;
  title: string;
  period: string;
  description: string;
  icon?: string;
  iconImageId?: number;
  image?: string;
  imageId?: number;
}

// Introduction
export interface Introduction {
  introductionId: number;
  section: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntroductionRequest {
  section: string;
  content: string;
}

// User
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  fullname: string;
  avatar?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  phone?: string;
  fullname: string;
  avatar?: string;
}

export interface UserUpdateRequest {
  fullname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Image
export interface Image {
  imageId: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  url: string;
  fileSize: number;
  contentType: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageUploadRequest {
  file: File;
  description?: string;
}

