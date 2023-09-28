import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CommonModule } from '@angular/common';
import { WritableSignal, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Spectator, SpyObject, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { Observable } from 'rxjs';

import { PaymentDto } from '@/app/shared/services/api/api.model';
import { BreakpointService } from '@/app/shared/services/breakpoint/breakpoint.service';
import { calculatePriceTaxAndTotal } from '../payment.mapper';
import { Payment } from '../payment.model';
import { PaymentService } from '../payment.service';
import { PaymentTableComponent } from './payment-table.component';
import { PaymentTablePage } from './payment-table.page';

describe('PaymentTableComponent', () => {
  let s: Spectator<PaymentTableComponent>;
  let page: PaymentTablePage;

  let paymentService: SpyObject<PaymentService>;
  let payments: WritableSignal<Payment[]>;
  let isLoading: WritableSignal<boolean>;

  let isXSmall: WritableSignal<boolean>;
  let isSmall: WritableSignal<boolean>;
  let isMedium: WritableSignal<boolean>;
  let isLarge: WritableSignal<boolean>;

  let loader: HarnessLoader;

  const createComponent = createComponentFactory({
    component: PaymentTableComponent,
    imports: [CommonModule, MatTableModule, MatCheckboxModule, MatTooltipModule],
  });

  beforeEach(() => {
    payments = signal([]);
    isLoading = signal(false)

    isXSmall = signal(false);
    isSmall = signal(false);
    isMedium = signal(false);
    isLarge = signal(false);
  });

  beforeEach(() => {
    s = createComponent({
      providers: [
        mockProvider(PaymentService, { payments, isLoading }),
        mockProvider(BreakpointService, { isXSmall, isSmall, isMedium, isLarge }),
      ],
    });

    loader = TestbedHarnessEnvironment.loader(s.fixture);
    page = new PaymentTablePage(s);
  });

  beforeEach(() => {
    paymentService = s.inject(PaymentService) as any;
  });

  describe('with changing viewport size', () => {
    it('should render columns when viewport size is extra small', () => {
      isXSmall.set(true);
      s.detectChanges();

      const headerCells = page.getHeaderCells().map(({ textContent }) => textContent);
      expect(headerCells).toEqual(['Customer Name', 'Price', 'Tax', 'Total', 'Is Exempt?']);
    });

    it('should render columns when viewport size is small', () => {
      isSmall.set(true);
      s.detectChanges();

      const headerCells = page.getHeaderCells().map(({ textContent }) => textContent);
      expect(headerCells).toEqual(['Date', 'Customer Name', 'Price', 'Tax', 'Total', 'Is Exempt?']);
    });

    it('should render columns when viewport size is medium', () => {
      isMedium.set(true);
      s.detectChanges();

      const headerCells = page.getHeaderCells().map(({ textContent }) => textContent);
      expect(headerCells).toEqual([
        'Type',
        'Date',
        'Number',
        'Method',
        'Customer Name',
        'Price',
        'Tax',
        'Total',
        'Is Exempt?',
      ]);
    });

    it('should render columns when viewport size is large', () => {
      isMedium.set(true);
      s.detectChanges();

      const headerCells = page.getHeaderCells().map(({ textContent }) => textContent);
      expect(headerCells).toEqual([
        'Type',
        'Date',
        'Number',
        'Method',
        'Customer Name',
        'Price',
        'Tax',
        'Total',
        'Is Exempt?',
      ]);
    });

    it('should render columns when viewport size is none', () => {
      const headerCells = page.getHeaderCells().map(({ textContent }) => textContent);
      expect(headerCells).toEqual([
        'Type',
        'Date',
        'Number',
        'Method',
        'Customer Name',
        'Price',
        'Tax',
        'Total',
        'Is Exempt?',
      ]);
    });
  });

  it('should render empty table', () => {
    payments.set([]);

    page.expectToBeEmpty();
  });

  it('should show loading indicator', () => {
    isLoading.set(true);
    s.detectChanges();

    expect(page.getLoadingProgressBar()).toBeVisible();
    expect(page.getLoadingText()).toBeVisible();

    isLoading.set(false);
    s.detectChanges();
    
    expect(page.getLoadingProgressBar()).not.toBeVisible();
    expect(page.getLoadingText()).not.toBeVisible();
  })

  it('should render table with rows', () => {
    const paymentDto: PaymentDto = {
      id: 1,
      type: 'Payment',
      date: '03/25/2020',
      number: '661661455',
      name: 'Scott Hecht',
      method: 'Check',
      amount: '486.56',
      isExempt: false,
    };
    const payment = calculatePriceTaxAndTotal(paymentDto);
    payments.set([payment]);

    s.detectChanges();

    page.expectRowToHavePayment(0, payment);
  });

  it('should render exempt payment', () => {
    const paymentDto: PaymentDto = {
      id: 1,
      type: 'Payment',
      date: '03/25/2020',
      number: '661661455',
      name: 'Scott Hecht',
      method: 'Check',
      amount: '400.00',
      isExempt: true,
    };
    const payment = calculatePriceTaxAndTotal(paymentDto);
    payments.set([payment]);

    s.detectChanges();

    page.expectRowToHavePayment(0, payment);
  });
  it('should render non-exempt payment', () => {
    const paymentDto: PaymentDto = {
      id: 1,
      type: 'Payment',
      date: '03/25/2020',
      number: '661661455',
      name: 'Scott Hecht',
      method: 'Check',
      amount: '486.56',
      isExempt: false,
    };
    const payment = calculatePriceTaxAndTotal(paymentDto);
    payments.set([payment]);

    s.detectChanges();

    page.expectRowToHavePayment(0, payment);
  });

  it('should fix row that should be exempt', async () => {
    let paymentDto: PaymentDto = {
      id: 1,
      type: 'Payment',
      date: '03/25/2020',
      number: '661661455',
      name: 'Scott Hecht',
      method: 'Check',
      amount: '500.00',
      isExempt: false,
    };
    payments.set([calculatePriceTaxAndTotal(paymentDto)]);
    s.detectChanges();

    // the price, tax, and total for this payment should be wrong
    // since this payment should have been tax exempt
    page.expectRowToHavePayment(0, {
      ...paymentDto,
      isExempt: false,
      price: '462.43',
      tax: '37.57',
      total: '500.00',
    });

    // Simulate payment being set to tax exempt
    paymentService.updatePayment.and.returnValue(
      new Observable((observer) => {
        paymentDto = { ...paymentDto, isExempt: true };
        payments.set([calculatePriceTaxAndTotal(paymentDto)]);

        observer.complete();
      })
    );

    // fix payment that had wrong price, tax, and total by
    // making the payment tax exempt
    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.check();

    page.expectRowToHavePayment(0, {
      ...paymentDto,
      isExempt: true,
      price: '500.00',
      tax: '0.00',
      total: '500.00',
    });
  });
});
