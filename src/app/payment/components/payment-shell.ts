import { UrlService } from '@/app/payment/utils/url';
import { PaymentTableComponent } from '@/app/payment/components/payment-table';
import { PaymentService } from '@/app/payment/services/payment';
import { ReportTableComponent } from '@/app/payment/components/report-table';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'payment-shell',
  standalone: true,
  template: `
    <div class="flex justify-end">
      <h1 class="flex-1 text-lg">Payments</h1>
      <button mat-icon-button color="primary">
        <mat-icon class="text-green-500">add_circle</mat-icon>
      </button>
    </div>

    <payment-table class="overflow-auto shadow-md"></payment-table>

    <div class="flex">
      <h1 class="flex-1 text-lg">Reports</h1>
    </div>

    <report-table class="overflow-auto shadow-md"></report-table>
  `,
  styles: [
    `
      :host {
        overflow: auto;
        display: grid;
        grid-template-rows: auto 1fr auto auto;
        @apply px-4 py-4 gap-2;
      }
    `,
  ],
  providers: [UrlService, PaymentService],
  imports: [MatIconModule, PaymentTableComponent, ReportTableComponent],
})
export class PaymentShellComponent {}
