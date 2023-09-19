import { NgIf } from '@angular/common';
import { Component, computed } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CurrencyPipe } from '../../shared/pipes/currency/currency.pipe';
import { PaymentService } from '../payment.service';
import { calculateReport, sumTotal } from './calculate-report';

@Component({
  standalone: true,
  selector: 'report-table',
  template: `
    <mat-table class="mat-elevation-z8" [dataSource]="dataSource()">
      <ng-container matColumnDef="month">
        <mat-header-cell *matHeaderCellDef>Month</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.month }} </mat-cell>
        <mat-footer-cell class="font-medium" *matFooterCellDef>Total</mat-footer-cell>
      </ng-container>
      <ng-container matColumnDef="taxableSales">
        <mat-header-cell *matHeaderCellDef>Taxable Sales</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.taxableSales | currency }} </mat-cell>
        <mat-footer-cell class="font-medium" *matFooterCellDef>{{
          taxableSalesTotal() | currency
        }}</mat-footer-cell>
      </ng-container>
      <ng-container matColumnDef="nonTaxableSales">
        <mat-header-cell *matHeaderCellDef>Non Taxable Sales</mat-header-cell>
        <mat-cell *matCellDef="let row"> {{ row.nonTaxableSales | currency }} </mat-cell>
        <mat-footer-cell class="font-medium" *matFooterCellDef>{{
          nonTaxableSalesTotal() | currency
        }}</mat-footer-cell>
      </ng-container>
      <ng-container matColumnDef="netTaxableSales">
        <mat-header-cell *matHeaderCellDef>Net Taxable Sales</mat-header-cell>
        <mat-cell class="font-medium" *matCellDef="let row">
          {{ row.netTaxableSales | currency }}
        </mat-cell>
        <mat-footer-cell class="font-medium" *matFooterCellDef>{{
          netTaxableSalesTotal() | currency
        }}</mat-footer-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: columns"></mat-row>
      <tr class="mat-row flex justify-center items-center" *matNoDataRow>
        <td class="mat-cell mat-body" [attr.colSpan]="columns.length">
          <ng-container *ngIf="isLoading()">Loading...</ng-container>
          <ng-container *ngIf="!isLoading()">No rows to show</ng-container>
        </td>
      </tr>
      <mat-footer-row [class.hidden]="isLoading()" *matFooterRowDef="columns"></mat-footer-row>
    </mat-table>
  `,
  imports: [NgIf, MatTableModule, CurrencyPipe, MatProgressBarModule],
})
export class ReportTableComponent {
  constructor(private readonly paymentService: PaymentService) {}

  isLoading = this.paymentService.isLoading;
  columns = ['month', 'taxableSales', 'nonTaxableSales', 'netTaxableSales'];
  reports = computed(() => calculateReport(this.paymentService.payments()));
  dataSource = computed(() => new MatTableDataSource(this.reports()));
  taxableSalesTotal = computed(() => sumTotal(this.reports(), 'taxableSales'));
  nonTaxableSalesTotal = computed(() => sumTotal(this.reports(), 'nonTaxableSales'));
  netTaxableSalesTotal = computed(() => sumTotal(this.reports(), 'netTaxableSales'));
}
