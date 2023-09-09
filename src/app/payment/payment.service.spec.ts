import { ObserverSpy } from '@hirez_io/observer-spy';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of } from 'rxjs';

import { PaymentDto, TaxReportDto } from '../shared/services/api/api.model';
import { ApiService } from '../shared/services/api/api.service';
import { UrlService } from '../shared/services/url/url.service';
import { calculatePriceTaxAndTotal } from './payment.mapper';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let apiServiceSpy: Spy<ApiService>;
  let urlServiceSpy: Spy<UrlService>;

  beforeEach(() => {
    apiServiceSpy = createSpyFromClass(ApiService);
    urlServiceSpy = createSpyFromClass(UrlService);
    urlServiceSpy.getUrlParam.and.nextWith('1');

    service = new PaymentService(apiServiceSpy, urlServiceSpy);
  });

  it('should get latest tax report ids from router url', () => {
    const observerSpy = new ObserverSpy();
    service._taxReportId$.subscribe(observerSpy);

    urlServiceSpy.getUrlParam.and.nextWith('2');
    urlServiceSpy.getUrlParam.and.nextWith('3');

    expect(observerSpy.getValues()).toEqual([1, 2, 3]);
  });

  it('should reload empty payments', () => {
    apiServiceSpy.getTaxReportById.and.nextWith({ payments: [] as PaymentDto[] } as TaxReportDto);
    service.reloadTaxReport().subscribe();

    expect(service.payments()).toEqual([]);
  });

  it('should reload non-empty payments', () => {
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

    apiServiceSpy.getTaxReportById.and.nextWith({ payments: [paymentDto] } as TaxReportDto);
    service.reloadTaxReport().subscribe();

    const payments = [calculatePriceTaxAndTotal(paymentDto)];
    expect(service.payments()).toEqual(payments);
  });

  it('should update payment', () => {
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

    spyOn(service, 'reloadTaxReport').and.returnValue(of());
    apiServiceSpy.updatePayment.and.nextWith();
    service.updatePayment({ paymentId: paymentDto.id, update: { isExempt: true } }).subscribe();

    expect(apiServiceSpy.updatePayment).toHaveBeenCalledWith(1, paymentDto.id, { isExempt: true });
    expect(service.reloadTaxReport).toHaveBeenCalled();
  });
});
