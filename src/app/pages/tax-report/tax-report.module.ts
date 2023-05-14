import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';

import { CellRendererModule } from '../../modules/cell-renderer';
import { TaxReportDialogModule } from '../../modules/tax-report-dialog';
import { TaxReportRoutingModule } from './tax-report-routing.module';

import { TaxReportComponent } from './tax-report.component';
import { TaxReportEditDialogModule } from '@/app/modules/tax-report-edit-dialog/tax-report-edit-dialog.module';

@NgModule({
  declarations: [TaxReportComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    AgGridModule,
    CellRendererModule,
    TaxReportDialogModule,
    TaxReportEditDialogModule,
    TaxReportRoutingModule,
  ],
})
export class TaxReportModule {}
