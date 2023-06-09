import { UrlService } from '@/app/payment/url';
import { PaymentTableComponent } from '@/app/payment/payment-table/payment-table.component';
import { PaymentService } from '@/app/payment/payment';
import { ReportTableComponent } from '@/app/payment/report-table/report-table.component';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment',
  standalone: true,
  template: `
    <div class="mt-3 mx-4">
      <div class="flex items-center">
        <h1 class="text-lg flex-grow">Payments</h1>

        <button mat-icon-button color="primary">
          <mat-icon class="text-green-500">add_circle</mat-icon>
        </button>
      </div>
    </div>

    <payment-table></payment-table>

    <div class="mt-3 mx-4">
      <div class="flex items-center">
        <h1 class="text-lg flex-grow">Reports</h1>
      </div>
    </div>

    <report-table></report-table>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: grid;
        grid-template-rows: auto 3fr auto 1fr;
      }
    `,
  ],
  providers: [UrlService, PaymentService],
  imports: [MatIconModule, PaymentTableComponent, ReportTableComponent],
})
export class PaymentShellComponent {}
