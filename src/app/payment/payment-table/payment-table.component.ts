import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PaymentDto } from '@/app/shared/services/api/api.model';
import { BreakpointService } from '../../shared/services/breakpoint/breakpoint.service';
import { PaymentService } from '../payment.service';

@Component({
  standalone: true,
  selector: 'payment-table',
  template: `
    <mat-progress-bar *ngIf="isLoading()" class="mb-1" mode="indeterminate"></mat-progress-bar>

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
      <tr class="mat-row flex justify-center items-center" *matNoDataRow>
        <td class="mat-cell mat-body" [attr.colSpan]="columns.length">
          <ng-container *ngIf="isLoading()">Loading...</ng-container>
          <ng-container *ngIf="!isLoading()">No rows to show</ng-container>
        </td>
      </tr>
    </mat-table>
  `,
  styles: [
    `
      .mat-column-name {
        flex: 2;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
})
export class PaymentTableComponent {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly breakpointService: BreakpointService
  ) {}

  isLoading = this.paymentService.isLoading;

  dataSource = computed(() => new MatTableDataSource(this.paymentService.payments()));

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

  onCheckboxChange({ checked }: MatCheckboxChange, payment: PaymentDto) {
    this.paymentService
      .updatePayment({ paymentId: payment.id, update: { isExempt: checked } })
      .subscribe();
  }
}
