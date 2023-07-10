import { UrlService } from '@/app/payment/services/url.service';
import { PaymentTableComponent } from '@/app/payment/components/payment-table';
import { PaymentService } from '@/app/payment/services/payment';
import { ReportTableComponent } from '@/app/payment/components/report-table';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'payment-shell',
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
        /* display: grid; */
        /* grid-template-rows: auto auto auto auto; */
        @apply px-4 py-4;
      }
    `,
  ],
  providers: [UrlService, PaymentService],
  imports: [MatIconModule, PaymentTableComponent, ReportTableComponent],
})
export class PaymentShellComponent {}
