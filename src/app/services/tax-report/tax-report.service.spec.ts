import { subscribeSpyTo } from '@hirez_io/observer-spy/dist/subscribe-spy-to';
import { AddTaxReport, MOCK_TAX_REPORTS, TaxReport } from 'src/app/models';
import { TaxReportService } from './tax-report.service';

describe('TaxReportService', () => {
  let taxReportService: TaxReportService;

  beforeEach(() => {
    taxReportService = new TaxReportService();
  });

  it('should add tax report', () => {
    const spy = subscribeSpyTo(taxReportService.taxReports$);
    const taxReport = {} as AddTaxReport;
    const newTaxReport = { id: MOCK_TAX_REPORTS.length + 1 } as TaxReport;
    const taxReports = [...MOCK_TAX_REPORTS, newTaxReport];

    taxReportService.addTaxReport(taxReport);

    expect(spy.getLastValue()).toEqual(taxReports);
  });
});
