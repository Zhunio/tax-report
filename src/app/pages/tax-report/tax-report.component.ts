import {
  RowActionCellParams,
  TaxReport,
  TaxReportCreateDialogResult,
  TaxReportGrid,
} from '@/app/models';
import { RowActionCellRendererComponent, TaxReportDialogComponent } from '@/app/modules';
import { TaxReportService } from '@/app/services';
import { FileService } from '@/app/services/file/file.service';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { GridOptions, RowClickedEvent } from 'ag-grid-community';
import { Worksheet } from 'exceljs';
import { BehaviorSubject, filter, map, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'tax-report',
  templateUrl: './tax-report.component.html',
  styleUrls: ['./tax-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxReportComponent implements OnInit {
  constructor(
    private router: Router,
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
      { headerName: 'Filename', field: 'fileName', flex: 1 },
      {
        headerName: '',
        cellRenderer: RowActionCellRendererComponent,
        width: 100,
        cellRendererParams: {
          onDeleteRowAction: this.onDeleteTaxReportClicked.bind(this),
          onDownloadRowAction: this.onDownloadRowActionClicked.bind(this),
        },
      },
    ],
  };

  taxReports$ = new BehaviorSubject<TaxReportGrid[]>([]);

  ngOnInit() {
    this.reloadTaxReports().subscribe();
  }

  onCreateTaxReportClicked() {
    this.createTaxReport().subscribe();
  }

  onDownloadRowActionClicked({ node }: RowActionCellParams<TaxReport>) {
    if (node.data) {
      this.downloadTaxReportFile(node.data);
    }
  }

  onDeleteTaxReportClicked({ node }: RowActionCellParams<TaxReport>) {
    if (node.data) {
      this.deleteTaxReport(node.data.id).subscribe();
    }
  }

  async onRowClicked({ data }: RowClickedEvent<TaxReport>) {
    if (data) {
      this.router.navigate(['tax-report', data.id]);
    }
  }

  initColumns(worksheet: Worksheet) {
    worksheet.columns = [
      { header: '', key: 'A' },
      { header: 'Type', key: 'paymentType' },
      { header: '', key: 'C' },
      { header: 'Date', key: 'paymentDate' },
      { header: '', key: 'E' },
      { header: 'Num', key: 'paymentNumber' },
      { header: '', key: 'G' },
      { header: 'Name', key: 'customerName' },
      { header: '', key: 'I' },
      { header: 'Pay Meth', key: 'paymentMethod' },
      { header: '', key: 'K' },
      { header: 'Amount', key: 'total' },
    ];
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
    return this.taxReportService.getTaxReports().pipe(
      map((taxReports) =>
        taxReports.map((taxReport) => ({ ...taxReport, fileName: taxReport.file.fileName }))
      ),
      tap((taxReports) => this.taxReports$.next(taxReports))
    );
  }

  private createTaxReport() {
    return this.dialog
      .open<TaxReportDialogComponent, void, TaxReportCreateDialogResult>(TaxReportDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(({ taxReport }) => this.taxReportService.createTaxReport(taxReport)),
        switchMap(() => this.reloadTaxReports())
      );
  }

  private deleteTaxReport(taxReportId: number) {
    return this.taxReportService
      .deleteTaxReport(taxReportId)
      .pipe(switchMap(() => this.reloadTaxReports()));
  }
}
