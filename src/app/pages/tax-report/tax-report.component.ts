import {
  RowActionCellParams,
  TaxReport,
  TaxReportCreateDialogResult,
  TaxReportGrid,
} from '@/app/models';
import { Payment } from '@/app/models/payment.model';
import { RowActionCellRendererComponent, TaxReportDialogComponent } from '@/app/modules';
import { TaxReportEditDialogComponent } from '@/app/modules/tax-report-edit-dialog/tax-report-edit-dialog.component';
import { TaxReportService } from '@/app/services';
import { FileService } from '@/app/services/file/file.service';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions, RowClickedEvent } from 'ag-grid-community';
import { format, isDate } from 'date-fns';
import { Workbook, Worksheet } from 'exceljs';
import { BehaviorSubject, filter, firstValueFrom, map, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'tax-report',
  templateUrl: './tax-report.component.html',
  styleUrls: ['./tax-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxReportComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private taxReportService: TaxReportService,
    private fileService: FileService
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
      const fileBuffer = await firstValueFrom(this.fileService.getFileBuffer(data.file.id));
      const workbook = await new Workbook().xlsx.load(fileBuffer.data);

      const payments: Payment[] = [];
      workbook.eachSheet?.((worksheet) => {
        this.initColumns(worksheet);

        worksheet.eachRow((row) => {
          if (isDate(row.getCell('paymentDate').value)) {
            const total = row.getCell('total').value as number;
            const calculatedAmount = total / 1.08125;
            const calculatedTax = calculatedAmount * 0.08125;
            const calculatedTotal = calculatedAmount + calculatedTax;

            const payment: Payment = {
              paymentType: row.getCell('paymentType').value as string,
              paymentDate: format(
                new Date(row.getCell('paymentDate').value as string),
                'MM/dd/yyyy'
              ),
              paymentNumber: row.getCell('paymentNumber').value as string,
              customerName: row.getCell('customerName').value as string,
              paymentMethod: row.getCell('paymentMethod').value as string,
              total,
              calculatedAmount,
              calculatedTax,
              calculatedTotal,
            };

            payments.push(payment);
          }
        });
      });

      this.dialog
        .open<TaxReportEditDialogComponent, { payments: Payment[] }>(TaxReportEditDialogComponent, {
          data: { payments },
          panelClass: 'tax-report-edit-dialog',
        })
        .afterClosed()
        .pipe(
          take(1),
          filter(Boolean),
          switchMap(() => this.reloadTaxReports())
        )
        .subscribe();
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
