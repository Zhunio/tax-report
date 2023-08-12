import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';
import { MockComponents } from 'ng-mocks';

import { ApiService } from '../shared/services/api/api.service';
import { BreakpointService } from '../shared/services/breakpoint/breakpoint.service';
import { UrlService } from '../shared/services/url/url.service';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { PaymentComponent } from './payment.component';
import { PaymentService } from './payment.service';
import { ReportTableComponent } from './report-table/report-table.component';

describe('PaymentComponent', () => {
  let s: Spectator<PaymentComponent>;
  let paymentServiceSpy: Spy<PaymentService>;

  const createComponent = createComponentFactory({
    component: PaymentComponent,
    declarations: [MockComponents(PaymentTableComponent, ReportTableComponent)],
  });

  beforeEach(() => {
    paymentServiceSpy = createSpyFromClass(PaymentService);
    paymentServiceSpy.reloadTaxReport.and.nextWith();
  });

  beforeEach(() => {
    s = createComponent({
      providers: [
        provideAutoSpy(ApiService),
        provideAutoSpy(UrlService),
        provideAutoSpy(BreakpointService),
        { provide: PaymentService, useValue: paymentServiceSpy },
      ],
    });
  });

  it('should reload tax report on ngOnInit()', () => {
    expect(paymentServiceSpy.reloadTaxReport).toHaveBeenCalled();
  });

  it('should render payment table', () => {
    const paymentTableComponent = s.query(PaymentTableComponent);
    expect(paymentTableComponent).not.toBeNull();
  });

  it('should render report table', () => {
    const reportTableComponent = s.query(ReportTableComponent);
    expect(reportTableComponent).not.toBeNull();
  });
});
