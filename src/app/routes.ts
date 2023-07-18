import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tax-report',
    loadComponent: () =>
      import('./tax-report/components/tax-report-shell/tax-report-shell.component').then(
        (mod) => mod.TaxReportShellComponent
      ),
  },
  {
    path: 'tax-report/:taxReportId',
    loadComponent: () =>
      import('./payment/components/payment-shell/payment-shell.component').then(
        (mod) => mod.PaymentShellComponent
      ),
  },
  {
    path: '',
    redirectTo: '/tax-report',
    pathMatch: 'full',
  },
];
