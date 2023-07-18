import { CurrencyPipe } from '@angular/common';
import { WritableSignal, signal } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  Spectator,
  SpyObject,
  byRole,
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator';
import { of } from 'rxjs';
import { Payment } from '../../../api/models/payment.model';
import { getMockedPayments } from '../../mocks/payment.mock';
import { PaymentService } from '../../services/payment/payment.service';
import { PaymentTableComponent } from './payment-table.component';
import { BreakpointService } from '../../../services/breakpoint.service';

describe('PaymentTableComponent', () => {
  let s: Spectator<PaymentTableComponent>;
  let paymentService: SpyObject<PaymentService>;

  let mockPayments: WritableSignal<Payment[]>;

  let mockIsXSmall: WritableSignal<boolean>;
  let mockIsSmall: WritableSignal<boolean>;
  let mockIsMedium: WritableSignal<boolean>;
  let mockIsLarge: WritableSignal<boolean>;
  let mockIsXLarge: WritableSignal<boolean>;

  const createComponent = createComponentFactory({
    component: PaymentTableComponent,
    providers: [CurrencyPipe],
  });

  beforeEach(() => {
    mockPayments = signal([]);
    mockIsXSmall = signal(false);
    mockIsSmall = signal(false);
    mockIsMedium = signal(false);
    mockIsLarge = signal(false);
    mockIsXLarge = signal(false);
  });

  beforeEach(() => {
    s = createComponent({
      providers: [
        mockProvider(PaymentService, {
          payments: mockPayments,
        }),
        mockProvider(BreakpointService, {
          isXSmall: mockIsXSmall,
          isSmall: mockIsSmall,
          isMedium: mockIsMedium,
          isLarge: mockIsLarge,
          isXLarge: mockIsXLarge,
        }),
      ],
    });
  });

  beforeEach(() => {
    paymentService = s.inject(PaymentService) as any;
  });

  describe('on create', () => {
    it('should create', () => {
      expect(s).toBeTruthy();
    });
  });

  describe('table', () => {
    describe('columns', () => {
      it('should render the following columns when breakpointService.isXSmall() is true', () => {
        mockIsXSmall.set(true);

        expect(s.component.columns()).toEqual(['name', 'price', 'tax', 'total', 'isExempt']);
      });

      it('should render the following columns when breakpointService.isSmall() is true', () => {
        mockIsSmall.set(true);

        expect(s.component.columns()).toEqual([
          'date',
          'name',
          'price',
          'tax',
          'total',
          'isExempt',
        ]);
      });

      it('should render the following columns when breakpointService.isMedium() is true', () => {
        mockIsMedium.set(true);

        expect(s.component.columns()).toEqual([
          'type',
          'date',
          'number',
          'method',
          'name',
          'price',
          'tax',
          'total',
          'isExempt',
        ]);
      });

      it('should render the following columns when breakpointService.isLarge() is true', () => {
        mockIsLarge.set(true);

        expect(s.component.columns()).toEqual([
          'type',
          'date',
          'number',
          'method',
          'name',
          'price',
          'tax',
          'total',
          'isExempt',
        ]);
      });

      it('should render the following columns when none of the breakpoints are true', () => {
        expect(s.component.columns()).toEqual([
          'type',
          'date',
          'number',
          'method',
          'name',
          'price',
          'tax',
          'total',
          'isExempt',
        ]);
      });
    });

    describe('when rows are empty', () => {
      it('should show `No rows to show` empty row', () => {
        mockPayments.set([]);

        s.detectChanges();

        const row = s.query(byText('No rows to show'));
        expect(row).not.toBeNull();
      });
    });

    describe('when there is rows', () => {
      it('should not render `No rows to show` empty row', () => {
        mockPayments.set(getMockedPayments());

        s.detectChanges();

        const row = s.query('.mat-mdc-no-data-row');
        expect(row).toBeNull();
      });

      it('should render rows', () => {
        mockPayments.set(getMockedPayments());

        s.detectChanges();

        const rows = s.queryAll('mat-row')!;
        for (let index = 0; index < rows.length; index++) {
          const row = rows[index];

          expect(row).toHaveText(mockPayments()[index].type);
          expect(row).toHaveText(mockPayments()[index].date);
          expect(row).toHaveText(mockPayments()[index].number);
          expect(row).toHaveText(mockPayments()[index].method);
          expect(row).toHaveText(mockPayments()[index].name);
          expect(row).toHaveText(mockPayments()[index].price!.toString());
          expect(row).toHaveText(mockPayments()[index].tax!.toString());
          expect(row).toHaveText(mockPayments()[index].total!.toString());
          expect(row).toHaveDescendant('mat-checkbox');
        }
      });
    });
  });

  describe('dataSource', () => {
    it('should return data source', () => {
      const payments = getMockedPayments();
      mockPayments.set(payments);

      expect(s.component.dataSource().data).toEqual(payments);
    });
  });

  describe('onCheckboxChange(matCheckboxChange, payment)', () => {
    it('should be called since Is Exempt? checkbox is clicked', () => {
      spyOn(s.component, 'onCheckboxChange');

      const [payment] = getMockedPayments();
      mockPayments.set([payment]);

      s.detectChanges();

      const checkbox = s.query(byRole('checkbox'))!;
      s.click(checkbox);

      expect(s.component.onCheckboxChange).toHaveBeenCalledWith(
        jasmine.any(MatCheckboxChange),
        payment
      );
    });

    it('should call paymentService.updatePayment({ paymentId, update }', () => {
      const [payment] = getMockedPayments();
      paymentService.updatePayment.and.returnValue(of());
      mockPayments.set([payment]);

      s.component.onCheckboxChange({ checked: true } as MatCheckboxChange, payment);

      expect(paymentService.updatePayment).toHaveBeenCalledWith({
        paymentId: payment.id,
        update: { isExempt: true },
      });
    });
  });
});
