import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuditItem,
  DashboardStats,
  PageResult,
  PermissionItem,
  RoleAdmin,
  UserAdmin,
} from './api-types';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin`;

  dashboardStats(days = 7): Observable<DashboardStats> {
    const params = new HttpParams().set('days', days);
    return this.http.get<DashboardStats>(`${this.base}/dashboard/stats`, { params });
  }

  listUsers(page = 0, size = 10): Observable<PageResult<UserAdmin>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResult<UserAdmin>>(`${this.base}/users`, { params });
  }

  createUser(payload: { name: string; email: string; password: string; roleIds: number[] }) {
    return this.http.post<UserAdmin>(`${this.base}/users`, payload);
  }

  updateUser(id: number, payload: { name: string; email: string; password?: string; roleIds: number[] }) {
    return this.http.put<UserAdmin>(`${this.base}/users/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  listRoles(): Observable<RoleAdmin[]> {
    return this.http.get<RoleAdmin[]>(`${this.base}/roles`);
  }

  permissionsCatalog(): Observable<{ permissions: PermissionItem[] }> {
    return this.http.get<{ permissions: PermissionItem[] }>(`${this.base}/permissions/catalog`);
  }

  createRole(payload: { name: string; permissionIds: number[] }) {
    return this.http.post<RoleAdmin>(`${this.base}/roles`, payload);
  }

  updateRole(id: number, payload: { name: string; permissionIds: number[] }) {
    return this.http.put<RoleAdmin>(`${this.base}/roles/${id}`, payload);
  }

  deleteRole(id: number) {
    return this.http.delete<void>(`${this.base}/roles/${id}`);
  }

  listAudits(page = 0, size = 20): Observable<PageResult<AuditItem>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResult<AuditItem>>(`${this.base}/audits`, { params });
  }
}
