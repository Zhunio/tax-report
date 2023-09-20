import { Routes } from '@angular/router';
import { authGuard } from './shared/services/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'tax-report',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./tax-report/tax-report.component').then((mod) => mod.TaxReportComponent),
  },
  {
    path: 'tax-report/:taxReportId',
    canMatch: [authGuard],
    loadComponent: () => import('./payment/payment.component').then((mod) => mod.PaymentComponent),
  },
  {
    path: 'register',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./register/register.component').then((mod) => mod.RegisterComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((mod) => mod.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: '',
    redirectTo: '/tax-report',
    pathMatch: 'full',
  },
];
