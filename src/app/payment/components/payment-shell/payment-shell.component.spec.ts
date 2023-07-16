import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { provideAutoSpy } from 'jasmine-auto-spies';
import { MockComponents } from 'ng-mocks';
import { PaymentService } from '../../services/payment/payment.service';
import { UrlService } from '../../services/url/url.service';
import { PaymentTableComponent } from '../payment-table/payment-table.component';
import { ReportTableComponent } from '../report-table/report-table.component';
import { PaymentShellComponent } from './payment-shell.component';

describe('PaymentShellComponent', () => {
  let s: Spectator<PaymentShellComponent>;

  const createComponent = createComponentFactory({
    component: PaymentShellComponent,
    declarations: [MockComponents(PaymentTableComponent, ReportTableComponent)],
  });

  beforeEach(() => {
    s = createComponent({
      providers: [provideAutoSpy(UrlService), provideAutoSpy(PaymentService)],
    });
  });

  describe('template', () => {
    it('should render component', () => {
      expect(s).toBeTruthy();
    });

    it('should render Payments', () => {
      const payments = s.query(byText('Payments'));
      expect(payments).not.toBeNull();
    });

    it('should render payment-table', () => {
      const paymentTableComponent = s.query(PaymentTableComponent);
      expect(paymentTableComponent).not.toBeNull();
    });

    it('should render Reports', () => {
      const reports = s.query(byText('Reports'));
      expect(reports).not.toBeNull();
    });
  });
});
