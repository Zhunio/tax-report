import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
