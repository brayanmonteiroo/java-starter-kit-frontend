import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { PermissionItem, RoleAdmin } from '../../../core/api/api-types';
import {
  permissionGroup,
  permissionLabel,
  profileLabel,
} from '../../../core/i18n/permission-labels';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DataTableToolbarComponent } from '../../../shared/components/admin/data-table-toolbar.component';
import { TABLE_IMPORTS } from '../../../shared/components/ui/table';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

type EditorMode = 'closed' | 'create' | 'edit';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    DataTableToolbarComponent,
    ButtonComponent,
    ...TABLE_IMPORTS,
  ],
  template: `
    <div>
      <app-page-breadcrumb pageTitle="Perfis" />

      <div
        class="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
      >
        <app-data-table-toolbar [showPageSize]="false">
          <button
            app-button
            variant="unstyled"
            type="button"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-brand-500 px-4 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            (click)="openCreate()"
          >
            <svg class="size-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 4.167v11.666M4.167 10h11.666"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            Novo perfil
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
                  Perfil
                </th>
                <th
                  app-table-cell
                  class="h-11 px-4 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Usuários
                </th>
                <th
                  app-table-cell
                  class="h-11 px-4 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Permissões
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
              @for (perfil of perfis(); track perfil.id) {
                <tr app-table-row class="transition hover:bg-gray-50/50 dark:hover:bg-white/2">
                  <td app-table-cell class="px-5 py-3.5 sm:px-6">
                    <span class="block text-sm font-medium text-gray-800 dark:text-white/90">
                      {{ labelPerfil(perfil.name) }}
                    </span>
                    <span class="block text-xs text-gray-400">{{ perfil.name }}</span>
                  </td>
                  <td
                    app-table-cell
                    class="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {{ perfil.userCount }}
                  </td>
                  <td
                    app-table-cell
                    class="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ perfil.permissions.length }}
                    {{ perfil.permissions.length === 1 ? 'permissão' : 'permissões' }}
                  </td>
                  <td app-table-cell class="px-5 py-3.5 sm:px-6">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        app-button
                        variant="unstyled"
                        type="button"
                        class="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-400"
                        aria-label="Editar perfil"
                        (click)="openEdit(perfil)"
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
                        aria-label="Excluir perfil"
                        (click)="remove(perfil)"
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
                    colspan="4"
                    class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Nenhum perfil cadastrado.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (mode() !== 'closed') {
        <div
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          (click)="closeEditor()"
        >
          <div
            class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            (click)="$event.stopPropagation()"
          >
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {{ mode() === 'create' ? 'Novo perfil' : 'Editar perfil' }}
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                  Defina o nome e marque as permissões deste perfil.
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

            <form class="space-y-5" (ngSubmit)="save()">
              <div>
                <label class="mb-1.5 block text-sm text-gray-700 dark:text-gray-300"
                  >Nome do perfil</label
                >
                <input
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-950"
                  name="name"
                  [(ngModel)]="formName"
                  required
                  placeholder="Ex.: financeiro"
                />
              </div>

              <div class="space-y-4">
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">Permissões</p>
                @for (group of permissionGroups(); track group.name) {
                  <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                    <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {{ group.name }}
                    </p>
                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      @for (p of group.items; track p.id) {
                        <label
                          class="flex cursor-pointer items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <input
                            class="mt-0.5"
                            type="checkbox"
                            [checked]="selected.has(p.id)"
                            (change)="toggle(p.id)"
                          />
                          <span>
                            {{ labelPermissao(p.name) }}
                            <span class="block text-xs text-gray-400">{{ p.name }}</span>
                          </span>
                        </label>
                      }
                    </div>
                  </div>
                }
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
export class RolesPageComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly perfis = signal<RoleAdmin[]>([]);
  readonly permissions = signal<PermissionItem[]>([]);
  readonly mode = signal<EditorMode>('closed');
  readonly error = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  selected = new Set<number>();
  formName = '';

  readonly permissionGroups = computed(() => {
    const map = new Map<string, PermissionItem[]>();
    for (const p of this.permissions()) {
      const group = permissionGroup(p.name);
      const list = map.get(group) ?? [];
      list.push(p);
      map.set(group, list);
    }
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  });

  ngOnInit(): void {
    this.reload();
    this.api.permissionsCatalog().subscribe({
      next: (c) => this.permissions.set(c.permissions),
      error: () => this.error.set('Falha ao carregar permissões'),
    });
  }

  labelPerfil = profileLabel;
  labelPermissao = permissionLabel;

  reload(): void {
    this.api.listRoles().subscribe({
      next: (r) => this.perfis.set(r),
      error: () => this.error.set('Falha ao listar perfis'),
    });
  }

  openCreate(): void {
    this.mode.set('create');
    this.editingId.set(null);
    this.formName = '';
    this.selected = new Set();
  }

  openEdit(perfil: RoleAdmin): void {
    this.mode.set('edit');
    this.editingId.set(perfil.id);
    this.formName = perfil.name;
    const ids = this.permissions()
      .filter((p) => perfil.permissions.includes(p.name))
      .map((p) => p.id);
    this.selected = new Set(ids);
  }

  closeEditor(): void {
    this.mode.set('closed');
    this.editingId.set(null);
  }

  toggle(id: number): void {
    if (this.selected.has(id)) this.selected.delete(id);
    else this.selected.add(id);
  }

  save(): void {
    const payload = {
      name: this.formName.trim(),
      permissionIds: [...this.selected],
    };
    if (!payload.name) {
      this.error.set('Informe o nome do perfil');
      return;
    }

    const request =
      this.mode() === 'create'
        ? this.api.createRole(payload)
        : this.api.updateRole(this.editingId()!, payload);

    request.subscribe({
      next: () => {
        this.closeEditor();
        this.reload();
      },
      error: () => this.error.set('Não foi possível salvar o perfil'),
    });
  }

  remove(perfil: RoleAdmin): void {
    if (!confirm(`Excluir o perfil "${profileLabel(perfil.name)}"?`)) {
      return;
    }
    this.api.deleteRole(perfil.id).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Não foi possível excluir o perfil'),
    });
  }
}
