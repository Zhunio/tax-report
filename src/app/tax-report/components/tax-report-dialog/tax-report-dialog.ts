import { TaxReportCreateDialogResult } from '@/app/api/models/tax-report.model';
import {
  TaxReportDialogError,
  TaxReportDialogLabel,
} from '@/app/tax-report/models/tax-report-dialog.model';
import {
  getDefaultEndDate,
  getDefaultStartDate,
  getFiscalQuarters,
  getFiscalYears,
  isValidFileExtension,
} from '@/app/tax-report/utils/tax-report-dialog.util';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilePondFile, FilePondOptions } from 'filepond';
import { FilePondComponent, FilePondModule } from 'ngx-filepond';

@Component({
  selector: 'tax-report-dialog',
  standalone: true,
  templateUrl: './tax-report-dialog.html',
  styleUrls: ['./tax-report-dialog.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FilePondModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
  ],
})
export class TaxReportDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TaxReportDialogComponent, TaxReportCreateDialogResult>
  ) {}

  @ViewChild(FilePondComponent) pond!: FilePondComponent;

  fiscalQuarter = new UntypedFormControl(1, Validators.required);
  fiscalYear = new UntypedFormControl(new Date().getFullYear(), Validators.required);
  pondFile: FilePondFile | undefined = undefined;

  fiscalQuarters = getFiscalQuarters();
  fiscalYears = getFiscalYears(getDefaultStartDate(), getDefaultEndDate());

  pondOptions: FilePondOptions = {
    labelIdle: TaxReportDialogLabel.DropFilesHere,
  };

  hasFileError = false;

  onPondAddFile(file: FilePondFile): void {
    this.updateHasFileError(file);

    if (!this.hasFileError) {
      this.pondFile = file;
    }
  }

  disregardChanges(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.updateHasFileError(this.pondFile);

    if (this.hasFileError) {
      return;
    }

    this.dialogRef.close({
      taxReport: {
        fiscalQuarter: this.fiscalQuarter.value,
        fiscalYear: this.fiscalYear.value,
        uploadedFile: this.pondFile!.file as File,
      },
    });
  }

  private updateHasFileError(file?: FilePondFile): void {
    if (!this.fiscalYear.value) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFiscalYearProvided);
    } else if (!this.fiscalQuarter.value) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFiscalQuarterProvided);
    } else if (!file) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFileProvided);
    } else if (!isValidFileExtension(file.file as File)) {
      this.removeFile(file);
      return this.onTaxReportDialogError(TaxReportDialogError.UnsupportedFileProvided);
    }

    this.hasFileError = false;
  }

  private onTaxReportDialogError(taxReportDialogError: TaxReportDialogError): void {
    this.hasFileError = true;
    this.pond['pond'].setOptions({
      labelIdle: taxReportDialogError,
    });
  }

  private removeFile(file: FilePondFile): void {
    this.pond['pond'].removeFile(file);
  }
}
