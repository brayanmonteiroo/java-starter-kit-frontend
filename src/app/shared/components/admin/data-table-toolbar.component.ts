import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '../ui/input/input.directive';

/**
 * Toolbar no padrão Data Table 3 (TailAdmin):
 * esquerda = "Mostrar N"; direita = busca + ações (ng-content).
 * O título da página fica no breadcrumb — não no card.
 */
@Component({
  selector: 'app-data-table-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDirective],
  host: { class: 'block' },
  template: `
    <div
      class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div class="flex items-center gap-2">
        @if (showPageSize) {
          <label class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            Mostrar
            <select
              class="h-10 rounded-[10px] border border-gray-300 bg-white px-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              [ngModel]="pageSize"
              (ngModelChange)="pageSizeChange.emit(+$event)"
            >
              @for (opt of pageSizeOptions; track opt) {
                <option [ngValue]="opt">{{ opt }}</option>
              }
            </select>
          </label>
        }
      </div>

      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        @if (showSearch) {
          <div
            class="group/input-group relative flex h-10 w-full min-w-0 items-center rounded-[10px] border border-gray-300 bg-white shadow-theme-xs outline-hidden transition-colors focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/20 sm:w-64 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-brand-500/40"
          >
            <div class="flex h-auto items-center justify-center ps-3.5 pe-0 text-gray-400">
              <svg class="size-5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M14.382 14.383l3.325 3.326m-1.249-8.334a7.082 7.082 0 01-7.083 7.081 7.082 7.082 0 110-14.163 7.082 7.082 0 017.083 7.082z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <input
              app-input
              unstyled
              type="search"
              [placeholder]="searchPlaceholder"
              class="h-full flex-1 rounded-none border-0 bg-transparent ps-2 pe-4 text-sm text-gray-800 shadow-none outline-hidden placeholder:text-gray-400 focus:ring-0 dark:bg-transparent dark:text-white/90"
              [ngModel]="searchQuery"
              (ngModelChange)="searchQueryChange.emit($event)"
            />
          </div>
        }
        <ng-content />
      </div>
    </div>
  `,
})
export class DataTableToolbarComponent {
  @Input() showPageSize = true;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Output() pageSizeChange = new EventEmitter<number>();

  @Input() showSearch = false;
  @Input() searchQuery = '';
  @Input() searchPlaceholder = 'Buscar...';
  @Output() searchQueryChange = new EventEmitter<string>();
}
