import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { Spectator, byText } from '@ngneat/spectator';
import { FilePondFile } from 'filepond';

import { TaxReportDialogComponent } from './tax-report-dialog.component';

export class TaxReportDialogPage {
  constructor(private s: Spectator<TaxReportDialogComponent>) {}

  private loader: HarnessLoader = TestbedHarnessEnvironment.loader(this.s.fixture);

  async getFiscalQuarterSelect() {
    const [fiscalQuarter] = await this.loader.getAllHarnesses(MatSelectHarness);

    return fiscalQuarter;
  }

  async getFiscalYearSelect() {
    const [, fiscalYear] = await this.loader.getAllHarnesses(MatSelectHarness);

    return fiscalYear;
  }

  getDisregardChangesButton() {
    return this.s.query(byText('Disregard Changes'))!;
  }

  getSaveChangesButton() {
    return this.s.query(byText('Save Changes'))!;
  }

  async setFiscalQuarter(fiscalQuarter: number) {
    const fiscalQuarterSelect = await this.getFiscalQuarterSelect();

    await fiscalQuarterSelect.open();
    await fiscalQuarterSelect.clickOptions({ text: fiscalQuarter.toString() });
  }

  async setFiscalYear(fiscalYear: number) {
    const fiscalYearSelect = await this.getFiscalYearSelect();

    await fiscalYearSelect.open();
    await fiscalYearSelect.clickOptions({ text: fiscalYear.toString() });
  }

  uploadFile(pondFile: FilePondFile) {
    this.s.component.onPondAddFile(pondFile);
  }
}
