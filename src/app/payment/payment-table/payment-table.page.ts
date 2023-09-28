import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Spectator, byText } from '@ngneat/spectator';
import { Payment } from '../payment.model';
import { PaymentTableComponent } from './payment-table.component';

export class PaymentTablePage {
  constructor(private readonly s: Spectator<PaymentTableComponent>) {}

  getLoadingProgressBar() {
    return this.s.query(MatProgressBar);
  }

  getLoadingText() {
    return this.s.query(byText('Loading...'));
  }

  getEmptyRowsLabel() {
    return this.s.query(byText('No rows to show'), { root: true });
  }

  getHeaderCells() {
    return this.s.queryAll('mat-header-row mat-header-cell');
  }

  getRowColumn(rowIndex: number, columnName: keyof Payment) {
    return this.s.query(`mat-row:nth-of-type(${rowIndex + 1}) .mat-column-${columnName}`);
  }

  expectToBeEmpty() {
    expect(this.s.component.dataSource().data).toEqual([]);
    expect(this.getEmptyRowsLabel()).not.toBeNull();
  }

  expectRowToHavePayment(rowIndex: number, payment: Payment) {
    expect(this.getRowColumn(rowIndex, 'type')).toHaveText(payment.type);
    expect(this.getRowColumn(rowIndex, 'date')).toHaveText(payment.date);
    expect(this.getRowColumn(rowIndex, 'number')).toHaveText(payment.number);
    expect(this.getRowColumn(rowIndex, 'method')).toHaveText(payment.method);
    expect(this.getRowColumn(rowIndex, 'name')).toHaveText(payment.name);
    expect(this.getRowColumn(rowIndex, 'price')).toHaveText(payment.price);
    expect(this.getRowColumn(rowIndex, 'tax')).toHaveText(payment.tax);
    expect(this.getRowColumn(rowIndex, 'total')).toHaveText(payment.total);
    expect(this.s.queryAll(MatCheckbox)[rowIndex].checked).toEqual(payment.isExempt);
  }
}
