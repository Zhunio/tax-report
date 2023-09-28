import { Spectator, byText } from '@ngneat/spectator';

import { Report } from '../payment.model';
import { ReportTableComponent } from './report-table.component';

export class ReportTablePage {
  constructor(private readonly s: Spectator<ReportTableComponent>) {}

  getLoadingText() {
    return this.s.query(byText('Loading...'));
  }

  getEmptyRowsLabel() {
    return this.s.query(byText('No rows to show'), { root: true });
  }

  getHeaderCells() {
    return this.s.queryAll('mat-header-row mat-header-cell');
  }

  getRowColumn(rowIndex: number, columnName: keyof Report) {
    return this.s.query(`mat-row:nth-of-type(${rowIndex + 1}) .mat-column-${columnName}`);
  }

  getFooter(columnName: keyof Report) {
    return this.s.query(`mat-footer-row .mat-column-${columnName}`);
  }

  expectToBeEmpty() {
    expect(this.s.component.dataSource().data).toEqual([]);
    expect(this.getEmptyRowsLabel()).not.toBeNull();
  }

  expectRowToHaveReport(rowIndex: number, report: Report) {
    expect(this.getRowColumn(rowIndex, 'month')).toHaveText(report.month);
    expect(this.getRowColumn(rowIndex, 'taxableSales')).toHaveText(report.taxableSales);
    expect(this.getRowColumn(rowIndex, 'nonTaxableSales')).toHaveText(report.nonTaxableSales);
    expect(this.getRowColumn(rowIndex, 'netTaxableSales')).toHaveText(report.netTaxableSales);
  }

  expectRowsToHaveReports(reports: Report[]) {
    for (let rowIndex = 0; rowIndex < reports.length; rowIndex++) {
      this.expectRowToHaveReport(rowIndex, reports[rowIndex]);
    }
  }

  expectFooter({
    taxableSalesTotal,
    nonTaxableSalesTotal,
    netTaxableSalesTotal,
  }: {
    taxableSalesTotal: string;
    nonTaxableSalesTotal: string;
    netTaxableSalesTotal: string;
  }) {
    expect(this.getFooter('month')).toHaveText('Total');
    expect(this.getFooter('taxableSales')).toHaveText(taxableSalesTotal);
    expect(this.getFooter('nonTaxableSales')).toHaveText(nonTaxableSalesTotal);
    expect(this.getFooter('netTaxableSales')).toHaveText(netTaxableSalesTotal);
  }
}
