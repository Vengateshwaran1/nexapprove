import api from '@/lib/axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CreateOrganizationPayload {
  name: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
}

export interface CreateOrganizationResponse {
  organization: {
    id: string;
    name: string;
    createdBy: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  defaults: {
    region: string;
    department: string;
    role: string;
  };
}

export interface OrganizationListItem {
  id: string;
  name: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
}

export interface InviteUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  region: string;
}

export interface BulkInviteResult {
  created: number;
  failed: number;
  errors: Array<{ email: string; reason: string }>;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const organizationService = {
  /** Create organization + ORG_ADMIN invitation (SUPER_ADMIN only) */
  create: (payload: CreateOrganizationPayload) =>
    api.post<CreateOrganizationResponse>('/organizations', payload).then((res) => res.data),

  /** Get all organizations */
  getAll: () => api.get<OrganizationListItem[]>('/organizations').then((res) => res.data),

  /** Get single organization by ID */
  getById: (id: string) => api.get(`/organizations/${id}`).then((res) => res.data),

  /** Invite a single user (ORG_ADMIN only) */
  inviteUser: (payload: InviteUserPayload) =>
    api.post('/organizations/users', payload).then((res) => res.data),

  /** Bulk invite via Excel upload (ORG_ADMIN only) */
  bulkInviteExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post<BulkInviteResult>('/organizations/users/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },

  /** Download bulk import template (ORG_ADMIN only) */
  downloadTemplate: () => {
    return api.get('/organizations/users/template', { responseType: 'blob' }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Bulk_Invite_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  },
};
