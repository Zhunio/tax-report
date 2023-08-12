import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PaymentTableComponent } from '@/app/payment/payment-table/payment-table.component';
import { ReportTableComponent } from '@/app/payment/report-table/report-table.component';
import { ApiService } from '../shared/services/api/api.service';
import { BreakpointService } from '../shared/services/breakpoint/breakpoint.service';
import { UrlService } from '../shared/services/url/url.service';
import { PaymentService } from './payment.service';

@Component({
  selector: 'payment',
  standalone: true,
  template: `
    <div class="flex justify-end mb-2">
      <h1 class="flex-1 text-lg">Payments</h1>
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
  imports: [MatIconModule, PaymentTableComponent, ReportTableComponent],
})
export class PaymentComponent implements OnInit {
  constructor(private readonly paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.reloadTaxReport().subscribe();
  }
}
