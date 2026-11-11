import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/api/auth.service';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-my-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent],
  template: `
    <div>
      <app-page-breadcrumb pageTitle="Meu perfil" />

      <div
        class="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
      >
        <div class="border-b border-gray-100 px-4 py-4 sm:px-6 dark:border-gray-800">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Dados da conta</h3>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Altere nome, e-mail ou senha. Perfis/permissões só o admin gerencia em Usuários.
          </p>
        </div>

        <form class="space-y-4 px-4 py-5 sm:px-6" (ngSubmit)="save()">
          @if (error()) {
            <p class="text-sm text-error-500">{{ error() }}</p>
          }
          @if (success()) {
            <p class="text-sm text-green-600 dark:text-green-400">Perfil atualizado.</p>
          }

          <div>
            <label class="mb-1.5 block text-sm text-gray-700 dark:text-gray-300">Nome</label>
            <input
              class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
              name="name"
              [(ngModel)]="form.name"
              required
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm text-gray-700 dark:text-gray-300">E-mail</label>
            <input
              class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
              type="email"
              name="email"
              [(ngModel)]="form.email"
              required
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm text-gray-700 dark:text-gray-300">
              Nova senha <span class="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
              type="password"
              name="password"
              [(ngModel)]="form.password"
              minlength="8"
              autocomplete="new-password"
            />
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              [disabled]="saving()"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class MyProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);

  readonly error = signal<string | null>(null);
  readonly success = signal(false);
  readonly saving = signal(false);

  form = { name: '', email: '', password: '' };

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.form = { name: user.name, email: user.email, password: '' };
      return;
    }
    this.auth.loadMe().subscribe({
      next: (u) => (this.form = { name: u.name, email: u.email, password: '' }),
      error: () => this.error.set('Não foi possível carregar o perfil'),
    });
  }

  save(): void {
    this.error.set(null);
    this.success.set(false);
    this.saving.set(true);
    this.auth
      .updateProfile({
        name: this.form.name,
        email: this.form.email,
        password: this.form.password || undefined,
      })
      .subscribe({
        next: (u) => {
          this.form = { name: u.name, email: u.email, password: '' };
          this.success.set(true);
          this.saving.set(false);
        },
        error: () => {
          this.error.set('Falha ao salvar o perfil');
          this.saving.set(false);
        },
      });
  }
}
