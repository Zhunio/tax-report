import { PaymentTableComponent } from '@/app/payment/components/payment-table/payment-table.component';
import { ReportTableComponent } from '@/app/payment/components/report-table/report-table.component';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PaymentService } from '../../services/payment/payment.service';
import { ReportService } from '../../services/report/report.service';
import { UrlService } from '../../services/url/url.service';

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
        @apply px-4 py-4;
      }
    `,
  ],
  providers: [PaymentService, ReportService, UrlService],
  imports: [MatIconModule, PaymentTableComponent, ReportTableComponent],
})
export class PaymentShellComponent {}
