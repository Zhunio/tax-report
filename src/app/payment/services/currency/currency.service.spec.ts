import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Payment } from '../../../api/models/payment.model';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let s: SpectatorService<CurrencyService>;

  const createService = createServiceFactory(CurrencyService);

  beforeEach(() => (s = createService()));

  describe('calculatePrice()', () => {
    it('should have price set to amount when payment is exempt', () => {
      const payment = { isExempt: true, amount: '5000.00' } as Payment;

      const price = s.service.calculatePrice(payment);
      expect(price).toBe('5000.00');
    });

    it('should calculate price when payment is not exempt by dividing amount over 1.08125', () => {
      const payment = { isExempt: false, amount: '108.13' } as Payment;

      const price = s.service.calculatePrice(payment);
      expect(price).toBe('100.00');
    });
  });

  describe('calculateTax()', () => {
    it('should calculate tax at %0.00 when payment is exempt', () => {
      const payment = { isExempt: true, amount: '5000.00' } as Payment;

      const tax = s.service.calculateTax(payment);
      expect(tax).toBe('0.00');
    });

    it('should calculate tax at %8.125 when payment is not exempt', () => {
      const payment = { isExempt: false, amount: '108.13' } as Payment;

      const tax = s.service.calculateTax(payment);
      expect(tax).toEqual('8.13');
    });
  });

  describe('calculateTotal()', () => {
    it('should return amount regardless of whether payment is exempt or not', () => {
      const payment = { isExempt: true, amount: '5000.00' } as Payment;
      const total = s.service.calculateTotal(payment);

      expect(total).toEqual('5000.00');
    });
  });
});
