import { Spectator, byText } from '@ngneat/spectator';

import { TaxReportDto } from '@/app/shared/services/api/api.model';
import { TaxReportCreateDialogResult } from '@/app/tax-report-dialog/tax-report-dialog.model';
import { TaxReportComponent } from './tax-report.component';
import { TaxReportErrorLabel } from './tax-report.enum';

export class TaxReportShellPage {
  constructor(private s: Spectator<TaxReportComponent>) {}

  getEmptyRowsLabel() {
    return this.s.query(byText('No rows to show'), { root: true });
  }

  getCouldNotReloadTaxReportsErrorLabel() {
    return this.s.query(byText(TaxReportErrorLabel.CouldNotReloadTaxReports), { root: true });
  }

  getCouldNotDownloadTaxReportErrorLabel() {
    return this.s.query(byText(TaxReportErrorLabel.CouldNotDownloadTaxReport), { root: true });
  }

  getCouldNotDeleteTaxReportErrorLabel() {
    return this.s.query(byText(TaxReportErrorLabel.CouldNotDeleteTaxReport), { root: true });
  }

  getCouldNotCreateTaxReportErrorLabel() {
    return this.s.query(byText(TaxReportErrorLabel.CouldNotCreateTaxReport), { root: true });
  }

  getHeaderColumn(columnName: string) {
    return this.s.query(`mat-header-row .mat-column-${columnName}`);
  }

  getRowColumn(rowIndex: number, columnName: string) {
    return this.s.query(`mat-row:nth-of-type(${rowIndex + 1}) .mat-column-${columnName}`);
  }

  getRowDownloadButton(rowIndex: number) {
    return this.s.query(`mat-row:nth-of-type(${rowIndex + 1}) [mat-icon-button]:nth-of-type(1)`);
  }

  getRowDeleteButton(rowIndex: number) {
    return this.s.query(`mat-row:nth-of-type(${rowIndex + 1}) [mat-icon-button]:nth-of-type(2)`);
  }

  clickCreateTaxReport() {
    this.s.click(byText('add_circle')!);
  }

  clickRowDownloadButton(rowIndex: number) {
    this.s.click(this.getRowDownloadButton(rowIndex)!);
  }

  clickRowDeleteButton(rowIndex: number) {
    this.s.click(this.getRowDeleteButton(rowIndex)!);
  }

  expectRowToHaveTaxReport(rowIndex: number, taxReport: TaxReportDto) {
    expect(this.getRowColumn(rowIndex, 'fiscalYear')).toHaveText(taxReport.fiscalYear.toString());
    expect(this.getRowColumn(rowIndex, 'fiscalQuarter')).toHaveText(
      taxReport.fiscalQuarter.toString()
    );
    expect(this.getRowColumn(rowIndex, 'fileName')).toHaveText(taxReport.file.fileName);
    expect(this.getRowColumn(rowIndex, 'rowActions')).toHaveText('cloud_download');
    expect(this.getRowColumn(rowIndex, 'rowActions')).toHaveText('delete');
  }

  expectToBeEmpty() {
    expect(this.s.component.dataSource().data).toEqual([]);
    expect(this.getEmptyRowsLabel()).not.toBeNull();
  }
}

export function getMockTaxReportCreateDialogResult(): TaxReportCreateDialogResult {
  return { taxReport: { fiscalQuarter: 1, fiscalYear: 1995, uploadedFile: {} as File } };
}

export function getMockTaxReports(): TaxReportDto[] {
  return [
    {
      id: 1,
      fiscalQuarter: 1,
      fiscalYear: 1995,
      file: { fileName: 'tax-report.xlsx' },
      payments: [{ id: 1 }],
    } as TaxReportDto,
  ];
}
