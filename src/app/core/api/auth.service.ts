import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, TokenResponse } from './api-types';

const ACCESS_KEY = 'jsk_access_token';
const REFRESH_KEY = 'jsk_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly currentUser = signal<AuthUser | null>(null);

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/login`, { email, password })
      .pipe(tap((tokens) => this.persistTokens(tokens)));
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/reset-password`, { email, token, password });
  }

  refresh(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap((tokens) => this.persistTokens(tokens)));
  }

  loadMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${environment.apiUrl}/user`).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }

  updateProfile(payload: { name: string; email: string; password?: string }): Observable<AuthUser> {
    return this.http.put<AuthUser>(`${environment.apiUrl}/user/profile`, payload).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/logout`, { refreshToken }).subscribe({ error: () => undefined });
    }
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl('/signin');
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    return !!user?.permissions?.includes(permission);
  }

  private persistTokens(tokens: TokenResponse): void {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  }
}
