import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { DashboardStats } from '../../../core/api/api-types';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent, NgApexchartsModule, ButtonComponent],
  template: `
    <div class="space-y-6">
      <app-page-breadcrumb pageTitle="Painel" />
      @if (error()) {
        <p class="text-sm text-error-500">{{ error() }}</p>
      }
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p class="text-sm text-gray-500 dark:text-gray-400">Usuários</p>
          <p class="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            {{ stats()?.users ?? '—' }}
          </p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p class="text-sm text-gray-500 dark:text-gray-400">Perfis</p>
          <p class="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            {{ stats()?.roles ?? '—' }}
          </p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p class="text-sm text-gray-500 dark:text-gray-400">Auditorias</p>
          <p class="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            {{ stats()?.audits ?? '—' }}
          </p>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-6 dark:border-gray-800 dark:bg-white/3"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              Usuários criados
            </h3>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Quantidade por dia (UTC) — últimos {{ days() }} dias
            </p>
          </div>
          <div class="inline-flex rounded-xl border border-gray-200 p-1 dark:border-gray-700">
            @for (option of dayOptions; track option) {
              <button
                app-button
                variant="unstyled"
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
                [class]="
                  days() === option
                    ? 'bg-brand-500 text-white shadow-theme-xs'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                "
                (click)="setDays(option)"
              >
                {{ option }}d
              </button>
            }
          </div>
        </div>
        <div class="mt-4">
          <apx-chart
            [series]="series"
            [chart]="chart"
            [plotOptions]="plotOptions"
            [dataLabels]="dataLabels"
            [xaxis]="xaxis"
            [yaxis]="yaxis"
            [grid]="grid"
            [tooltip]="tooltip"
            [colors]="colors"
          ></apx-chart>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  readonly stats = signal<DashboardStats | null>(null);
  readonly error = signal<string | null>(null);
  readonly days = signal(7);
  readonly dayOptions = [7, 14, 30] as const;

  series: ApexAxisChartSeries = [{ name: 'Usuários', data: [] }];
  chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    height: 280,
    toolbar: { show: false },
  };
  plotOptions: ApexPlotOptions = {
    bar: {
      columnWidth: '42%',
      borderRadius: 8,
      borderRadiusApplication: 'end',
    },
  };
  dataLabels: ApexDataLabels = { enabled: false };
  xaxis: ApexXAxis = {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#9ca3af', fontSize: '12px' } },
  };
  yaxis: ApexYAxis = {
    labels: { style: { colors: '#9ca3af', fontSize: '12px' } },
    min: 0,
    forceNiceScale: true,
  };
  grid: ApexGrid = {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  };
  tooltip: ApexTooltip = {
    theme: 'dark',
    y: { formatter: (v: number) => `${v} usuário(s)` },
  };
  colors = ['#465fff'];

  ngOnInit(): void {
    this.load();
  }

  setDays(days: number): void {
    if (this.days() === days) return;
    this.days.set(days);
    this.load();
  }

  private load(): void {
    this.api.dashboardStats(this.days()).subscribe({
      next: (s) => {
        this.stats.set(s);
        const seriesDays = s.usersCreatedByDay ?? [];
        this.xaxis = {
          ...this.xaxis,
          categories: seriesDays.map((d) => d.date.slice(5)),
        };
        this.series = [{ name: 'Usuários', data: seriesDays.map((d) => d.count) }];
        this.plotOptions = {
          ...this.plotOptions,
          bar: {
            ...this.plotOptions.bar,
            columnWidth: seriesDays.length > 14 ? '55%' : '42%',
          },
        };
      },
      error: () => this.error.set('Não foi possível carregar as estatísticas.'),
    });
  }
}
