import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FilePondFile, FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';

import {
  TaxReportCreateDialogResult,
  TaxReportDialogError,
  TaxReportDialogLabel,
} from 'src/app/models';
import {
  getDefaultEndDate,
  getDefaultStartDate,
  getFiscalQuarters,
  getFiscalYears,
  isValidFileExtension,
} from 'src/app/utils';

@Component({
  selector: 'tax-report-dialog',
  templateUrl: './tax-report-dialog.component.html',
  styleUrls: ['./tax-report-dialog.component.scss'],
})
export class TaxReportDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TaxReportDialogComponent, TaxReportCreateDialogResult>
  ) {}

  @ViewChild(FilePondComponent) pond!: FilePondComponent;

  fiscalQuarter = new FormControl(1, Validators.required);
  fiscalYear = new FormControl(new Date().getFullYear(), Validators.required);
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
        fileName: this.getTaxReportFileName(),
        fileDestination: this.getTaxReportFileDestination(),
        uploadedFile: this.pondFile!.file as File,
      },
    });
  }

  private getTaxReportFileName() {
    return `tax-report.xlsx`;
  }

  private getTaxReportFileDestination() {
    return `/tax-reports/${this.fiscalYear.value}/Q${this.fiscalQuarter.value}`;
  }

  private updateHasFileError(file?: FilePondFile): void {
    if (!this.fiscalYear.value) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFiscalYearProvided);
    } else if (!this.fiscalQuarter.value) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFiscalQuarterProvided);
    } else if (!this.getTaxReportFileDestination()) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFileDestinationProvided);
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
