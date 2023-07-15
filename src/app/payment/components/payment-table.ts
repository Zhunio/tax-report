import { Payment } from '@/app/api/models/payment.model';
import { PaymentService } from '@/app/payment/services/payment/payment.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs';
import { CurrencyPipe } from '../pipes/currency.pipe';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  breakpointObserver = inject(BreakpointObserver);

  isXSmall = this.isMatched(Breakpoints.XSmall);
  isSmall = this.isMatched(Breakpoints.Small);
  isMedium = this.isMatched(Breakpoints.Medium);
  isLarge = this.isMatched(Breakpoints.Large);
  isXLarge = this.isMatched(Breakpoints.XLarge);

  isMatched(value: string | readonly string[]) {
    return toSignal(this.breakpointObserver.observe(value).pipe(map(({ matches }) => matches)));
  }
}

@Component({
  standalone: true,
  selector: 'payment-table',
  template: `
    <mat-table class="striped-rows mat-elevation-z8" [dataSource]="dataSource()">
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
        <mat-cell [matTooltip]="row.name" *matCellDef="let row"> {{ row.name }} </mat-cell>
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

      <mat-header-row *matHeaderRowDef="columns()"></mat-header-row>
      <mat-row *matRowDef="let row; columns: columns()"></mat-row>
    </mat-table>
  `,
  styles: [
    `
      .mat-column-name {
        flex: 2;
      }
    `,
  ],
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatTooltipModule, CurrencyPipe],
})
export class PaymentTableComponent {
  paymentService = inject(PaymentService);
  breakpointService = inject(BreakpointService);

  payments = this.paymentService.payments;

  columns = computed(() => {
    if (this.breakpointService.isXSmall()) {
      return ['name', 'price', 'tax', 'total', 'isExempt'];
    } else if (this.breakpointService.isSmall()) {
      return ['date', 'name', 'price', 'tax', 'total', 'isExempt'];
    } else if (this.breakpointService.isMedium()) {
      return ['type', 'date', 'number', 'method', 'name', 'price', 'tax', 'total', 'isExempt'];
    } else if (this.breakpointService.isLarge()) {
      return ['type', 'date', 'number', 'method', 'name', 'price', 'tax', 'total', 'isExempt'];
    }

    return ['type', 'date', 'number', 'method', 'name', 'price', 'tax', 'total', 'isExempt'];
  });

  dataSource = computed(() => new MatTableDataSource(this.payments()));

  onCheckboxChange({ checked }: MatCheckboxChange, payment: Payment) {
    this.paymentService.updatePayment({
      paymentId: payment.id,
      update: { isExempt: checked },
    });
  }
}
