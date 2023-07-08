import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { TaxReportDialogService } from './tax-report-dialog.service';

describe('TaxReportDialogService', () => {
  let s: SpectatorService<TaxReportDialogService>;

  const createService = createServiceFactory(TaxReportDialogService);

  beforeEach(() => {
    s = createService();
  });

  it('should set fiscalQuarters', () => {
    expect(s.service.fiscalQuarters()).toEqual([1, 2, 3, 4]);
  });

  it('should set the fiscalQuarter to the first element of fiscalQuarters', () => {
    expect(s.service.fiscalQuarter()).toEqual(s.service.fiscalQuarters()[0]);
  });

  it('should set fiscalYears from 5 years before today to 5 years after today', () => {
    const from = new Date().getFullYear() - 5;
    const to = new Date().getFullYear() + 5;

    for (let year = from; year <= to; year++) {
      expect(s.service.fiscalYears()).toContain(year);
    }
  });

  it('should set fiscalYear to the current year', () => {
    expect(s.service.fiscalYear()).toEqual(new Date().getFullYear());
  });

  describe('getFiscalYears()', () => {
    it('should throw an error when the startYear is after the endYear', () => {
      const startYear = 1995;
      const endYear = 1990;

      expect(() => s.service.getFiscalYears(startYear, endYear)).toThrowError(
        `${startYear} is after ${endYear}`
      );
    });

    it('should fill an array with fiscal years starting from startYear and ending in endYear', () => {
      const startYear = 1995;
      const endYear = 2000;

      expect(s.service.getFiscalYears(startYear, endYear)).toEqual([
        1995, 1996, 1997, 1998, 1999, 2000,
      ]);
    });
  });

  describe('isValidFileExtension()', () => {
    it('should be true if the file contains .xlsx extension', () => {
      expect(s.service.isValidFileExtension(new File([], 'tax-report.xlsx'))).toBeTrue();
    });

    it('should be false if the file does not contain the xlsx extension', () => {
      expect(s.service.isValidFileExtension(new File([], 'tax-report.txt'))).toBeFalse();
    });
  });
});
