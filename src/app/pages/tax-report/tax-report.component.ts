import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { filter, switchMap, take } from 'rxjs';
import { FileService } from 'src/app/services/file/file.service';

import { RowActionCellParams } from '../../models/cell-renderer.model';
import { DialogClosedAddTaxReport, TaxReport } from '../../models/tax-report.model';
import { RowActionCellRendererComponent } from '../../modules/cell-renderer/row-action-cell-renderer/row-action-cell-renderer.component';
import { TaxReportDialogComponent } from '../../modules/tax-report-dialog/tax-report-dialog.component';
import { TaxReportService } from '../../services/tax-report/tax-report.service';

@Component({
  selector: 'tax-report',
  templateUrl: './tax-report.component.html',
  styleUrls: ['./tax-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxReportComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fileService: FileService,
    private taxReportService: TaxReportService
  ) {}

  gridOptions: GridOptions = {
    headerHeight: 40,
    rowHeight: 30,
    defaultColDef: {
      sortable: true,
      filter: true,
    },
    columnDefs: [
      { headerName: 'Year', field: 'fiscalYear', flex: 1 },
      { headerName: 'Quarter', field: 'fiscalQuarter', flex: 1 },
      {
        headerName: '',
        cellRenderer: RowActionCellRendererComponent,
        width: 100,
        cellRendererParams: {
          editAction: ({ node }: RowActionCellParams<TaxReport>) => this.editTaxReport(),
          deleteAction: ({ node }: RowActionCellParams<TaxReport>) => {},
        },
      },
    ],
  };

  taxReports$ = this.taxReportService.taxReports$;

  ngOnInit() {}

  addTaxReport() {
    this.dialog
      .open<TaxReportDialogComponent, void, DialogClosedAddTaxReport>(TaxReportDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(({ fiscalQuarter, fiscalYear, droppedFile }) =>
          this.fileService.uploadFile(droppedFile).pipe(
            switchMap((uploadedFile) =>
              this.taxReportService.addTaxReport({
                fiscalQuarter,
                fiscalYear,
                file: uploadedFile,
              })
            )
          )
        )
      )
      .subscribe();
  }

  editTaxReport() {
    this.dialog
      .open<TaxReportDialogComponent, unknown, unknown>(TaxReportDialogComponent)
      .afterClosed()
      .subscribe();
  }
}
