import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../layout/shell/auth-page-layout/auth-page-layout.component';
import { AuthService } from '../../../core/api/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthPageLayoutComponent],
  template: `
    <app-auth-page-layout>
      <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
        <h1 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Esqueci a senha</h1>
        <p class="mb-6 text-sm text-gray-500">Enviaremos um link se o e-mail existir.</p>
        <form class="space-y-4" (ngSubmit)="submit()">
          <input class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" type="email" [(ngModel)]="email" name="email" required placeholder="E-mail" />
          <button class="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" type="submit">Enviar</button>
        </form>
        @if (message()) { <p class="mt-4 text-sm text-success-500">{{ message() }}</p> }
        <a routerLink="/signin" class="mt-6 text-sm text-brand-500">Voltar ao login</a>
      </div>
    </app-auth-page-layout>
  `,
})
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);
  email = '';
  readonly message = signal<string | null>(null);

  submit(): void {
    this.auth.forgotPassword(this.email).subscribe({
      next: () => this.message.set('Se o e-mail existir, enviamos as instruções.'),
      error: () => this.message.set('Se o e-mail existir, enviamos as instruções.'),
    });
  }
}
