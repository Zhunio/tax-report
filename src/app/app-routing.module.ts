import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tax-report',
    loadChildren: () => import('./pages/tax-report/tax-report.module').then((m) => m.TaxReportModule),
  },
  {
    path: 'tax-report/:taxReportId',
    loadComponent: () => import('./payment/payment-shell/payment-shell.component').then((mod) => mod.PaymentShellComponent),
  },
  {
    path: '',
    redirectTo: '/tax-report',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
