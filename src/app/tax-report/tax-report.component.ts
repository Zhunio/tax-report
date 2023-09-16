import { NgIf } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, filter, finalize, of, switchMap, take, tap } from 'rxjs';

import { TaxReportDialogComponent } from '@/app/tax-report-dialog/tax-report-dialog.component';
import { TaxReportCreateDialogResult } from '@/app/tax-report-dialog/tax-report-dialog.model';
import { TaxReportDto } from '../shared/services/api/api.model';
import { ApiService } from '../shared/services/api/api.service';
import { FileService } from '../shared/services/file/file.service';
import { NotificationService } from '../shared/services/notification/notification.service';
import { TaxReportErrorLabel } from './tax-report.enum';

@Component({
  standalone: true,
  selector: 'tax-report',
  template: `
    <div class="flex items-center mb-2">
      <h1 class="text-lg flex-1">Tax Reports</h1>

      <button mat-icon-button color="primary" (click)="onCreateTaxReportClicked()">
        <mat-icon class="text-green-500">add_circle</mat-icon>
      </button>
    </div>

    <mat-progress-bar *ngIf="isLoading" class="mb-1" mode="indeterminate"></mat-progress-bar>

    <mat-table class="striped-rows mat-elevation-z8" [dataSource]="dataSource()">
      <ng-container matColumnDef="fiscalYear">
        <mat-header-cell *matHeaderCellDef>Fiscal Year</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.fiscalYear }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="fiscalQuarter">
        <mat-header-cell *matHeaderCellDef>Fiscal Quarter</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.fiscalQuarter }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="fileName">
        <mat-header-cell *matHeaderCellDef>Filename</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.file.fileName }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="rowActions">
        <mat-header-cell *matHeaderCellDef></mat-header-cell>
        <mat-cell *matCellDef="let row">
          <button mat-icon-button color="primary" (click)="onDownloadRowActionClicked($event, row)">
            <mat-icon class="scale-90">cloud_download</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onDeleteTaxReportClicked($event, row)">
            <mat-icon class="scale-90">delete</mat-icon>
          </button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
      <mat-row (click)="onRowClicked(row)" *matRowDef="let row; columns: columns"></mat-row>
      <tr class="mat-row flex justify-center items-center" *matNoDataRow>
        <td class="mat-cell mat-body" [attr.colSpan]="columns.length" *ngIf="!isLoading">
          <ng-container *ngIf="isLoading">Loading...</ng-container>
          <ng-container *ngIf="!isLoading">No rows to show</ng-container>
        </td>
      </tr>
    </mat-table>
  `,
  styles: [
    `
      :host {
        @apply px-4 py-4;
      }

      .mat-column-rowActions {
        max-width: 100px;
      }
    `,
  ],
  providers: [ApiService, FileService, NotificationService],
  imports: [
    NgIf,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
})
export class TaxReportComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private apiService: ApiService,
    private fileService: FileService,
    private notificationService: NotificationService
  ) {}

  isLoading = false;

  columns = ['fiscalYear', 'fiscalQuarter', 'fileName', 'rowActions'];
  taxReports = signal<TaxReportDto[]>([]);
  dataSource = computed(() => new MatTableDataSource(this.taxReports()));

  ngOnInit() {
    this.reloadTaxReports().subscribe();
  }

  onCreateTaxReportClicked() {
    this.createTaxReport().subscribe();
  }

  onDownloadRowActionClicked(e: MouseEvent, taxReport: TaxReportDto) {
    e.stopPropagation();
    this.downloadTaxReportFile(taxReport);
  }

  onDeleteTaxReportClicked(e: MouseEvent, taxReport: TaxReportDto) {
    e.stopPropagation();
    this.deleteTaxReport(taxReport.id).subscribe();
  }

  onRowClicked(taxReport: TaxReportDto) {
    this.router.navigate(['tax-report', taxReport.id]);
  }

  downloadTaxReportFile(taxReport: TaxReportDto) {
    const openedWindow = this.fileService.downloadFile(taxReport.file.id);

    if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
      console.error(TaxReportErrorLabel.CouldNotDownloadTaxReport);
      this.notificationService.openErrorMessage(TaxReportErrorLabel.CouldNotDownloadTaxReport);
    }
  }

  reloadTaxReports() {
    this.isLoading = true;

    return this.apiService.getTaxReports().pipe(
      catchError(() => {
        console.error(TaxReportErrorLabel.CouldNotReloadTaxReports);
        this.notificationService.openErrorMessage(TaxReportErrorLabel.CouldNotReloadTaxReports);

        return of([]);
      }),
      tap((taxReports) => {
        this.taxReports.set(taxReports);
        this.isLoading = false;
      })
    );
  }

  createTaxReport() {
    this.isLoading = true;

    const dialogRef = this.dialog.open<TaxReportDialogComponent, void, TaxReportCreateDialogResult>(
      TaxReportDialogComponent
    );

    return dialogRef.afterClosed().pipe(
      take(1),
      filter(Boolean),
      switchMap(({ taxReport }) =>
        this.apiService.createTaxReport(taxReport).pipe(
          catchError(() => {
            console.error(TaxReportErrorLabel.CouldNotCreateTaxReport);
            this.notificationService.openErrorMessage(TaxReportErrorLabel.CouldNotCreateTaxReport);

            return of([]);
          })
        )
      ),
      switchMap(() => this.reloadTaxReports()),
      finalize(() => (this.isLoading = false))
    );
  }

  deleteTaxReport(taxReportId: number) {
    this.isLoading = true;

    return this.apiService.deleteTaxReport(taxReportId).pipe(
      catchError(() => {
        console.error(TaxReportErrorLabel.CouldNotDeleteTaxReport);
        this.notificationService.openErrorMessage(TaxReportErrorLabel.CouldNotDeleteTaxReport);

        return of([]);
      }),
      switchMap(() => this.reloadTaxReports()),
      tap(() => (this.isLoading = false))
    );
  }
}
