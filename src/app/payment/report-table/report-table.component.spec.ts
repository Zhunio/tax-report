import { WritableSignal, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { CurrencyPipe } from '@/app/shared/pipes/currency/currency.pipe';
import { PaymentDto } from '@/app/shared/services/api/api.model';
import { calculatePriceTaxAndTotal } from '../payment.mapper';
import { Payment } from '../payment.model';
import { PaymentService } from '../payment.service';
import { ReportTableComponent } from './report-table.component';
import { ReportTablePage } from './report-table.page';

describe('ReportTableComponent', () => {
  let s: Spectator<ReportTableComponent>;
  let page: ReportTablePage;

  let payments: WritableSignal<Payment[]>;
  let isLoading: WritableSignal<boolean>;

  const createComponent = createComponentFactory({
    component: ReportTableComponent,
    imports: [MatTableModule, CurrencyPipe],
  });

  beforeEach(() => {
    payments = signal([]);
    isLoading = signal(false);
  });

  beforeEach(() => {
    s = createComponent({
      providers: [mockProvider(PaymentService, { payments, isLoading })],
    });
    page = new ReportTablePage(s);
  });

  it('should render columns', () => {
    const headerCells = page.getHeaderCells().map(({ textContent }) => textContent);
    expect(headerCells).toEqual([
      'Month',
      'Taxable Sales',
      'Non Taxable Sales',
      'Net Taxable Sales',
    ]);
  });

  it('should render empty table', () => {
    payments.set([]);

    s.detectChanges();

    page.expectToBeEmpty();
  });

  it('should show loading indicator', () => {
    isLoading.set(true);
    s.detectChanges();

    expect(page.getLoadingText()).toBeVisible();

    isLoading.set(false);
    s.detectChanges();
      
      expect(page.getLoadingText()).not.toBeVisible();
  })

  it('should render table with exempt payments', () => {
    const paymentDtos: PaymentDto[] = [
      {
        id: 1,
        type: 'Payment',
        date: '03/01/2020',
        number: '1',
        name: 'mathew',
        method: 'Check',
        amount: '1000',
        isExempt: true,
      },
      {
        id: 2,
        type: 'Payment',
        date: '04/01/2020',
        number: '2',
        name: 'john',
        method: 'Check',
        amount: '2000',
        isExempt: true,
      },
      {
        id: 3,
        type: 'Payment',
        date: '05/01/2020',
        number: '3',
        name: 'doe',
        method: 'Check',
        amount: '3000',
        isExempt: true,
      },
    ];
    payments.set(paymentDtos.map(calculatePriceTaxAndTotal));

    s.detectChanges();

    page.expectRowsToHaveReports([
      {
        month: 'March',
        taxableSales: '1,000.00',
        nonTaxableSales: '1,000.00',
        netTaxableSales: '0.00',
      },
      {
        month: 'April',
        taxableSales: '2,000.00',
        nonTaxableSales: '2,000.00',
        netTaxableSales: '0.00',
      },
      {
        month: 'May',
        taxableSales: '3,000.00',
        nonTaxableSales: '3,000.00',
        netTaxableSales: '0.00',
      },
    ]);
    page.expectFooter({
      taxableSalesTotal: '6,000.00',
      nonTaxableSalesTotal: '6,000.00',
      netTaxableSalesTotal: '0.00',
    });
  });

  it('should render table with non-exempt payments', () => {
    const paymentDtos: PaymentDto[] = [
      {
        id: 1,
        type: 'Payment',
        date: '03/01/2020',
        number: '1',
        name: 'mathew',
        method: 'Check',
        amount: '486.56',
        isExempt: false,
      },
      {
        id: 2,
        type: 'Payment',
        date: '04/01/2020',
        number: '2',
        name: 'john',
        method: 'Check',
        amount: '432.50',
        isExempt: false,
      },
      {
        id: 3,
        type: 'Payment',
        date: '05/01/2020',
        number: '3',
        name: 'doe',
        method: 'Check',
        amount: '210.84',
        isExempt: false,
      },
    ];
    payments.set(paymentDtos.map(calculatePriceTaxAndTotal));

    s.detectChanges();

    page.expectRowsToHaveReports([
      {
        month: 'March',
        taxableSales: '450.00',
        nonTaxableSales: '0.00',
        netTaxableSales: '450.00',
      },
      {
        month: 'April',
        taxableSales: '400.00',
        nonTaxableSales: '0.00',
        netTaxableSales: '400.00',
      },
      {
        month: 'May',
        taxableSales: '195.00',
        nonTaxableSales: '0.00',
        netTaxableSales: '195.00',
      },
    ]);
    page.expectFooter({
      taxableSalesTotal: '1,045.00',
      nonTaxableSalesTotal: '0.00',
      netTaxableSalesTotal: '1,045.00',
    });
  });

  it('should render table with exempt/non-exempt payments', () => {
    const paymentDtos: PaymentDto[] = [
      {
        id: 1,
        type: 'Payment',
        date: '03/01/2020',
        number: '1',
        name: 'mathew',
        method: 'Check',
        amount: '486.56',
        isExempt: false,
      },
      {
        id: 2,
        type: 'Payment',
        date: '04/01/2020',
        number: '3',
        name: 'john',
        method: 'Check',
        amount: '1000.00',
        isExempt: true,
      },
      {
        id: 3,
        type: 'Payment',
        date: '05/01/2020',
        number: '3',
        name: 'doe',
        method: 'Check',
        amount: '2000.00',
        isExempt: true,
      },
    ];
    payments.set(paymentDtos.map(calculatePriceTaxAndTotal));

    s.detectChanges();

    page.expectRowsToHaveReports([
      {
        month: 'March',
        taxableSales: '450.00',
        nonTaxableSales: '0.00',
        netTaxableSales: '450.00',
      },
      {
        month: 'April',
        taxableSales: '1,000.00',
        nonTaxableSales: '1,000.00',
        netTaxableSales: '0.00',
      },
      {
        month: 'May',
        taxableSales: '2,000.00',
        nonTaxableSales: '2,000.00',
        netTaxableSales: '0.00',
      },
    ]);
    page.expectFooter({
      taxableSalesTotal: '3,450.00',
      nonTaxableSalesTotal: '3,000.00',
      netTaxableSalesTotal: '450.00',
    });
  });

  it('should sum payments by month with exempt payments', () => {
    const paymentDtos: PaymentDto[] = [
      {
        id: 1,
        type: 'Payment',
        date: '03/01/2020',
        number: '1',
        name: 'mathew',
        method: 'Check',
        amount: '486.56',
        isExempt: false,
      },
      {
        id: 2,
        type: 'Payment',
        date: '03/01/2020',
        number: '2',
        name: 'john',
        method: 'Check',
        amount: '432.50',
        isExempt: false,
      },
    ];
    payments.set(paymentDtos.map(calculatePriceTaxAndTotal));

    s.detectChanges();

    page.expectRowsToHaveReports([
      {
        month: 'March',
        taxableSales: '850.00',
        nonTaxableSales: '0.00',
        netTaxableSales: '850.00',
      },
    ]);
    page.expectFooter({
      taxableSalesTotal: '850.00',
      nonTaxableSalesTotal: '0.00',
      netTaxableSalesTotal: '850.00',
    });
  });

  it('should sum payments by month with exempt/non-exempt payments', () => {
    const paymentDtos: PaymentDto[] = [
      {
        id: 1,
        type: 'Payment',
        date: '03/01/2020',
        number: '1',
        name: 'mathew',
        method: 'Check',
        amount: '486.56',
        isExempt: false,
      },
      {
        id: 2,
        type: 'Payment',
        date: '03/02/2020',
        number: '2',
        name: 'john',
        method: 'Check',
        amount: '432.50',
        isExempt: false,
      },
      {
        id: 3,
        type: 'Payment',
        date: '03/03/2020',
        number: '3',
        name: 'wick',
        method: 'Check',
        amount: '1000.00',
        isExempt: true,
      },
    ];
    payments.set(paymentDtos.map(calculatePriceTaxAndTotal));

    s.detectChanges();

    page.expectRowsToHaveReports([
      {
        month: 'March',
        taxableSales: '1,850.00',
        nonTaxableSales: '1,000.00',
        netTaxableSales: '850.00',
      },
    ]);
    page.expectFooter({
      taxableSalesTotal: '1,850.00',
      nonTaxableSalesTotal: '1,000.00',
      netTaxableSalesTotal: '850.00',
    });
  });
});
