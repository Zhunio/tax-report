import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxReportComponent } from './tax-report.component';

const routes: Routes = [{ path: '', component: TaxReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxReportRoutingModule {}
