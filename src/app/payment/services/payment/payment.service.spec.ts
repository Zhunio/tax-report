import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';
import { Payment } from '../../../api/models/payment.model';
import { TaxReport } from '../../../api/models/tax-report.model';
import { ApiService } from '../../../api/services/api.service';
import { ReportService } from '../report/report.service';
import { UrlService } from '../url/url.service';
import { PaymentService } from './payment.service';
import { ObserverSpy } from '@hirez_io/observer-spy';
import { Subject } from 'rxjs';
import { url } from 'inspector';

describe('PaymentService', () => {
  let s: SpectatorService<PaymentService>;
  let apiService: Spy<ApiService>;
  let urlService: Spy<UrlService>;
  let reportService: Spy<ReportService>;

  let taxReportId: number;
  let payments: Payment[];

  // let urlSubject: Subject<string | null>;

  const createService = createServiceFactory(PaymentService);

  beforeEach(() => {
    urlService = createSpyFromClass(UrlService);
    apiService = createSpyFromClass(ApiService);
  });

  beforeEach(() => {
    taxReportId = 1;
    payments = [{ id: 1 } as Payment];
  });

  beforeEach(() => {
    urlService.getUrlParam.and.nextWith(taxReportId.toString());
    apiService.getTaxReportById.and.nextWith({ payments } as TaxReport);
  });

  beforeEach(() => {
    s = createService({
      providers: [
        { provide: UrlService, useValue: urlService },
        { provide: ApiService, useValue: apiService },
        provideAutoSpy(ReportService),
      ],
    });
  });

  beforeEach(() => {
    reportService = s.inject(ReportService) as any;
    apiService = s.inject(ApiService) as any;
  });

  describe('on create', () => {
    it('should create', () => {
      expect(s.service).toBeTruthy();
    });

    describe('reloadTaxReport()', () => {
      it('should call urlService.getUrlParam()', () => {
        expect(urlService.getUrlParam).toHaveBeenCalledWith('taxReportId');
      });

      it('should call apiService.getTaxReportById()', () => {
        expect(apiService.getTaxReportById).toHaveBeenCalled();
      });

      it('should update payments', () => {
        expect(s.service._payments()).toEqual(payments);
      });
    });
  });

  // describe('selectors', () => {
    // describe('taxReportId$', () => {
    //   it('should ignore falsy values from route.paramMap()', () => {
    //     const observerSpy = new ObserverSpy();
    //     s.service._taxReportId.subscribe(observerSpy);

    //     urlService.getUrlParam.and.nextWithValues([{ value: '' }, { value: null }]);

    //     expect(observerSpy.getValues()).toEqual([taxReportId]);
    //   });

    //   it('should emit valid tax report ids', () => {
    //     const observerSpy = new ObserverSpy();
    //     s.service._taxReportId.subscribe(observerSpy);

    //     // urlService.getUrlParam.and.nextWith('2');
    //     // urlService.getUrlParam.and.nextWith('3');
    //     urlService.getUrlParam.and.nextWithValues([{ value: '2' }, { value: '3', delay: 2000 }]);

    //     expect(observerSpy.getValues()).toEqual([taxReportId, 2]);
    //   });
    // });

    // describe('payments', () => {
    //   it('should call sortPaymentsByDate(payments)', () => {
    //     spyOn(s.service as any, 'sortPaymentsByDate').and.returnValue([]);
    //     spyOn(s.service as any, 'mapPayments').and.returnValue([]);

    //     s.service.payments();

    //     const payments = [] as Payment[];
    //     s.service.patchState({ payments });

    //     expect(s.service['sortPaymentsByDate']).toHaveBeenCalledWith(payments);
    //   });

    //   it('should call mapPayments(payments)', () => {
    //     spyOn(s.service as any, 'sortPaymentsByDate').and.returnValue([]);
    //     spyOn(s.service as any, 'mapPayments').and.returnValue([]);

    //     s.service.payments();

    //     const payments = [] as Payment[];
    //     s.service.patchState({ payments });

    //     expect(s.service['mapPayments']).toHaveBeenCalled();
    //   });
    // });

    // describe('reports', () => {
    //   it('should call reportService.calculateReport(payments)', () => {
    //     s.service.reports();

    //     const payments = [] as Payment[];
    //     s.service.patchState({ payments });

    //     expect(reportService.calculateReport).toHaveBeenCalledWith(payments);
    //   });
    // });
  });

  // describe('effects', () => {
  //   describe('reloadTaxReport()', () => {
  //     let payments: Payment[];

  //     beforeEach(() => {
  //       urlSubject.next('1');
  //       apiService.getTaxReportById.and.nextWith({ payments } as TaxReport);
  //     });

  //     it('should call apiService.getTaxReportById(id)', () => {
  //       s.service.reloadTaxReport();

  //       expect(apiService.getTaxReportById).toHaveBeenCalledWith(1);
  //     });

  //     it('should patchState({ payments })', () => {
  //       spyOn(s.service, 'patchState');

  //       s.service.reloadTaxReport();

  //       expect(s.service.patchState).toHaveBeenCalledWith({ payments });
  //     });
  //   });

  //   describe('updatePayment()', () => {
  //     beforeEach(() => {
  //       spyOn(s.service, 'reloadTaxReport');
  //       urlSubject.next('1');
  //       apiService.updateTaxReportPayment.and.nextWith({} as Payment);
  //     });

  //     it('should call apiService.updateTaxReportPayment(id, paymentId, update)', () => {
  //       const paymentId = 1;
  //       const update: PaymentUpdateDto = {};
  //       s.service.updatePayment({ paymentId, update });

  //       expect(apiService.updateTaxReportPayment).toHaveBeenCalledWith(1, paymentId, update);
  //     });

  //     it('should call reloadTaxReport()', () => {
  //       const paymentId = 1;
  //       const update: PaymentUpdateDto = {};
  //       s.service.updatePayment({ paymentId, update });

  //       expect(s.service.reloadTaxReport).toHaveBeenCalled();
  //     });
  //   });
  // });
});
