import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilePondModule } from 'ngx-filepond';

import { TaxReportDialogComponent } from './tax-report-dialog.component';

const components = [TaxReportDialogComponent];

@NgModule({
  declarations: [TaxReportDialogComponent],
  exports: [...components],
  imports: [
    CommonModule,
    FilePondModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class TaxReportDialogModule {}
