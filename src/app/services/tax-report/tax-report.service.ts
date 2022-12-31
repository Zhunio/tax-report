import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { MOCK_TAX_REPORTS } from 'src/app/models';

import { AddTaxReport, TaxReport } from '../../models/tax-report.model';

@Injectable({ providedIn: 'root' })
export class TaxReportService {
  taxReports$ = new BehaviorSubject<TaxReport[]>(MOCK_TAX_REPORTS);

  addTaxReport(taxReport: AddTaxReport) {
    const newTaxReport = { ...taxReport, id: this.taxReports$.value.length + 1 };

    this.taxReports$.next([...this.taxReports$.value, newTaxReport]);

    return of(newTaxReport);
  }
}
