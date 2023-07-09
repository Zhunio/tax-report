import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';
import { of } from 'rxjs';
import {
  TaxReport,
  TaxReportCreate,
  TaxReportCreateDialogResult,
} from '../../../api/models/tax-report.model';
import { ApiService } from '../../../api/services/api.service';
import { FileService } from '../../../api/services/file.service';
import { getMockTaxReports } from '../../mocks/tax-report.mocks';
import { TaxReportDialogComponent } from '../tax-report-dialog/tax-report-dialog.component';
import { TaxReportShellComponent } from './tax-report-shell.component';

describe('TaxReportShellComponent', () => {
  let s: Spectator<TaxReportShellComponent>;
  let apiService: Spy<ApiService>;

  const createComponent = createComponentFactory({
    component: TaxReportShellComponent,
  });

  beforeEach(() => {
    s = createComponent({
      providers: [
        provideAutoSpy(ApiService),
        provideAutoSpy(Router),
        provideAutoSpy(FileService),
        provideAutoSpy(MatDialog),
      ],
      detectChanges: false,
    });
    apiService = s.inject(ApiService) as any;
  });

  describe('ngOnInit()', () => {
    it('should call reloadTaxReports()', () => {
      spyOn(s.component, 'reloadTaxReports').and.returnValue(of([]));

      // call ngOnInit
      s.detectChanges();

      expect(s.component.reloadTaxReports).toHaveBeenCalled();
    });
  });

  describe('table', () => {
    it('should render columns', () => {
      apiService.getTaxReports.and.nextWith([]);
      // call ngOnInit
      s.detectChanges();

      for (const columnName of s.component.columns) {
        const column = s.query(`.mat-column-${columnName}`);
        expect(column).toBeDefined();
      }
    });

    describe('when rows are empty', () => {
      it('should show `No rows to show` empty row', () => {
        apiService.getTaxReports.and.nextWith([]);
        // call ngOnInit
        s.detectChanges();

        const row = s.query(byText('No rows to show'));
        expect(row).not.toBeNull();
      });
    });

    describe('when there is rows', () => {
      let taxReports: TaxReport[];

      beforeEach(() => {
        taxReports = getMockTaxReports();
        apiService.getTaxReports.and.nextWith(taxReports);

        // call ngOnInit
        s.detectChanges();
      });

      it('should not render `No rows to show` empty row', () => {
        const row = s.query('.mat-mdc-no-data-row');
        expect(row).toBeNull();
      });

      it('should render rows', () => {
        const rows = s.queryAll('mat-row')!;
        for (let index = 0; index < rows.length; index++) {
          const row = rows[index];

          expect(row).toHaveText(taxReports[index].fiscalYear.toString());
          expect(row).toHaveText(taxReports[index].fiscalQuarter.toString());
          expect(row).toHaveText(taxReports[index].file.fileName);
          expect(row).toHaveText('cloud_download');
          expect(row).toHaveText('delete');
        }
      });
    });
  });

  describe('onCreateTaxReportDialog()', () => {
    it('should call createTaxReport()', () => {
      spyOn(s.component, 'reloadTaxReports').and.returnValue(of([]));
      spyOn(s.component, 'createTaxReport').and.returnValue(of());

      // call ngOnInit
      s.detectChanges();
      s.component.onCreateTaxReportClicked();

      expect(s.component.createTaxReport).toHaveBeenCalled();
    });

    it('should be called when create button is clicked', () => {
      spyOn(s.component, 'reloadTaxReports').and.returnValue(of([]));
      spyOn(s.component, 'onCreateTaxReportClicked');

      // call ngOnInit
      s.detectChanges();

      const createButton = s.query('[mat-icon-button]')!;
      s.click(createButton);

      expect(createButton).toBeDefined();
      expect(s.component.onCreateTaxReportClicked).toHaveBeenCalled();
    });
  });

  describe('onDownloadRowActionClicked(mouseEvent, taxReport)', () => {
    let taxReport: TaxReport;
    let mouseEvent: MouseEvent;

    describe('when there is rows', () => {
      beforeEach(() => {
        [taxReport] = getMockTaxReports();
        apiService.getTaxReports.and.nextWith([taxReport]);
        mouseEvent = createSpyFromClass(MouseEvent);

        // call ngOnInit
        s.detectChanges();
      });

      it('should call mouseEvent.stopPropagation()', () => {
        s.component.onDownloadRowActionClicked(mouseEvent, taxReport);

        expect(mouseEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should call downloadTaxReportFile(taxReport)', () => {
        spyOn(s.component, 'downloadTaxReportFile');

        s.component.onDownloadRowActionClicked(mouseEvent, taxReport);

        expect(s.component.downloadTaxReportFile).toHaveBeenCalledWith(taxReport);
      });

      it('should be called since download button is clicked', async () => {
        spyOn(s.component, 'onDownloadRowActionClicked');

        const downloadButton = s.query('mat-row [mat-icon-button]:nth-child(1)')!;
        s.click(downloadButton);

        expect(s.component.onDownloadRowActionClicked).toHaveBeenCalledWith(
          jasmine.any(PointerEvent),
          taxReport
        );
      });
    });

    describe('when rows are empty', () => {
      beforeEach(() => {
        apiService.getTaxReports.and.nextWith([]);
        mouseEvent = createSpyFromClass(MouseEvent);

        // call ngOnInit
        s.detectChanges();
      });

      it('should not be called', () => {
        spyOn(s.component, 'onDownloadRowActionClicked');

        const downloadButton = s.query('mat-row [mat-icon-button]:nth-child(1)');

        expect(downloadButton).toBeNull();
        expect(s.component.onDownloadRowActionClicked).not.toHaveBeenCalled();
      });
    });
  });

  describe('onDeleteTaxReportClicked(mouseEvent, taxReport)', () => {
    let taxReport: TaxReport;
    let mouseEvent: MouseEvent;

    describe('when there is rows', () => {
      beforeEach(() => {
        [taxReport] = getMockTaxReports();
        apiService.getTaxReports.and.nextWith([taxReport]);
        mouseEvent = createSpyFromClass(MouseEvent);

        spyOn(s.component, 'deleteTaxReport').and.returnValue(of());

        // call ngOnInit
        s.detectChanges();
      });

      it('should call mouseEvent.stopPropagation()', () => {
        s.component.onDeleteTaxReportClicked(mouseEvent, taxReport);

        expect(mouseEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should call deleteTaxReport(taxReport)', () => {
        s.component.onDeleteTaxReportClicked(mouseEvent, taxReport);

        expect(s.component.deleteTaxReport).toHaveBeenCalledWith(taxReport.id);
      });

      it('should be called since delete button is clicked', () => {
        spyOn(s.component, 'onDeleteTaxReportClicked');

        const deleteButton = s.query('mat-row [mat-icon-button]:nth-child(2)')!;
        s.click(deleteButton);

        expect(s.component.onDeleteTaxReportClicked).toHaveBeenCalledWith(
          jasmine.any(PointerEvent),
          taxReport
        );
      });
    });

    describe('when rows are empty', () => {
      beforeEach(() => {
        apiService.getTaxReports.and.nextWith([]);
        mouseEvent = createSpyFromClass(MouseEvent);

        // call ngOnInit
        s.detectChanges();
      });

      it('should not be called', () => {
        spyOn(s.component, 'onDeleteTaxReportClicked');

        const deleteButton = s.query('mat-row [mat-icon-button]:nth-child(2)');

        expect(deleteButton).toBeNull();
        expect(s.component.onDeleteTaxReportClicked).not.toHaveBeenCalled();
      });
    });
  });

  describe('onRowClicked(taxReport)', () => {
    let taxReport: TaxReport;
    let router: Spy<Router>;

    describe('when there is rows', () => {
      beforeEach(() => {
        [taxReport] = getMockTaxReports();
        apiService.getTaxReports.and.nextWith([taxReport]);

        router = s.inject(Router) as any;

        // call ngOnInit
        s.detectChanges();
      });

      it('should navigate to /tax-report/:taxReportId', () => {
        s.component.onRowClicked(taxReport);

        expect(router.navigate).toHaveBeenCalledWith(['tax-report', taxReport.id]);
      });

      it('should be called since the row is clicked', () => {
        spyOn(s.component, 'onRowClicked');

        const row = s.query('mat-row')!;
        s.click(row);

        expect(s.component.onRowClicked).toHaveBeenCalledWith(taxReport);
      });
    });

    describe('when rows are empty', () => {
      beforeEach(() => {
        apiService.getTaxReports.and.nextWith([]);

        // call ngOnInit
        s.detectChanges();
      });

      it('should not be called', () => {
        spyOn(s.component, 'onRowClicked');

        const row = s.query('mat-row');

        expect(row).toBeNull();
        expect(s.component.onRowClicked).not.toHaveBeenCalled();
      });
    });
  });

  describe('downloadTaxReportFile(taxReport)', () => {
    let fileService: Spy<FileService>;
    let taxReport: TaxReport;

    beforeEach(() => {
      [taxReport] = getMockTaxReports();
      apiService.getTaxReports.and.nextWith([taxReport]);

      fileService = s.inject(FileService) as any;
      spyOn(console, 'log');

      // call ngOnInit
      s.detectChanges();
    });

    it('should call fileService.downloadFile(fileId)', () => {
      fileService.downloadFile.and.returnValue({} as Window);

      s.component.downloadTaxReportFile(taxReport);

      expect(fileService.downloadFile).toHaveBeenCalledWith(taxReport.file.id);
    });

    it('should log error if openedWindow is not defined', () => {
      fileService.downloadFile.and.returnValue(null);

      s.component.downloadTaxReportFile(taxReport);

      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('We could not download your file')
      );
    });

    it('should log error if openedWindow.closed is true', () => {
      fileService.downloadFile.and.returnValue({ closed: true } as Window);

      s.component.downloadTaxReportFile(taxReport);

      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('We could not download your file')
      );
    });

    it('should log error if openedWindow.closed is undefined', () => {
      fileService.downloadFile.and.returnValue({ closed: undefined } as unknown as Window);

      s.component.downloadTaxReportFile(taxReport);

      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('We could not download your file')
      );
    });
  });

  describe('reloadTaxReports()', () => {
    beforeEach(() => {
      apiService.getTaxReports.and.nextWithValues([{ value: [] }, { value: getMockTaxReports() }]);

      // call ngOnInit
      s.detectChanges();
    });

    it('should call apiService.getTaxReports()', () => {
      s.component.reloadTaxReports().subscribe();

      expect(apiService.getTaxReports).toHaveBeenCalledTimes(2);
    });

    it('should set taxReports', () => {
      s.component.reloadTaxReports().subscribe();

      expect(s.component.taxReports()).toEqual(getMockTaxReports());
    });
  });

  describe('createTaxReport()', () => {
    let dialog: Spy<MatDialog>;
    let dialogRef: Spy<MatDialogRef<TaxReportDialogComponent, TaxReportCreateDialogResult>>;

    beforeEach(() => {
      apiService.getTaxReports.and.nextWith(getMockTaxReports());
      apiService.createTaxReport.and.nextWith({});
      dialogRef = createSpyFromClass(MatDialogRef) as any;
      dialog = s.inject(MatDialog) as any;
      dialog.open.and.returnValue(dialogRef);

      // call ngOnInit
      s.detectChanges();
    });

    it('should call dialog.open(TaxReportDialogComponent)', () => {
      dialogRef.afterClosed.and.nextWith({} as TaxReportCreateDialogResult);

      s.component.createTaxReport().subscribe();

      expect(dialog.open).toHaveBeenCalledWith(TaxReportDialogComponent);
    });

    describe('dialog.afterClosed()', () => {
      describe('take(1)', () => {
        it('should take only the first value from dialog.afterClosed() stream', () => {
          const taxReports = [
            { fiscalQuarter: 1, fiscalYear: 2020, uploadedFile: {} as File },
            { fiscalQuarter: 2, fiscalYear: 2020, uploadedFile: {} as File },
          ];
          dialogRef.afterClosed.and.nextWithValues([
            { value: { taxReport: taxReports[0] } },
            { value: { taxReport: taxReports[1] } },
          ]);

          s.component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).toHaveBeenCalledWith(taxReports[0]);
        });
      });

      describe('filter(Boolean)', () => {
        it('should ignore null from dialog.afterClosed() stream', () => {
          dialogRef.afterClosed.and.nextWith(null);

          s.component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).not.toHaveBeenCalled();
        });

        it('should ignore undefined from dialog.afterClosed() stream', () => {
          dialogRef.afterClosed.and.nextWith(undefined);

          s.component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).not.toHaveBeenCalled();
        });
      });

      describe('switchMap(() => apiService.createTaxReport(taxReportCreate)', () => {
        it('should call apiService.createTaxReport(taxReportCreate)', () => {
          const taxReport: TaxReportCreate = {
            fiscalQuarter: 1,
            fiscalYear: 2020,
            uploadedFile: {} as File,
          };
          dialogRef.afterClosed.and.nextWith({ taxReport });

          s.component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).toHaveBeenCalledWith(taxReport);
        });
      });

      describe('switchMap(() => reloadTaxReports())', () => {
        it('should call reloadTaxReports()', () => {
          spyOn(s.component, 'reloadTaxReports').and.returnValue(of());

          const taxReport: TaxReportCreate = {
            fiscalQuarter: 1,
            fiscalYear: 2020,
            uploadedFile: {} as File,
          };
          dialogRef.afterClosed.and.nextWith({ taxReport });

          s.component.createTaxReport().subscribe();

          expect(s.component.reloadTaxReports).toHaveBeenCalled();
        });
      });
    });
  });

  describe('deleteTxaReport(taxReportId)', () => {
    beforeEach(() => {
      spyOn(s.component, 'reloadTaxReports').and.returnValue(of());
      apiService.getTaxReports.and.nextWith(getMockTaxReports());
      // call ngOnInit
      s.detectChanges();
    });

    it('should call apiService.deleteTaxReport(taxReportId)', () => {
      const [taxReport] = getMockTaxReports();
      apiService.deleteTaxReport.and.nextWith({});

      s.component.deleteTaxReport(taxReport.id).subscribe();

      expect(apiService.deleteTaxReport).toHaveBeenCalledWith(taxReport.id);
    });

    it('should call reloadTaxReports()', () => {
      const [taxReport] = getMockTaxReports();
      apiService.deleteTaxReport.and.nextWith({});

      s.component.deleteTaxReport(taxReport.id).subscribe();

      expect(s.component.reloadTaxReports).toHaveBeenCalled();
    });
  });
});
