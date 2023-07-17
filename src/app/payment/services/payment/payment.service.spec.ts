import { ObserverSpy } from '@hirez_io/observer-spy';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { of } from 'rxjs';
import { Payment, PaymentUpdateDto } from '../../../api/models/payment.model';
import { TaxReport } from '../../../api/models/tax-report.model';
import { ApiService } from '../../../api/services/api.service';
import { ArrayService } from '../array/array.service';
import { ReportService } from '../report/report.service';
import { UrlService } from '../url/url.service';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let s: SpectatorService<PaymentService>;
  let apiService: Spy<ApiService>;
  let urlService: Spy<UrlService>;
  let arrayService: Spy<ArrayService>;
  let reportService: Spy<ReportService>;

  let taxReportId: number;
  let payments: Payment[];

  const createService = createServiceFactory(PaymentService);

  beforeEach(() => {
    urlService = createSpyFromClass(UrlService);
    apiService = createSpyFromClass(ApiService);
    arrayService = createSpyFromClass(ArrayService);
    reportService = createSpyFromClass(ReportService);
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
        { provide: ArrayService, useValue: arrayService },
        { provide: ReportService, useValue: reportService },
      ],
    });
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

  describe('selectors', () => {
    describe('taxReportId$', () => {
      it('should emit tax report id', () => {
        const observerSpy = new ObserverSpy();
        s.service._taxReportId$.subscribe(observerSpy);

        urlService.getUrlParam.and.nextWith('2');
        urlService.getUrlParam.and.nextWith('3');

        expect(observerSpy.getValues()).toEqual([1, 2, 3]);
      });
    });

    describe('_payments', () => {
      it('should have payments', () => {
        expect(s.service._payments()).toEqual(payments);
      });
    });

    describe('_sortedPayments', () => {
      it('should call _sortPaymentsByDate(payments)', () => {
        const payments = [] as Payment[];
        s.service._payments.set(payments);
        s.service._sortedPayments();

        expect(arrayService.sortPaymentsByDate).toHaveBeenCalledWith(payments);
      });
    });

    describe('_mappedPayments', () => {
      it('should call arrayService.calculatePriceTaxAndTotal(payments)', () => {
        arrayService.sortPaymentsByDate.and.returnValue([]);
        arrayService.calculatePriceTaxAndTotal.and.returnValue([]);

        const payments = [] as Payment[];
        s.service._payments.set(payments);
        s.service._mappedPayments();

        expect(arrayService.calculatePriceTaxAndTotal).toHaveBeenCalledWith(payments);
      });
    });

    describe('_reports', () => {
      it('should call reportService.calculateReport(payments)', () => {
        arrayService.sortPaymentsByDate.and.returnValue([]);
        arrayService.calculatePriceTaxAndTotal.and.returnValue([]);

        const payments = [] as Payment[];
        s.service._payments.set(payments);
        s.service.reports();

        expect(reportService.calculateReport).toHaveBeenCalledWith(payments);
      });
    });
  });

  describe('effects', () => {
    describe('reloadTaxReport()', () => {
      it('should call apiService.getTaxReportById(id)', () => {
        apiService.getTaxReportById.calls.reset();
        apiService.getTaxReportById.and.nextWith({ payments } as TaxReport);

        s.service.reloadTaxReport().subscribe();

        expect(apiService.getTaxReportById).toHaveBeenCalledWith(taxReportId);
      });

      it('should set _payments', () => {
        apiService.getTaxReportById.calls.reset();
        apiService.getTaxReportById.and.nextWith({ payments } as TaxReport);

        s.service.reloadTaxReport();

        expect(s.service._payments()).toEqual(payments);
      });
    });

    describe('updatePayment()', () => {
      it('should call apiService.updateTaxReportPayment(id, paymentId, update)', () => {
        const taxReport = {} as TaxReport;
        apiService.updateTaxReportPayment.and.nextWith(taxReport);

        const paymentId = 1;
        const update: PaymentUpdateDto = {};
        s.service.updatePayment({ paymentId, update }).subscribe();

        expect(apiService.updateTaxReportPayment).toHaveBeenCalledWith(1, paymentId, update);
      });

      it('should call reloadTaxReport()', () => {
        spyOn(s.service, 'reloadTaxReport').and.returnValue(of());

        const taxReport = {} as TaxReport;
        apiService.updateTaxReportPayment.and.nextWith(taxReport);

        const paymentId = 1;
        const update: PaymentUpdateDto = {};
        s.service.updatePayment({ paymentId, update }).subscribe();

        expect(s.service.reloadTaxReport).toHaveBeenCalled();
      });
    });
  });
});
