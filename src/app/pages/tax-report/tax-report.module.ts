import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';

import { CellRendererModule } from '../../modules/cell-renderer';
import { TaxReportDialogModule } from '../../modules/tax-report-dialog';
import { TaxReportRoutingModule } from './tax-report-routing.module';

import { TaxReportComponent } from './tax-report.component';

@NgModule({
  declarations: [TaxReportComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    AgGridModule,
    CellRendererModule,
    TaxReportDialogModule,
    TaxReportRoutingModule,
  ],
})
export class TaxReportModule {}
