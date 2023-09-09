import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tax-report',
    loadComponent: () =>
      import('./tax-report/tax-report.component').then((mod) => mod.TaxReportComponent),
  },
  {
    path: 'tax-report/:taxReportId',
    loadComponent: () => import('./payment/payment.component').then((mod) => mod.PaymentComponent),
  },
  {
    path: '',
    redirectTo: '/tax-report',
    pathMatch: 'full',
  },
];
