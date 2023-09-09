import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { FilePondFile } from 'filepond';
import { provideAutoSpy } from 'jasmine-auto-spies';
import { FilePondModule } from 'ngx-filepond';

import { TaxReportDialogError } from './tax-report-dialog.enum';
import { TaxReportDialogComponent } from './tax-report-dialog.component';
import { TaxReportCreateDialogResult } from './tax-report-dialog.model';
import { TaxReportDialogPage } from './tax-report-dialog.page';

describe('TaxReportDialogComponent', () => {
  let s: Spectator<TaxReportDialogComponent>;
  let page: TaxReportDialogPage;
  let dialogRefSpy: MatDialogRef<TaxReportDialogComponent, TaxReportCreateDialogResult>;

  const createComponent = createComponentFactory({
    component: TaxReportDialogComponent,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FilePondModule,
      MatButtonModule,
      MatFormFieldModule,
      MatSelectModule,
      MatDialogModule,
    ],
  });

  beforeEach(() => {
    s = createComponent({
      providers: [provideAutoSpy(MatDialogRef)],
    });
    dialogRefSpy = s.inject(MatDialogRef) as any;
    page = new TaxReportDialogPage(s);
  });

  describe('Disregard Changes', () => {
    it('should close dialog', () => {
      s.click(page.getDisregardChangesButton());

      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  describe('Save Changes (successfully)', () => {
    it('should close dialog with default values', () => {
      const pondFile = { file: new File([], 'tax-report.xlsx') } as unknown as FilePondFile;
      page.uploadFile(pondFile);

      s.click(page.getSaveChangesButton());

      expect(s.component.hasFileError).toBeFalse();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        taxReport: {
          fiscalQuarter: 1,
          fiscalYear: new Date().getFullYear(),
          uploadedFile: pondFile.file as File,
        },
      });
    });

    it('should close dialog when setting different fiscal quarter and fiscal year values', async () => {
      const pondFile = { file: new File([], 'tax-report.xlsx') } as unknown as FilePondFile;
      page.uploadFile(pondFile);

      await page.setFiscalQuarter(2);
      await page.setFiscalYear(2000);

      s.click(page.getSaveChangesButton());

      expect(s.component.hasFileError).toBeFalse();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        taxReport: {
          fiscalQuarter: 2,
          fiscalYear: 2000,
          uploadedFile: pondFile.file as File,
        },
      });
    });
  });

  describe('Save Changes (unsuccessfully)', () => {
    xit('should show no file provided error', async () => {
      await page.setFiscalQuarter(2);
      await page.setFiscalYear(2000);

      s.click(page.getSaveChangesButton());

      await delay(50);

      expect(s.component.hasFileError).toBeTrue();
      expect(s.query(byText(TaxReportDialogError.NoFileProvided))).toBeVisible();
      expect(s.query('.file-error')).toBeVisible();
    });

    xit('should show unsupported file provided', async () => {
      const pondFile = { file: new File([], 'tax-report.txt') } as unknown as FilePondFile;
      page.uploadFile(pondFile);

      await page.setFiscalQuarter(2);
      await page.setFiscalYear(2000);

      await delay(50);

      expect(s.component.hasFileError).toBeTrue();
      expect(s.query(byText(TaxReportDialogError.UnsupportedFileProvided))).toBeVisible();
      expect(s.query('.file-error')).toBeVisible();
    });
  });
});

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
