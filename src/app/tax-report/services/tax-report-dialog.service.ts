import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaxReportDialogService {
  fiscalQuarters = signal([1, 2, 3, 4]);
  fiscalQuarter = signal(this.fiscalQuarters()[0]);

  fiscalYears = signal(
    this.getFiscalYears(new Date().getFullYear() - 5, new Date().getFullYear() + 5)
  );
  fiscalYear = signal(new Date().getFullYear());

  getFiscalYears(startYear: number, endYear: number) {
    const years = [];

    if (startYear > endYear) {
      throw new Error(`${startYear} is after ${endYear}`);
    }

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years;
  }

  isValidFileExtension(file: File): boolean {
    return file.name.includes('xlsx');
  }
}
