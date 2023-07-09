import { TaxReportCreateDialogResult } from '@/app/api/models/tax-report.model';
import {
  TaxReportDialogError,
  TaxReportDialogLabel,
} from '@/app/tax-report/models/tax-report-dialog.model';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilePondFile, FilePondOptions } from 'filepond';
import { FilePondComponent, FilePondModule } from 'ngx-filepond';
import { TaxReportDialogService } from '../../services/tax-report-dialog.service';

@Component({
  selector: 'tax-report-dialog',
  standalone: true,
  templateUrl: './tax-report-dialog.component.html',
  styleUrls: ['./tax-report-dialog.component.scss'],
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
    private taxReportDialogService: TaxReportDialogService,
    private dialogRef: MatDialogRef<TaxReportDialogComponent, TaxReportCreateDialogResult>
  ) {}

  @ViewChild(FilePondComponent) pond!: FilePondComponent;

  fiscalQuarters = this.taxReportDialogService.fiscalQuarters;
  fiscalQuarter = this.taxReportDialogService.fiscalQuarter;

  fiscalYears = this.taxReportDialogService.fiscalYears;
  fiscalYear = this.taxReportDialogService.fiscalYear;

  pondFile: FilePondFile | undefined = undefined;
  pondOptions: FilePondOptions = { labelIdle: TaxReportDialogLabel.DropFilesHere };
  hasFileError = false;

  onPondAddFile(filePondFile: FilePondFile): void {
    this.updateHasFileError(filePondFile);

    if (!this.hasFileError) {
      this.pondFile = filePondFile;
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
        fiscalQuarter: this.fiscalQuarter(),
        fiscalYear: this.fiscalYear(),
        uploadedFile: this.pondFile!.file as File,
      },
    });
  }

  private updateHasFileError(filePondFile?: FilePondFile): void {
    if (!filePondFile) {
      return this.onTaxReportDialogError(TaxReportDialogError.NoFileProvided);
    } else if (!this.taxReportDialogService.isValidFileExtension(filePondFile.file as File)) {
      this.removeFile(filePondFile);
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
