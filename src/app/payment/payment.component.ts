import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PaymentTableComponent } from '@/app/payment/payment-table/payment-table.component';
import { ReportTableComponent } from '@/app/payment/report-table/report-table.component';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../shared/services/api/api.service';
import { BreakpointService } from '../shared/services/breakpoint/breakpoint.service';
import { UrlService } from '../shared/services/url/url.service';
import { PaymentService } from './payment.service';

@Component({
  selector: 'payment',
  standalone: true,
  template: `
    <div class="flex items-center mb-2 density-setting">
      <h1 class="text-lg flex-1">Payments</h1>

      <button mat-mini-fab color="primary" (click)="emailTaxReport()">
        <mat-icon>email</mat-icon>
      </button>
    </div>

    <payment-table></payment-table>

    <div class="flex mt-4 mb-2">
      <h1 class="flex-1 text-lg">Reports</h1>
    </div>

    <report-table></report-table>
  `,
  styles: [
    `
      :host {
        @apply px-4 py-4;
      }
    `,
  ],
  providers: [ApiService, UrlService, BreakpointService, PaymentService],
  imports: [MatButtonModule, MatIconModule, PaymentTableComponent, ReportTableComponent],
})
export class PaymentComponent implements OnInit {
  constructor(private readonly paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.reloadTaxReport().subscribe();
  }

  emailTaxReport() {
    this.paymentService.emailTaxReport().subscribe();
  }
}
