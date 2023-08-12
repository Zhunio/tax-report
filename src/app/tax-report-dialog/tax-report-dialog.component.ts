import { CommonModule } from '@angular/common';
import { Component, ViewChild, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilePondFile, FilePondOptions } from 'filepond';
import { FilePondComponent, FilePondModule } from 'ngx-filepond';

import {
  TaxReportDialogError,
  TaxReportDialogLabel,
} from '@/app/tax-report-dialog/tax-report-dialog.enum';
import { TaxReportCreateDialogResult } from './tax-report-dialog.model';

@Component({
  standalone: true,
  selector: 'tax-report-dialog',
  template: `
    <mat-dialog-content>
      <div class="grid grid-cols-2 gap-3">
        <!-- FISCAL QUARTER -->
        <mat-form-field>
          <mat-label>Fiscal Quarter</mat-label>
          <mat-select [value]="fiscalQuarter()" (valueChange)="fiscalQuarter.set($event)">
            <mat-option *ngFor="let quarter of fiscalQuarters()" [value]="quarter">
              {{ quarter }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- FISCAL YEAR -->
        <mat-form-field>
          <mat-label>Fiscal Year</mat-label>
          <mat-select [value]="fiscalYear()" (valueChange)="fiscalYear.set($event)">
            <mat-option *ngFor="let year of fiscalYears()" [value]="year">
              {{ year }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- FILE -->
        <file-pond
          class="col-span-2"
          [class.file-error]="hasFileError"
          [options]="pondOptions"
          (onaddfile)="onPondAddFile($event.file)"
        ></file-pond>

        <!-- DISREGARD CHANGES -->
        <button mat-raised-button color="warn" class="flex-1" (click)="disregardChanges()">
          Disregard Changes
        </button>
        <!-- SAVE CHANGES -->
        <button mat-raised-button color="primary" class="flex-1" (click)="saveChanges()">
          Save Changes
        </button>
      </div>
    </mat-dialog-content>
  `,
  styles: [
    `
      @use '../../styles/colors';

      ::ng-deep .file-error {
        transition: opacity 0.15s ease-out;
        animation: shake 0.65s linear both;
      }

      .file-error ::ng-deep .filepond--drip {
        background-color: colors.warn-color();
        opacity: 1;
      }

      .file-error ::ng-deep .filepond--drop-label {
        @apply text-white;
      }
    `,
  ],
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

  fiscalQuarters = signal([1, 2, 3, 4]);
  fiscalQuarter = signal(1);

  fiscalYears = signal(getFiscalYears(1999, 2050));
  fiscalYear = signal(new Date().getFullYear());

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
    } else if (!isValidFileExtension(filePondFile.file as File)) {
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

export function getFiscalYears(startYear: number, endYear: number) {
  const years = [];

  if (startYear > endYear) {
    throw new Error(`${startYear} is after ${endYear}`);
  }

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

export function isValidFileExtension(file: File): boolean {
  return file.name.includes('xlsx');
}
