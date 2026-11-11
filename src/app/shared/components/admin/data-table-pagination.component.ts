import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../ui/button/button.component';

/**
 * Paginação no padrão Data Table 3 (TailAdmin):
 * "Mostrando X a Y de Z" + páginas numeradas.
 * currentPage é 1-based (como no template TailAdmin).
 */
@Component({
  selector: 'app-data-table-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  host: { class: 'block' },
  template: `
    <div
      class="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">
        @if (total === 0) {
          Nenhum registro
        } @else {
          Mostrando {{ from }} a {{ to }} de {{ total }}
        }
      </p>

      <!-- Mobile -->
      <div class="flex w-full items-center justify-between sm:hidden">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-400">
          {{ currentPage }}/{{ totalPages }}
        </span>
        <div class="flex items-center gap-2">
          <button
            app-button
            variant="unstyled"
            type="button"
            [disabled]="currentPage <= 1"
            (click)="go(currentPage - 1)"
            aria-label="Página anterior"
            class="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <svg class="size-4 rtl:rotate-180" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
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
            [disabled]="currentPage >= totalPages"
            (click)="go(currentPage + 1)"
            aria-label="Próxima página"
            class="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <svg class="size-4 rtl:rotate-180" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Desktop -->
      <nav class="hidden items-center gap-1.5 sm:flex" aria-label="Paginação">
        <button
          app-button
          variant="unstyled"
          type="button"
          [disabled]="currentPage <= 1"
          (click)="go(currentPage - 1)"
          aria-label="Página anterior"
          class="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <svg class="size-4 rtl:rotate-180" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        @for (item of pages; track $index) {
          @if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            <span class="flex size-9 items-center justify-center text-sm text-gray-500 dark:text-gray-400"
              >...</span
            >
          } @else {
            <button
              app-button
              variant="unstyled"
              type="button"
              (click)="go(+item)"
              class="flex size-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition"
              [class]="
                currentPage === item
                  ? 'border-brand-500 bg-brand-500 text-white shadow-theme-xs dark:border-brand-500 dark:bg-brand-500'
                  : 'border-gray-300 bg-white text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5'
              "
            >
              {{ item }}
            </button>
          }
        }

        <button
          app-button
          variant="unstyled"
          type="button"
          [disabled]="currentPage >= totalPages"
          (click)="go(currentPage + 1)"
          aria-label="Próxima página"
          class="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <svg class="size-4 rtl:rotate-180" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  `,
})
export class DataTablePaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() from = 0;
  @Input() to = 0;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): (number | 'ellipsis-start' | 'ellipsis-end')[] {
    const n = Math.max(1, this.totalPages);
    if (n <= 7) {
      return Array.from({ length: n }, (_, i) => i + 1);
    }
    if (this.currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis-end', n];
    }
    if (this.currentPage >= n - 3) {
      return [1, 'ellipsis-start', n - 4, n - 3, n - 2, n - 1, n];
    }
    return [
      1,
      'ellipsis-start',
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      'ellipsis-end',
      n,
    ];
  }

  go(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
