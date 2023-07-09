import { HttpClient } from '@angular/common/http';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { environment } from '../../../environments/environment';
import { getMockTaxReports } from '../../tax-report/mocks/tax-report.mocks';
import { PaymentUpdateDto } from '../models/payment.model';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let s: SpectatorService<ApiService>;
  let service: ApiService;
  let mockHttp: Spy<HttpClient>;

  const createService = createServiceFactory({
    service: ApiService,
    providers: [provideAutoSpy(HttpClient)],
  });

  beforeEach(() => (s = createService()));

  beforeEach(() => {
    service = s.inject(ApiService);
    mockHttp = s.inject(HttpClient) as any;
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  describe('getTaxReportById()', () => {
    it('should make `GET /tax-report/:id` request', () => {
      const [taxReport] = getMockTaxReports();
      mockHttp.get.and.nextWith(taxReport);

      service.getTaxReportById(taxReport.id).subscribe();

      expect(mockHttp.get).toHaveBeenCalledWith(
        `${environment.baseUrl}/tax-report/${taxReport.id}`
      );
    });
  });

  describe('getTaxReports()', () => {
    it('should make `GET /tax-report` request', () => {
      const taxReports = getMockTaxReports();
      mockHttp.get.and.nextWith(taxReports);

      service.getTaxReports().subscribe();

      expect(mockHttp.get).toHaveBeenCalledWith(`${environment.baseUrl}/tax-report`);
    });
  });

  describe('createTaxReport()', () => {
    it('should make `POST /tax-report` request', () => {
      const [taxReport] = getMockTaxReports();
      mockHttp.post.and.nextWith(taxReport);

      service
        .createTaxReport({ fiscalQuarter: 1, fiscalYear: 1995, uploadedFile: {} as File })
        .subscribe();

      expect(mockHttp.post).toHaveBeenCalledWith(
        `${environment.baseUrl}/tax-report`,
        jasmine.any(FormData)
      );
    });
  });

  describe('updateTaxReportPayment()', () => {
    it('should make `PATCH /tax-report/:taxReportId/payment/:paymentId` request', () => {
      const [taxReport] = getMockTaxReports();
      const [payment] = taxReport.payments;
      mockHttp.patch.and.nextWith(payment);

      const paymentUpdateDto: PaymentUpdateDto = { isExempt: true };
      service.updateTaxReportPayment(taxReport.id, payment.id, paymentUpdateDto).subscribe();

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `${environment.baseUrl}/tax-report/${taxReport.id}/payment/${payment.id}`,
        paymentUpdateDto
      );
    });
  });

  describe('deleteTaxReport', () => {
    it('should make `DELETE /tax-report/:taxReportId` request', () => {
      const [taxReport] = getMockTaxReports();
      mockHttp.delete.and.nextWith(taxReport);

      service.deleteTaxReport(taxReport.id).subscribe();

      expect(mockHttp.delete).toHaveBeenCalledWith(
        `${environment.baseUrl}/tax-report/${taxReport.id}`
      );
    });
  });
});
