import {
  getDefaultEndDate,
  getDefaultStartDate,
  getFiscalQuarters,
  getFiscalYears,
  isValidFileExtension,
} from './tax-report-dialog.util';

describe('TaxReportDialogUtil', () => {
  describe('getDefaultStartDate()', () => {
    it('should get the default start date set to five years before today', () => {
      const today = new Date();
      const defaultStartDate = today.getFullYear() - 5;

      expect(getDefaultStartDate()).toEqual(defaultStartDate);
    });
  });

  describe('getDefaultEndDate()', () => {
    it('should get the default end date set to five years after today', () => {
      const today = new Date();
      const defaultEndDate = today.getFullYear() + 5;

      expect(getDefaultEndDate()).toEqual(defaultEndDate);
    });
  });

  describe('getFiscalQuarters()', () => {
    it('should return the fourth fiscal quarters of the year', () => {
      expect(getFiscalQuarters()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('getFiscalYears()', () => {
    it('should throw an error when the start year is after the end year', () => {
      const startYear = 1995;
      const endYear = 1990;

      expect(() => getFiscalYears(startYear, endYear)).toThrowError(
        `${startYear} is after ${endYear}`
      );
    });

    it('should fill an array with fiscal years starting from start year and ending in end year', () => {
      const startYear = 1995;
      const endYear = 2000;

      expect(getFiscalYears(startYear, endYear)).toEqual([1995, 1996, 1997, 1998, 1999, 2000]);
    });
  });

  describe('isValidFileExtension()', () => {
    it('should check if the file name includes the xlsx extension', () => {
      expect(isValidFileExtension(new File([], 'tax-report.txt'))).toBeFalse();
      expect(isValidFileExtension(new File([], 'tax-report.xlsx'))).toBeTrue();
    });
  });
});
