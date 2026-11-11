import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { AuditItem } from '../../../core/api/api-types';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DataTablePaginationComponent } from '../../../shared/components/admin/data-table-pagination.component';
import { DataTableToolbarComponent } from '../../../shared/components/admin/data-table-toolbar.component';
import { TABLE_IMPORTS } from '../../../shared/components/ui/table';

@Component({
  selector: 'app-audits-page',
  standalone: true,
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    DataTablePaginationComponent,
    DataTableToolbarComponent,
    ...TABLE_IMPORTS,
  ],
  template: `
    <div>
      <app-page-breadcrumb pageTitle="Auditoria" />

      <div
        class="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
      >
        <app-data-table-toolbar
          [pageSize]="size()"
          [pageSizeOptions]="[10, 20, 50]"
          (pageSizeChange)="changeSize($event)"
        />

        <div class="w-full overflow-x-auto">
          <table app-table class="min-w-full">
            <thead app-table-header class="border-y border-gray-100 dark:border-gray-800">
              <tr app-table-row>
                <th
                  app-table-cell
                  class="h-11 px-5 text-start text-sm font-normal text-gray-500 sm:px-6 dark:text-gray-400"
                >
                  Quando
                </th>
                <th
                  app-table-cell
                  class="h-11 px-4 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Quem
                </th>
                <th
                  app-table-cell
                  class="h-11 px-4 text-start text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Evento
                </th>
                <th
                  app-table-cell
                  class="h-11 px-5 text-start text-sm font-normal text-gray-500 sm:px-6 dark:text-gray-400"
                >
                  Alvo
                </th>
              </tr>
            </thead>
            <tbody app-table-body class="divide-y divide-gray-100 dark:divide-gray-800">
              @for (item of items(); track item.id) {
                <tr app-table-row class="transition hover:bg-gray-50/50 dark:hover:bg-white/2">
                  <td
                    app-table-cell
                    class="px-5 py-3.5 text-sm text-gray-700 sm:px-6 dark:text-gray-400"
                  >
                    {{ item.createdAt | date: 'short' }}
                  </td>
                  <td
                    app-table-cell
                    class="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-400"
                  >
                    {{ item.userEmail || '—' }}
                  </td>
                  <td
                    app-table-cell
                    class="px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-white/90"
                  >
                    {{ item.event }}
                  </td>
                  <td
                    app-table-cell
                    class="px-5 py-3.5 text-sm text-gray-500 sm:px-6 dark:text-gray-400"
                  >
                    {{ item.auditableType }} #{{ item.auditableId }}
                  </td>
                </tr>
              } @empty {
                <tr app-table-row>
                  <td
                    app-table-cell
                    colspan="4"
                    class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Nenhum evento registrado.
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
    </div>
  `,
})
export class AuditsPageComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  readonly items = signal<AuditItem[]>([]);
  readonly page = signal(0);
  readonly size = signal(20);
  readonly total = signal(0);

  ngOnInit(): void {
    this.reload();
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
    this.api.listAudits(this.page(), this.size()).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.total.set(result.total);
        this.page.set(result.page);
      },
    });
  }
}
