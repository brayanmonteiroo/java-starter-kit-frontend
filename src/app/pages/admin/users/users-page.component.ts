import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { RoleAdmin, UserAdmin } from '../../../core/api/api-types';
import { profileLabel } from '../../../core/i18n/permission-labels';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DataTablePaginationComponent } from '../../../shared/components/admin/data-table-pagination.component';
import { DataTableToolbarComponent } from '../../../shared/components/admin/data-table-toolbar.component';
import { TABLE_IMPORTS } from '../../../shared/components/ui/table';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { userInitials } from '../../../shared/utils/user-initials';

type EditorMode = 'closed' | 'create' | 'edit';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    DataTablePaginationComponent,
    DataTableToolbarComponent,
    ButtonComponent,
    ...TABLE_IMPORTS,
  ],
  template: `
    <div>
      <app-page-breadcrumb pageTitle="Usuários" />

      <div
        class="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
      >
        <app-data-table-toolbar
          [pageSize]="size()"
          [pageSizeOptions]="[10, 25, 50]"
          (pageSizeChange)="changeSize($event)"
          [showSearch]="true"
          [searchQuery]="searchQuery()"
          (searchQueryChange)="searchQuery.set($event)"
        >
          <button
            app-button
            variant="unstyled"
            type="button"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-brand-500 px-4 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            (click)="openCreate()"
          >
            <svg class="size-5" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4.167v11.666M4.167 10h11.666"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            Novo usuário
          </button>
        </app-data-table-toolbar>

        @if (error()) {
          <p class="px-6 pb-2 text-sm text-error-500">{{ error() }}</p>
        }

        <div class="w-full overflow-x-auto">
          <table app-table class="min-w-full">
            <thead app-table-header class="border-y border-gray-100 dark:border-gray-800">
              <tr app-table-row>
                <th
                  app-table-cell
                  class="h-11 px-5 text-start text-sm font-normal text-gray-500 sm:px-6 dark:text-gray-400"
                >
                  Usuário
                </th>
                <th
                  app-table-cell
                  class="h-11 px-4 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Perfis
                </th>
                <th
                  app-table-cell
                  class="h-11 px-5 text-end text-sm font-normal text-gray-500 sm:px-6 dark:text-gray-400"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody app-table-body class="divide-y divide-gray-100 dark:divide-gray-800">
              @for (user of filteredUsers(); track user.id) {
                <tr app-table-row class="transition hover:bg-gray-50/50 dark:hover:bg-white/2">
                  <td app-table-cell class="px-5 py-3.5 sm:px-6">
                    <div class="flex items-center gap-3">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400"
                      >
                        {{ initials(user.name) }}
                      </span>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                          {{ user.name }}
                        </p>
                        <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                          {{ user.email }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    app-table-cell
                    class="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ formatPerfis(user.roles) }}
                  </td>
                  <td app-table-cell class="px-5 py-3.5 sm:px-6">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        app-button
                        variant="unstyled"
                        type="button"
                        class="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-400"
                        aria-label="Editar usuário"
                        (click)="openEdit(user)"
                      >
                        <svg class="size-5" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M14.1 3.9a1.75 1.75 0 012.47 2.48L7.4 15.55l-3.3.82.82-3.3L14.1 3.9z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        app-button
                        variant="unstyled"
                        type="button"
                        class="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-error-500 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-error-500"
                        aria-label="Excluir usuário"
                        (click)="remove(user.id)"
                      >
                        <svg class="size-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.541 3.792a2.25 2.25 0 012.25-2.25h2.417a2.25 2.25 0 012.25 2.25v.25H16.666a.75.75 0 010 1.5h-.29v10.666a2.25 2.25 0 01-2.25 2.25h-8.25a2.25 2.25 0 01-2.25-2.25V5.541h-.292a.75.75 0 110-1.5H6.54v-.25zm8.334 9.454V5.541h-9.75v10.667c0 .414.336.75.75.75h8.25a.75.75 0 00.75-.75v-2.962zM8.041 4.041h3.917v-.25a.75.75 0 00-.75-.75H8.791a.75.75 0 00-.75.75v.25zM8.334 8a.75.75 0 01.75.75v5a.75.75 0 11-1.5 0v-5a.75.75 0 01.75-.75zm4.083.75a.75.75 0 00-1.5 0v5a.75.75 0 101.5 0v-5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr app-table-row>
                  <td
                    app-table-cell
                    colspan="3"
                    class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <app-data-table-pagination
          [currentPage]="page() + 1"
          [totalPages]="totalPages()"
          [from]="rangeFrom()"
          [to]="rangeTo()"
          [total]="total()"
          (pageChange)="goToPage($event)"
        />
      </div>

      @if (mode() !== 'closed') {
        <div
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          (click)="closeEditor()"
        >
          <div
            class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            (click)="$event.stopPropagation()"
          >
            <div class="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {{ mode() === 'create' ? 'Novo usuário' : 'Editar usuário' }}
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                  Preencha os dados e escolha o perfil.
                </p>
              </div>
              <button
                type="button"
                class="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white"
                (click)="closeEditor()"
              >
                Fechar
              </button>
            </div>

            <form class="space-y-4" (ngSubmit)="save()">
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
                  Senha
                  @if (mode() === 'edit') {
                    <span class="font-normal text-gray-400">(opcional)</span>
                  }
                </label>
                <input
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
                  type="password"
                  name="password"
                  [(ngModel)]="form.password"
                  [required]="mode() === 'create'"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm text-gray-700 dark:text-gray-300">Perfil</label>
                <select
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
                  name="roleId"
                  [(ngModel)]="form.roleId"
                >
                  <option [ngValue]="null">Selecione…</option>
                  @for (perfil of perfis(); track perfil.id) {
                    <option [ngValue]="perfil.id">{{ labelPerfil(perfil.name) }}</option>
                  }
                </select>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700"
                  (click)="closeEditor()"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class UsersPageComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly users = signal<UserAdmin[]>([]);
  readonly perfis = signal<RoleAdmin[]>([]);
  readonly error = signal<string | null>(null);
  readonly mode = signal<EditorMode>('closed');
  readonly editingId = signal<number | null>(null);
  readonly page = signal(0);
  readonly size = signal(10);
  readonly total = signal(0);
  readonly searchQuery = signal('');

  form: { name: string; email: string; password: string; roleId: number | null } = {
    name: '',
    email: '',
    password: '',
    roleId: null,
  };

  labelPerfil = profileLabel;

  ngOnInit(): void {
    this.reload();
    this.api.listRoles().subscribe({ next: (r) => this.perfis.set(r) });
  }

  filteredUsers(): UserAdmin[] {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.users();
    return this.users().filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roles.some((r) => profileLabel(r).toLowerCase().includes(q) || r.toLowerCase().includes(q))
    );
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / this.size()));
  }

  rangeFrom(): number {
    if (this.total() === 0) return 0;
    return this.page() * this.size() + 1;
  }

  rangeTo(): number {
    return Math.min(this.total(), (this.page() + 1) * this.size());
  }

  changeSize(size: number): void {
    this.size.set(size);
    this.page.set(0);
    this.reload();
  }

  goToPage(page1Based: number): void {
    this.page.set(page1Based - 1);
    this.reload();
  }

  reload(): void {
    this.api.listUsers(this.page(), this.size()).subscribe({
      next: (result) => {
        this.users.set(result.items);
        this.total.set(result.total);
        this.page.set(result.page);
      },
      error: () => this.error.set('Falha ao listar usuários'),
    });
  }

  initials = userInitials;

  openCreate(): void {
    const userRole = this.perfis().find((r) => r.name === 'user');
    this.mode.set('create');
    this.editingId.set(null);
    this.form = {
      name: '',
      email: '',
      password: '',
      roleId: userRole?.id ?? null,
    };
  }

  openEdit(user: UserAdmin): void {
    const match = this.perfis().find((p) => user.roles.includes(p.name));
    this.mode.set('edit');
    this.editingId.set(user.id);
    this.form = {
      name: user.name,
      email: user.email,
      password: '',
      roleId: match?.id ?? null,
    };
  }

  closeEditor(): void {
    this.mode.set('closed');
    this.editingId.set(null);
  }

  save(): void {
    const roleIds = this.form.roleId ? [this.form.roleId] : [];
    if (this.mode() === 'create') {
      this.api
        .createUser({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          roleIds,
        })
        .subscribe({
          next: () => {
            this.closeEditor();
            this.reload();
          },
          error: () => this.error.set('Falha ao criar usuário'),
        });
      return;
    }

    this.api
      .updateUser(this.editingId()!, {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password || undefined,
        roleIds,
      })
      .subscribe({
        next: () => {
          this.closeEditor();
          this.reload();
        },
        error: () => this.error.set('Falha ao atualizar usuário'),
      });
  }

  remove(id: number): void {
    if (!confirm('Excluir este usuário?')) return;
    this.api.deleteUser(id).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Falha ao excluir usuário'),
    });
  }

  formatPerfis(names: string[]): string {
    return names.map((n) => profileLabel(n)).join(', ') || '—';
  }
}
