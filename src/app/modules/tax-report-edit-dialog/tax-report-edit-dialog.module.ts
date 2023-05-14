import { TaxReportEditDialogComponent } from '@/app/modules/tax-report-edit-dialog/tax-report-edit-dialog.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [TaxReportEditDialogComponent],
  imports: [CommonModule, MatDialogModule, MatIconModule, AgGridModule],
  exports: [TaxReportEditDialogComponent],
})
export class TaxReportEditDialogModule {}
