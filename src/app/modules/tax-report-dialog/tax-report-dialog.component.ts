import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FilePondFile, FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';
import { DialogClosedAddTaxReport, PondOtionsLabels } from 'src/app/models';
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
    private dialogRef: MatDialogRef<TaxReportDialogComponent, DialogClosedAddTaxReport>
  ) {}

  @ViewChild(FilePondComponent) pond!: FilePondComponent;

  fiscalQuarter = new FormControl(1, Validators.required);
  fiscalYear = new FormControl(new Date().getFullYear(), Validators.required);
  pondFile: FilePondFile | undefined = undefined;

  fiscalQuarters = getFiscalQuarters();
  fiscalYears = getFiscalYears(getDefaultStartDate(), getDefaultEndDate());

  pondOptions: FilePondOptions = {
    labelIdle: PondOtionsLabels.DropFilesHere,
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

    if (!this.hasFileError) {
      this.dialogRef.close({
        fiscalQuarter: this.fiscalQuarter.value,
        fiscalYear: this.fiscalYear.value,
        droppedFile: this.pondFile!.file as File,
      });
    }
  }

  private updateHasFileError(file?: FilePondFile): void {
    if (!file) {
      return this.onNotFileProvidedError();
    } else if (!isValidFileExtension(file.file as File)) {
      return this.onNotValidFileExtension(file);
    }

    this.hasFileError = false;
  }

  private onNotFileProvidedError(): void {
    this.hasFileError = true;
    this.pond['pond'].setOptions({
      labelIdle: PondOtionsLabels.NoFileProvidedError,
    });
  }

  private onNotValidFileExtension(file: FilePondFile): void {
    this.hasFileError = true;
    this.pond['pond'].removeFile(file);
    this.pond['pond'].setOptions({
      labelIdle: PondOtionsLabels.UnsupportedFileProvidedError,
    });
  }
}
