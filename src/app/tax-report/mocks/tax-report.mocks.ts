import { TaxReport } from '../../api/models/tax-report.model';

export function getMockTaxReports(): TaxReport[] {
  return [
    {
      id: 1,
      fiscalQuarter: 1,
      fiscalYear: 1995,
      file: { fileName: 'tax-report.xlsx' },
      payments: [{ id: 1 }],
    } as TaxReport,
  ];
}
