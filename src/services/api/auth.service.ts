import api from '@/lib/axios';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  systemRole: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'USER';
  organizationId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth Service ────────────────────────────────────────────────────────────

export const authService = {
  /** Login with email and password. Returns access + refresh tokens. */
  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/auth/login', data).then((res) => res.data),

  /** Validate an invitation token before showing set-password form. */
  validateToken: (token: string) =>
    api
      .get<ValidateTokenResponse>('/auth/validate-token', {
        params: { token },
      })
      .then((res) => res.data),

  /** Set password for an invited user. Returns access + refresh tokens. */
  setPassword: (data: SetPasswordRequest) =>
    api.post<TokenResponse>('/auth/set-password', data).then((res) => res.data),

  /** Get the current authenticated user's profile. */
  getMe: () => api.get<UserProfile>('/auth/me').then((res) => res.data),

  /** Logout the current session. */
  logout: () => api.post<{ message: string }>('/auth/logout').then((res) => res.data),
};
