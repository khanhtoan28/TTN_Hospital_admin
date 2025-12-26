export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  API_VERSION: '/api/v1',
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/v1/auth/login',
  },
  // Golden Book
  GOLDEN_BOOK: {
    BASE: '/api/v1/golden-book',
    BY_ID: (id: number | string) => `/api/v1/golden-book/${id}`,
  },
  // Artifacts
  ARTIFACTS: {
    BASE: '/api/v1/artifacts',
    BY_ID: (id: number | string) => `/api/v1/artifacts/${id}`,
  },
  // History
  HISTORIES: {
    BASE: '/api/v1/histories',
    BY_ID: (id: number | string) => `/api/v1/histories/${id}`,
  },
  // Introduction
  INTRODUCTIONS: {
    BASE: '/api/v1/introductions',
    BY_ID: (id: number | string) => `/api/v1/introductions/${id}`,
  },
  // Users
  USERS: {
    BASE: '/api/v1/users',
    BY_ID: (id: number | string) => `/api/v1/users/${id}`,
    LOCK: (id: number | string) => `/api/v1/users/${id}/lock`,
    UNLOCK: (id: number | string) => `/api/v1/users/${id}/unlock`,
  },
} as const;

