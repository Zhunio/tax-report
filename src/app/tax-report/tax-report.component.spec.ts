import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';
import { throwError } from 'rxjs';

import { ApiService } from '@/app/shared/services/api/api.service';
import { FileService } from '@/app/shared/services/file/file.service';
import { TaxReportComponent } from './tax-report.component';
import { TaxReportErrorLabel } from './tax-report.enum';
import {
  TaxReportShellPage,
  getMockTaxReportCreateDialogResult,
  getMockTaxReports,
} from './tax-report.page';

describe('TaxReportComponent', () => {
  let s: Spectator<TaxReportComponent>;
  let page: TaxReportShellPage;

  let dialogSpy: Spy<MatDialog>;
  let fileServiceSpy: Spy<FileService>;
  let apiServiceSpy: Spy<ApiService>;

  const createComponent = createComponentFactory({
    component: TaxReportComponent,
    imports: [MatIconModule, MatTableModule, MatCheckboxModule, MatDialogModule],
    detectChanges: false,
  });

  beforeEach(() => {
    s = createComponent({
      providers: [
        provideAutoSpy(MatDialog),
        provideAutoSpy(ApiService),
        provideAutoSpy(FileService),
      ],
    });

    dialogSpy = s.inject(MatDialog) as any;
    fileServiceSpy = s.inject(FileService) as any;
    apiServiceSpy = s.inject(ApiService) as any;

    page = new TaxReportShellPage(s);
  });

  describe('when first loading component', () => {
    it('should render empty table', () => {
      apiServiceSpy.getTaxReports.and.nextWith([]);

      s.detectChanges();

      page.expectToBeEmpty();
    });

    it('should show loading indicator', () => {
      const getTaxReportsSubject = apiServiceSpy.getTaxReports.and.returnSubject();
      s.detectChanges();

      expect(page.getLoadingProgressBar()).toBeVisible();
      expect(page.getLoadingText()).toBeVisible();

      getTaxReportsSubject.next([]);
      s.detectChanges();

      expect(page.getLoadingProgressBar()).not.toBeVisible();
      expect(page.getLoadingText()).not.toBeVisible();
      page.expectToBeEmpty();
    });

    it('should render columns', () => {
      apiServiceSpy.getTaxReports.and.nextWith([]);

      s.detectChanges();

      expect(page.getHeaderColumn('fiscalYear')).toHaveText('Fiscal Year');
      expect(page.getHeaderColumn('fiscalQuarter')).toHaveText('Fiscal Quarter');
      expect(page.getHeaderColumn('fileName')).toHaveText('Filename');
      expect(page.getHeaderColumn('rowActions')).toBeVisible();
    });

    it('should render table with rows', () => {
      const [taxReport] = getMockTaxReports();
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      page.expectRowToHaveTaxReport(0, taxReport);
    });

    it('should show error notification if there is an issue retrieving tax reports', () => {
      spyOn(console, 'error');
      apiServiceSpy.getTaxReports.and.returnValue(
        throwError(() => TaxReportErrorLabel.CouldNotReloadTaxReports)
      );

      s.detectChanges();

      expect(page.getCouldNotReloadTaxReportsErrorLabel()).toBeVisible();
      expect(console.error).toHaveBeenCalledWith(TaxReportErrorLabel.CouldNotReloadTaxReports);
    });
  });

  describe('when clicking create tax report button', () => {
    it('should create tax report on empty table', () => {
      apiServiceSpy.getTaxReports.and.nextWith([]);

      s.detectChanges();

      const dialogResult = getMockTaxReportCreateDialogResult();
      const dialogRef = createSpyFromClass(MatDialogRef);
      dialogRef.afterClosed.and.nextWith(dialogResult);
      dialogSpy.open.and.returnValue(dialogRef);

      const [taxReport] = getMockTaxReports();
      apiServiceSpy.createTaxReport.and.nextWith(taxReport);
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      page.clickCreateTaxReport();

      page.expectRowToHaveTaxReport(0, taxReport);
    });

    it('should show loading indicator', () => {
      apiServiceSpy.getTaxReports.and.nextWithValues([{ value: [] }]);

      s.detectChanges();

      const dialogRef = createSpyFromClass(MatDialogRef);
      dialogSpy.open.and.returnValue(dialogRef);

      page.clickCreateTaxReport();

      // page should be loading since create tax report button was just clicked
      expect(page.getLoadingProgressBar()).toBeVisible();
      expect(page.getLoadingText()).toBeVisible();

      const dialogResult = getMockTaxReportCreateDialogResult();
      const [taxReport] = getMockTaxReports();
      dialogRef.afterClosed.and.nextWith(dialogResult);
      apiServiceSpy.createTaxReport.and.nextWith(taxReport);
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      expect(page.getLoadingProgressBar()).not.toBeVisible();
      expect(page.getLoadingText()).not.toBeVisible();
      page.expectRowToHaveTaxReport(0, taxReport);
    });

    it('should show error notification if there is an issue creating the tax report', () => {
      spyOn(console, 'error');
      apiServiceSpy.getTaxReports.and.nextWith([]);

      s.detectChanges();

      const dialogResult = getMockTaxReportCreateDialogResult();
      const dialogRef = createSpyFromClass(MatDialogRef);
      dialogRef.afterClosed.and.nextWith(dialogResult);
      dialogSpy.open.and.returnValue(dialogRef);

      apiServiceSpy.createTaxReport.and.throwWith(TaxReportErrorLabel.CouldNotCreateTaxReport);
      apiServiceSpy.getTaxReports.and.nextWith([]);

      page.clickCreateTaxReport();

      expect(page.getCouldNotCreateTaxReportErrorLabel()).toBeVisible();
      expect(console.error).toHaveBeenCalledWith(TaxReportErrorLabel.CouldNotCreateTaxReport);
    });
  });

  describe('when clicking download tax report button', () => {
    it('should download tax report', () => {
      const [taxReport] = getMockTaxReports();
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      fileServiceSpy.downloadFile.and.returnValue({ closed: false } as Window);
      page.clickRowDownloadButton(0);

      expect(fileServiceSpy.downloadFile).toHaveBeenCalledWith(taxReport.file.id);
    });

    it('should show error notification if there is an issue downloading the tax report', () => {
      spyOn(console, 'error');
      const [taxReport] = getMockTaxReports();
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      fileServiceSpy.downloadFile.and.returnValue(null);
      page.clickRowDownloadButton(0);

      expect(page.getCouldNotDownloadTaxReportErrorLabel()).toBeVisible();
      expect(console.error).toHaveBeenCalledWith(TaxReportErrorLabel.CouldNotDownloadTaxReport);
    });
  });

  describe('when clicking delete tax report button', () => {
    it('should delete tax report', () => {
      const [taxReport] = getMockTaxReports();
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      apiServiceSpy.deleteTaxReport.and.nextWith(taxReport);
      apiServiceSpy.getTaxReports.and.nextWith([]);

      page.clickRowDeleteButton(0);

      page.expectToBeEmpty();
    });

    it('should show loading indicator', () => {
      const [taxReport] = getMockTaxReports();
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      page.clickRowDeleteButton(0);

      // make api call to delete tax report
      apiServiceSpy.deleteTaxReport.and.nextWith(taxReport);

      expect(page.getLoadingProgressBar()).toBeVisible();

      // make api call to refresh tax reports
      apiServiceSpy.getTaxReports.and.nextWith([]);

      s.detectChanges();

      expect(page.getLoadingProgressBar()).not.toBeVisible();
      expect(page.getLoadingText()).not.toBeVisible();
      page.expectToBeEmpty();
    });

    it('should show error notification if there is an issue deleting the tax report', () => {
      spyOn(console, 'error');
      const [taxReport] = getMockTaxReports();
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      s.detectChanges();

      apiServiceSpy.deleteTaxReport.and.returnValue(
        throwError(() => TaxReportErrorLabel.CouldNotDeleteTaxReport)
      );
      apiServiceSpy.getTaxReports.and.nextWith([taxReport]);

      page.clickRowDeleteButton(0);

      expect(page.getCouldNotDeleteTaxReportErrorLabel()).toBeVisible();
      expect(console.error).toHaveBeenCalledWith(TaxReportErrorLabel.CouldNotDeleteTaxReport);
    });
  });
});
