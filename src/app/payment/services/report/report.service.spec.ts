import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { ReportService } from './report.service';
import { Payment } from '../../../api/models/payment.model';

describe('ReportService', () => {
  let s: SpectatorService<ReportService>;

  const createService = createServiceFactory({
    service: ReportService,
  });

  beforeEach(() => (s = createService()));

  describe('calculateReport()', () => {
    it('should calculate report when there is only exempt payments', () => {
      const payments = [
        {
          date: '01/01/1995',
          price: '100.00',
          tax: '0.00',
          total: '100.00',
          isExempt: true,
        } as Payment,
        {
          date: '01/02/1995',
          price: '100.00',
          tax: '0.00',
          total: '100.00',
          isExempt: true,
        } as Payment,
      ];

      expect(s.service.calculateReport(payments)).toEqual([
        {
          month: 'January',
          taxableSales: '200.00',
          nonTaxableSales: '200.00',
          netTaxableSales: '0.00',
        },
      ]);
    });

    it('should calculate report when there is not exempt payments', () => {
      const payments = [
        {
          date: '01/01/1995',
          price: '100.00',
          tax: '8.13', // at 8.125%
          total: '108.13',
          isExempt: false,
        } as Payment,
        {
          date: '01/02/1995',
          price: '100.00',
          tax: '8.13', // at 8.125%
          total: '108.13',
          isExempt: false,
        } as Payment,
      ];

      expect(s.service.calculateReport(payments)).toEqual([
        {
          month: 'January',
          taxableSales: '200.00',
          nonTaxableSales: '0.00',
          netTaxableSales: '200.00',
        },
      ]);
    });

    it('should calculate report when there is exempt and non-exempt payments', () => {
      const payments = [
        {
          date: '01/01/1995',
          price: '500.00',
          tax: '0.00',
          total: '500.00',
          isExempt: true,
        } as Payment,
        {
          date: '01/02/1995',
          price: '100.00',
          tax: '8.13', // at 8.125%
          total: '108.13',
          isExempt: false,
        } as Payment,
      ];

      expect(s.service.calculateReport(payments)).toEqual([
        {
          month: 'January',
          taxableSales: '600.00',
          nonTaxableSales: '500.00',
          netTaxableSales: '100.00',
        },
      ]);
    });
  });
});
