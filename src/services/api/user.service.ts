import api from '@/lib/axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  systemRole: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string | null;
  organization: { id: string; name: string } | null;
  role: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
  region: { id: string; name: string } | null;
}

export interface PaginatedUsers {
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalOrgAdmins: number;
  totalOrganizations: number;
  pendingUsers: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  systemRole?: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'USER';
  organizationId?: string;
  isActive?: boolean;
  search?: string;
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  role?: string;
  region?: string;
  isActive?: boolean;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const userService = {
  /** Get paginated list of users (SUPER_ADMIN / ORG_ADMIN) */
  getUsers: (params?: UserQueryParams) =>
    api.get<PaginatedUsers>('/users', { params }).then((res) => res.data),

  /** Get dashboard statistics (SUPER_ADMIN only) */
  getStats: () => api.get<UserStats>('/users/stats').then((res) => res.data),

  /** Update user details (SUPER_ADMIN / ORG_ADMIN) */
  updateUser: (id: string, payload: UpdateUserPayload) =>
    api.patch(`/users/${id}`, payload).then((res) => res.data),

  /** Delete a user (SUPER_ADMIN / ORG_ADMIN) */
  deleteUser: (id: string) => api.delete(`/users/${id}`).then((res) => res.data),
};
