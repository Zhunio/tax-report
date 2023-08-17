import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';

import { PaymentUpdateDto, TaxReportDto } from './api.model';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let s: SpectatorService<ApiService>;
  let service: ApiService;
  let http: Spy<HttpClient>;

  const createService = createServiceFactory({
    service: ApiService,
    providers: [provideAutoSpy(HttpClient)],
  });

  beforeEach(() => (s = createService()));

  beforeEach(() => {
    service = s.inject(ApiService);
    http = s.inject(HttpClient) as any;
  });

  it('should get tax report by id', () => {
    const [taxReport] = getMockTaxReports();
    http.get.and.nextWith(taxReport);

    service.getTaxReportById(taxReport.id).subscribe();

    expect(http.get).toHaveBeenCalledWith(`${environment.baseUrl}/tax-report/${taxReport.id}`);
  });

  it('should get tax reports', () => {
    const taxReports = getMockTaxReports();
    http.get.and.nextWith(taxReports);

    service.getTaxReports().subscribe();

    expect(http.get).toHaveBeenCalledWith(`${environment.baseUrl}/tax-report`);
  });

  it('should create tax report', () => {
    const [taxReport] = getMockTaxReports();
    http.post.and.nextWith(taxReport);

    service
      .createTaxReport({ fiscalQuarter: 1, fiscalYear: 1995, uploadedFile: {} as File })
      .subscribe();

    expect(http.post).toHaveBeenCalledWith(
      `${environment.baseUrl}/tax-report`,
      jasmine.any(FormData)
    );
  });

  it('should update payment', () => {
    const [taxReport] = getMockTaxReports();
    const [payment] = taxReport.payments;
    http.patch.and.nextWith(payment);

    const paymentUpdateDto: PaymentUpdateDto = { isExempt: true };
    service.updatePayment(taxReport.id, payment.id, paymentUpdateDto).subscribe();

    expect(http.patch).toHaveBeenCalledWith(
      `${environment.baseUrl}/tax-report/${taxReport.id}/payment/${payment.id}`,
      paymentUpdateDto
    );
  });

  it('should delete tax report', () => {
    const [taxReport] = getMockTaxReports();
    http.delete.and.nextWith(taxReport);

    service.deleteTaxReport(taxReport.id).subscribe();

    expect(http.delete).toHaveBeenCalledWith(`${environment.baseUrl}/tax-report/${taxReport.id}`);
  });
});

function getMockTaxReports(): TaxReportDto[] {
  return [
    {
      id: 1,
      fiscalQuarter: 1,
      fiscalYear: 1995,
      file: { fileName: 'tax-report.xlsx' },
      payments: [{ id: 1 }],
    } as TaxReportDto,
  ];
}
