import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { ArrayService } from './array.service';
import { CurrencyService } from '../currency/currency.service';
import { Payment } from '../../../api/models/payment.model';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';

describe('ArrayService', () => {
  let s: SpectatorService<ArrayService>;
  let currencyService: Spy<CurrencyService>;

  const createService = createServiceFactory({
    service: ArrayService,
    providers: [provideAutoSpy(CurrencyService)],
  });

  beforeEach(() => (s = createService()));

  beforeEach(() => {
    currencyService = s.inject(CurrencyService) as any;
  });

  describe('calculatePriceTaxAndTotal()', () => {
    it('should call currencyService.calculatePrice(payment)', () => {
      const payment = {} as Payment;
      s.service.calculatePriceTaxAndTotal([payment]);

      expect(currencyService.calculatePrice).toHaveBeenCalledWith(payment);
    });

    it('should call currencyService.calculateTax(payment)', () => {
      const payment = {} as Payment;
      s.service.calculatePriceTaxAndTotal([payment]);

      expect(currencyService.calculateTax).toHaveBeenCalledWith(payment);
    });

    it('should call currencyService.calculateTax(payment)', () => {
      const payment = {} as Payment;
      s.service.calculatePriceTaxAndTotal([payment]);

      expect(currencyService.calculateTotal).toHaveBeenCalledWith(payment);
    });

    it('should append price property to payment object', () => {
      currencyService.calculatePrice.and.returnValue('100.00');

      const payment = {} as Payment;
      const [{ price }] = s.service.calculatePriceTaxAndTotal([payment]);

      expect(price).toEqual('100.00');
    });

    it('should append tax property to payment object', () => {
      currencyService.calculateTax.and.returnValue('8.13');

      const payment = {} as Payment;
      const [{ tax }] = s.service.calculatePriceTaxAndTotal([payment]);

      expect(tax).toEqual('8.13');
    });

    it('should append total property to payment object', () => {
      currencyService.calculateTotal.and.returnValue('108.13');

      const payment = {} as Payment;
      const [{ total }] = s.service.calculatePriceTaxAndTotal([payment]);

      expect(total).toEqual('108.13');
    });
  });

  describe('sortPaymentsByDate()', () => {
    it('should sort payments by date', () => {
      const payments = [
        { date: '02/01/1995' } as Payment,
        { date: '03/01/1995' } as Payment,
        { date: '01/01/1995' } as Payment,
      ];
      const expectedPayments = [
        { date: '01/01/1995' } as Payment,
        { date: '02/01/1995' } as Payment,
        { date: '03/01/1995' } as Payment,
      ];

      const sortedPayments = s.service.sortPaymentsByDate(payments);
      expect(sortedPayments).toEqual(expectedPayments);
    });
  });

  describe('sumTotal()', () => {
    it('should sum the property of given rows', () => {
      const payments = [
        { amount: '100.00' } as Payment,
        { amount: '200.00' } as Payment,
        { amount: '300.00' } as Payment,
      ];

      const sum = s.service.sumTotal(payments, 'amount');

      expect(sum).toEqual('600.00');
    });
  });
});
