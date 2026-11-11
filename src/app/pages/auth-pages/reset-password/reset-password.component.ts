import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../layout/shell/auth-page-layout/auth-page-layout.component';
import { AuthService } from '../../../core/api/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthPageLayoutComponent],
  template: `
    <app-auth-page-layout>
      <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
        <h1 class="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">Redefinir senha</h1>
        <form class="space-y-4" (ngSubmit)="submit()">
          <input class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" type="email" [(ngModel)]="email" name="email" required placeholder="E-mail" />
          <input class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" type="password" [(ngModel)]="password" name="password" required placeholder="Nova senha" />
          <button class="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" type="submit">Salvar</button>
        </form>
        @if (error()) { <p class="mt-4 text-sm text-error-500">{{ error() }}</p> }
      </div>
    </app-auth-page-layout>
  `,
})
export class ResetPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  email = this.route.snapshot.queryParamMap.get('email') ?? '';
  token = this.route.snapshot.queryParamMap.get('token') ?? '';
  password = '';
  readonly error = signal<string | null>(null);

  submit(): void {
    this.auth.resetPassword(this.email, this.token, this.password).subscribe({
      next: () => this.router.navigateByUrl('/signin'),
      error: () => this.error.set('Não foi possível redefinir a senha.'),
    });
  }
}
