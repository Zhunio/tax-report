import { Payment, Report } from '@/app/models/payment.model';
import {
  calculatePriceTaxAndTotal,
  calculateReport,
  sortPaymentsByDate,
} from '@/app/pages/payment/payment.util';
import { TaxReportService } from '@/app/services';
import { Component, OnInit } from '@angular/core';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute } from '@angular/router';
import * as currency from 'currency.js';
import { parse } from 'date-fns';
import { map, switchMap, take, tap } from 'rxjs';

function parseDate(date: string) {
  return parse(date, 'MM/dd/yyyy', new Date());
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  constructor(private route: ActivatedRoute, private taxReportService: TaxReportService) {}

  taxReportId$ = this.route.paramMap.pipe(
    map((params) => parseInt(params.get('taxReportId') as string, 10))
  );

  paymentDataSource = new MatTableDataSource<Payment>();
  reportDataSource = new MatTableDataSource<Report>();

  paymentColumns = [
    'type',
    'date',
    'number',
    'method',
    'name',
    'price',
    'tax',
    'total',
    'isExempt',
  ];
  reportColumns = ['month', 'taxableSales', 'nonTaxableSales', 'netTaxableSales'];

  ngOnInit() {
    this.reloadTaxReport().subscribe();
  }

  onCheckboxChange({ checked }: MatCheckboxChange, payment: Payment) {
    this.taxReportId$
      .pipe(
        take(1),
        switchMap((taxReportId) =>
          this.taxReportService.updateTaxReportPayment(taxReportId, payment.id, {
            isExempt: checked,
          })
        ),
        switchMap(() => this.reloadTaxReport())
      )
      .subscribe();
  }

  reloadTaxReport() {
    return this.taxReportId$.pipe(
      switchMap((taxReportId) => this.taxReportService.getTaxReportById(taxReportId)),
      tap(({ payments }) => {
        payments = calculatePriceTaxAndTotal(payments);
        payments = sortPaymentsByDate(payments);

        this.paymentDataSource.data = payments;
        this.reportDataSource.data = calculateReport(payments);
      })
    );
  }

  getTotal(key: keyof Report) {
    return this.reportDataSource.data
      .map((report) => report[key])
      .reduce((acc, value) => currency(acc).add(value).format(), '0');
  }
}
