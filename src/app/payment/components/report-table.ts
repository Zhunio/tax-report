import { CurrencyPipe } from '../pipes/currency';
import { PaymentService } from '@/app/payment/services/payment';
import { sumTotal } from '@/app/payment/utils/array';
import { Component, computed, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'report-table',
  template: `<mat-table class="mat-elevation-z8" [dataSource]="dataSource()">
    <ng-container matColumnDef="month">
      <mat-header-cell *matHeaderCellDef> Month</mat-header-cell>
      <mat-cell *matCellDef="let row"> {{ row.month }} </mat-cell>
      <mat-footer-cell class="font-medium" *matFooterCellDef>Total</mat-footer-cell>
    </ng-container>
    <ng-container matColumnDef="taxableSales">
      <mat-header-cell *matHeaderCellDef> Taxable Sales</mat-header-cell>
      <mat-cell *matCellDef="let row"> {{ row.taxableSales | currency }} </mat-cell>
      <mat-footer-cell class="font-medium" *matFooterCellDef>{{
        taxableSalesTotal() | currency
      }}</mat-footer-cell>
    </ng-container>
    <ng-container matColumnDef="nonTaxableSales">
      <mat-header-cell *matHeaderCellDef> Non Taxable Sales</mat-header-cell>
      <mat-cell *matCellDef="let row"> {{ row.nonTaxableSales | currency }} </mat-cell>
      <mat-footer-cell class="font-medium" *matFooterCellDef>{{
        nonTaxableSalesTotal() | currency
      }}</mat-footer-cell>
    </ng-container>
    <ng-container matColumnDef="netTaxableSales">
      <mat-header-cell *matHeaderCellDef> Net Taxable Sales</mat-header-cell>
      <mat-cell class="font-medium" *matCellDef="let row">
        {{ row.netTaxableSales | currency }}
      </mat-cell>
      <mat-footer-cell class="font-medium" *matFooterCellDef>{{
        netTaxableSalesTotal() | currency
      }}</mat-footer-cell>
    </ng-container>

    <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
    <mat-row *matRowDef="let row; columns: columns"></mat-row>
    <mat-footer-row *matFooterRowDef="columns"></mat-footer-row>
  </mat-table>`,
  imports: [MatTableModule, CurrencyPipe],
})
export class ReportTableComponent {
  paymentService = inject(PaymentService);

  reports = this.paymentService.reports;

  columns = ['month', 'taxableSales', 'nonTaxableSales', 'netTaxableSales'];
  dataSource = computed(() => new MatTableDataSource(this.reports()));
  taxableSalesTotal = computed(() => sumTotal(this.reports(), 'taxableSales'));
  nonTaxableSalesTotal = computed(() => sumTotal(this.reports(), 'nonTaxableSales'));
  netTaxableSalesTotal = computed(() => sumTotal(this.reports(), 'netTaxableSales'));
}
