import { TaxReport, TaxReportCreateDialogResult } from '@/app/api/models/tax-report.model';
import { ApiService } from '@/app/api/services/api';
import { FileService } from '@/app/api/services/file';
import { TaxReportDialogComponent } from '@/app/tax-report/components/tax-report-dialog/tax-report-dialog';
import { Component, OnInit, computed, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'tax-report-shell',
  standalone: true,
  template: `
    <div class="flex items-center mb-2">
      <h1 class="text-lg flex-1">Tax Reports</h1>

      <button mat-icon-button color="primary" (click)="onCreateTaxReportClicked()">
        <mat-icon class="text-green-500">add_circle</mat-icon>
      </button>
    </div>

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
        <mat-cell *matCellDef="let row"> {{ row.fileName }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="rowActions">
        <mat-header-cell *matHeaderCellDef></mat-header-cell>
        <mat-cell *matCellDef="let row">
          <button
            mat-icon-button
            color="primary"
            (click)="$event.preventDefault(); onDownloadRowActionClicked(row)"
          >
            <mat-icon class="scale-90">cloud_download</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            (click)="$event.preventDefault(); onDeleteTaxReportClicked(row)"
          >
            <mat-icon class="scale-90">delete</mat-icon>
          </button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
      <mat-row (click)="onRowClicked(row)" *matRowDef="let row; columns: columns"></mat-row>
    </mat-table>
  `,
  imports: [MatIconModule, MatTableModule, MatCheckboxModule, MatDialogModule],
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
})
export class TaxReportShellComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fileService: FileService,
    private apiService: ApiService
  ) {}

  columns = ['fiscalYear', 'fiscalQuarter', 'fileName', 'rowActions'];
  taxReports = signal<TaxReport[]>([]);
  dataSource = computed(() => new MatTableDataSource(this.taxReports()));

  ngOnInit() {
    this.reloadTaxReports().subscribe();
  }

  onCreateTaxReportClicked() {
    this.createTaxReport().subscribe();
  }

  onDownloadRowActionClicked(taxReport: TaxReport) {
    this.downloadTaxReportFile(taxReport);
  }

  onDeleteTaxReportClicked(taxReport: TaxReport) {
    this.deleteTaxReport(taxReport.id).subscribe();
  }

  async onRowClicked(taxReport: TaxReport) {
    this.router.navigate(['tax-report', taxReport.id]);
  }

  private downloadTaxReportFile(taxReport: TaxReport) {
    const openedWindow = this.fileService.downloadFile(taxReport.file.id);

    if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
      console.log(
        'Oops... We could now download your file. Please try disabling your Pop-up blocker and try again'
      );
    }
  }

  private reloadTaxReports() {
    return this.apiService.getTaxReports().pipe(
      map((taxReports) =>
        taxReports.map((taxReport) => ({ ...taxReport, fileName: taxReport.file.fileName }))
      ),
      tap((taxReports) => this.taxReports.set(taxReports))
    );
  }

  private createTaxReport() {
    return this.dialog
      .open<TaxReportDialogComponent, void, TaxReportCreateDialogResult>(TaxReportDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(({ taxReport }) => this.apiService.createTaxReport(taxReport)),
        switchMap(() => this.reloadTaxReports())
      );
  }

  private deleteTaxReport(taxReportId: number) {
    return this.apiService
      .deleteTaxReport(taxReportId)
      .pipe(switchMap(() => this.reloadTaxReports()));
  }
}
