import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Storage Key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'nexapprove-auth';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;

  /** Replace both tokens at once (login / refresh). */
  setTokens: (tokens: AuthTokens) => void;

  /** Store the user profile from /auth/me. */
  setUser: (user: UserProfile) => void;

  /** Wipe tokens and user data (logout). */
  clearTokens: () => void;

  /** Whether the user currently holds an access token. */
  isAuthenticated: () => boolean;
}

// ─── Store ───────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      clearTokens: () => set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => get().accessToken !== null,
    }),
    {
      name: STORAGE_KEY,
      // Only persist the tokens + user, not the methods.
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
