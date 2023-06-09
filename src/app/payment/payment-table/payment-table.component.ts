import { Payment } from '@/app/models/payment.model';
import { PaymentService } from '@/app/payment/payment';
import { CurrencyPipe } from '../currency';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'payment-table',
  template: `
    <mat-table [dataSource]="dataSource()">
      <ng-container matColumnDef="type">
        <mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.type }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="date">
        <mat-header-cell *matHeaderCellDef>Date</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.date }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="number">
        <mat-header-cell *matHeaderCellDef>Number</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.number }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="method">
        <mat-header-cell *matHeaderCellDef>Method</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.method }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef>Customer Name</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.name }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="price">
        <mat-header-cell *matHeaderCellDef>Price</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.price | currency }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="tax">
        <mat-header-cell *matHeaderCellDef>Tax</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.tax | currency }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="total">
        <mat-header-cell *matHeaderCellDef>Total</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.total | currency }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef="isExempt">
        <mat-header-cell *matHeaderCellDef>Is Exempt?</mat-header-cell>
        <mat-cell *matCellDef="let row">
          <mat-checkbox
            (change)="onCheckboxChange($event, row)"
            [checked]="row.isExempt"
          ></mat-checkbox
        ></mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: columns"></mat-row>
    </mat-table>
  `,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, CurrencyPipe],
})
export class PaymentTableComponent {
  paymentService = inject(PaymentService);

  payments = this.paymentService.payments;
  updatePaymentAction = this.paymentService.updatePaymentAction;

  columns = ['type', 'date', 'number', 'method', 'name', 'price', 'tax', 'total', 'isExempt'];
  dataSource = computed(() => new MatTableDataSource(this.payments()));

  onCheckboxChange({ checked }: MatCheckboxChange, payment: Payment) {
    this.updatePaymentAction.next({
      paymentId: payment.id,
      update: { isExempt: checked },
    });
  }
}
