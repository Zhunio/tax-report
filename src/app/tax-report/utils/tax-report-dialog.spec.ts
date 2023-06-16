import {
  getDefaultEndDate,
  getDefaultStartDate,
  getFiscalQuarters,
  getFiscalYears,
} from './tax-teport-dialog';

describe('TaxReportDialogUtil', () => {
  it('getFiscalQuarters() should get fiscal quarters', () => {
    expect(getFiscalQuarters()).toEqual([1, 2, 3, 4]);
  });

  it('getDefaultStartDate() should return 5 years before today', () => {
    const defaultStartDate = new Date().getFullYear() - 5;

    expect(getDefaultStartDate()).toEqual(defaultStartDate);
  });

  it('getDefaultEndDate() should return 5 years after today', () => {
    const defaultEndDate = new Date().getFullYear() + 5;

    expect(getDefaultEndDate()).toEqual(defaultEndDate);
  });

  describe('getFiscalYears()', () => {
    it('should get fiscal years from start to end', () => {
      const startYear = 2020;
      const endYear = 2022;

      expect(getFiscalYears(startYear, endYear)).toEqual([startYear, 2021, endYear]);
    });

    it('throw error if startYear is after endYear', () => {
      const startYear = 2022;
      const endYear = 2020;
      const errorMessage = `${startYear} is after ${endYear}`;

      expect(() => getFiscalYears(startYear, endYear)).toThrowError(errorMessage);
    });
  });
});
