export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface UserAdmin {
  id: number;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleAdmin {
  id: number;
  name: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionItem {
  id: number;
  name: string;
}

export interface DashboardDayCount {
  date: string;
  count: number;
}

export interface DashboardStats {
  users: number;
  roles: number;
  audits: number;
  days: number;
  usersCreatedByDay: DashboardDayCount[];
}

export interface AuditItem {
  id: number;
  userId: number | null;
  userEmail: string | null;
  event: string;
  auditableType: string;
  auditableId: number | null;
  oldValuesJson: string | null;
  newValuesJson: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
