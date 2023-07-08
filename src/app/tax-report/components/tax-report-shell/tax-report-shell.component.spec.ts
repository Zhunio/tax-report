import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Spy, createSpyFromClass, provideAutoSpy } from 'jasmine-auto-spies';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import {
  TaxReport,
  TaxReportCreate,
  TaxReportCreateDialogResult,
} from '../../../api/models/tax-report.model';
import { ApiService } from '../../../api/services/api.service';
import { FileService } from '../../../api/services/file.service';
import { getMockTaxReports } from '../../mocks/tax-report.mocks';
import { TaxReportDialogComponent } from '../tax-report-dialog/tax-report-dialog';
import { TaxReportShellComponent } from './tax-report-shell.component';

describe('TaxReportShellComponent', () => {
  let fixture: MockedComponentFixture<TaxReportShellComponent, {}>;
  let component: TaxReportShellComponent;
  let apiService: Spy<ApiService>;

  beforeEach(() =>
    MockBuilder(TaxReportShellComponent)
      .provide(provideAutoSpy(ApiService))
      .provide(provideAutoSpy(Router))
      .provide(provideAutoSpy(FileService))
      .provide(provideAutoSpy(MatDialog))
      .keep(MatTableModule)
      .keep(MatIconModule)
      .keep(MatCheckboxModule)
  );

  beforeEach(() => {
    fixture = MockRender(TaxReportShellComponent, {}, { detectChanges: false });
    component = fixture.point.componentInstance;
    apiService = ngMocks.findInstance(ApiService) as any;
    // loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('ngOnInit()', () => {
    it('should call reloadTaxReports()', () => {
      spyOn(component, 'reloadTaxReports').and.returnValue(of([]));

      // call ngOnInit
      fixture.detectChanges();

      expect(component.reloadTaxReports).toHaveBeenCalled();
    });
  });

  describe('table', () => {
    it('should render columns', () => {
      apiService.getTaxReports.and.nextWith([]);
      // call ngOnInit
      fixture.detectChanges();

      for (const columnName of component.columns) {
        const column = ngMocks.find(`.mat-column-${columnName}`);
        expect(column).toBeDefined();
      }
    });

    describe('when rows are empty', () => {
      it('should show `No rows to show` empty row', () => {
        apiService.getTaxReports.and.nextWith([]);
        // call ngOnInit
        fixture.detectChanges();

        const row = ngMocks.find('.mat-mdc-no-data-row');
        expect(row).toBeDefined();
        expect(ngMocks.formatText(row)).toContain('No rows to show');
      });
    });

    describe('when there is rows', () => {
      let taxReports: TaxReport[];

      beforeEach(() => {
        taxReports = getMockTaxReports();
        apiService.getTaxReports.and.nextWith(taxReports);

        // call ngOnInit
        fixture.detectChanges();
      });

      it('should not render `No rows to show` empty row', () => {
        const row = ngMocks.find('.mat-mdc-no-data-row', null);
        expect(row).toBeNull();
      });

      it('should render rows', () => {
        const rows = ngMocks.findAll('mat-row');
        for (let index = 0; index < rows.length; index++) {
          const [fiscalYear, fiscalQuarter, fileName, rowActions] = ngMocks
            .formatText(rows[index])
            .split(' ');

          expect(fiscalYear).toEqual(taxReports[index].fiscalYear.toString());
          expect(fiscalQuarter).toEqual(taxReports[index].fiscalQuarter.toString());
          expect(fileName).toEqual(taxReports[index].file.fileName);
          expect(rowActions).toContain('cloud_download');
          expect(rowActions).toContain('delete');
        }
      });
    });
  });

  describe('onCreateTaxReportDialog()', () => {
    it('should call createTaxReport()', () => {
      spyOn(component, 'reloadTaxReports').and.returnValue(of([]));
      spyOn(component, 'createTaxReport').and.returnValue(of());

      // call ngOnInit
      fixture.detectChanges();
      component.onCreateTaxReportClicked();

      expect(component.createTaxReport).toHaveBeenCalled();
    });

    it('should be called when create button is clicked', () => {
      spyOn(component, 'reloadTaxReports').and.returnValue(of([]));
      spyOn(component, 'onCreateTaxReportClicked');

      // call ngOnInit
      fixture.detectChanges();

      const createButton = ngMocks.find('[mat-icon-button]');
      ngMocks.click(createButton);

      expect(createButton).toBeDefined();
      expect(component.onCreateTaxReportClicked).toHaveBeenCalled();
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
        fixture.detectChanges();
      });

      it('should call mouseEvent.stopPropagation()', () => {
        component.onDownloadRowActionClicked(mouseEvent, taxReport);

        expect(mouseEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should call downloadTaxReportFile(taxReport)', () => {
        spyOn(component, 'downloadTaxReportFile');

        component.onDownloadRowActionClicked(mouseEvent, taxReport);

        expect(component.downloadTaxReportFile).toHaveBeenCalledWith(taxReport);
      });

      it('should be called since download button is clicked', () => {
        spyOn(component, 'onDownloadRowActionClicked');

        const downloadButton = ngMocks.find('mat-row [mat-icon-button]:nth-child(1)');
        ngMocks.click(downloadButton);

        expect(component.onDownloadRowActionClicked).toHaveBeenCalledWith(
          jasmine.any(CustomEvent),
          taxReport
        );
      });
    });

    describe('when rows are empty', () => {
      beforeEach(() => {
        apiService.getTaxReports.and.nextWith([]);
        mouseEvent = createSpyFromClass(MouseEvent);

        // call ngOnInit
        fixture.detectChanges();
      });

      it('should not be called', () => {
        spyOn(component, 'onDownloadRowActionClicked');

        const downloadButton = ngMocks.find('mat-row [mat-icon-button]:nth-child(1)', null);

        expect(downloadButton).toBeNull();
        expect(component.onDownloadRowActionClicked).not.toHaveBeenCalled();
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

        spyOn(component, 'deleteTaxReport').and.returnValue(of());

        // call ngOnInit
        fixture.detectChanges();
      });

      it('should call mouseEvent.stopPropagation()', () => {
        component.onDeleteTaxReportClicked(mouseEvent, taxReport);

        expect(mouseEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should call deleteTaxReport(taxReport)', () => {
        component.onDeleteTaxReportClicked(mouseEvent, taxReport);

        expect(component.deleteTaxReport).toHaveBeenCalledWith(taxReport.id);
      });

      it('should be called since delete button is clicked', () => {
        spyOn(component, 'onDeleteTaxReportClicked');

        const deleteButton = ngMocks.find('mat-row [mat-icon-button]:nth-child(2)');
        ngMocks.click(deleteButton);

        expect(component.onDeleteTaxReportClicked).toHaveBeenCalledWith(
          jasmine.any(CustomEvent),
          taxReport
        );
      });
    });

    describe('when rows are empty', () => {
      beforeEach(() => {
        apiService.getTaxReports.and.nextWith([]);
        mouseEvent = createSpyFromClass(MouseEvent);

        // call ngOnInit
        fixture.detectChanges();
      });

      it('should not be called', () => {
        spyOn(component, 'onDeleteTaxReportClicked');

        const deleteButton = ngMocks.find('mat-row [mat-icon-button]:nth-child(2)', null);

        expect(deleteButton).toBeNull();
        expect(component.onDeleteTaxReportClicked).not.toHaveBeenCalled();
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

        router = ngMocks.findInstance(Router) as any;

        // call ngOnInit
        fixture.detectChanges();
      });

      it('should navigate to /tax-report/:taxReportId', () => {
        component.onRowClicked(taxReport);

        expect(router.navigate).toHaveBeenCalledWith(['tax-report', taxReport.id]);
      });

      it('should be called since the row is clicked', () => {
        spyOn(component, 'onRowClicked');

        const row = ngMocks.find('mat-row');
        ngMocks.click(row);

        expect(component.onRowClicked).toHaveBeenCalledWith(taxReport);
      });
    });

    describe('when rows are empty', () => {
      beforeEach(() => {
        apiService.getTaxReports.and.nextWith([]);

        // call ngOnInit
        fixture.detectChanges();
      });

      it('should not be called', () => {
        spyOn(component, 'onRowClicked');

        const row = ngMocks.find('mat-row', null);

        expect(row).toBeNull();
        expect(component.onRowClicked).not.toHaveBeenCalled();
      });
    });
  });

  describe('downloadTaxReportFile(taxReport)', () => {
    let fileService: Spy<FileService>;
    let taxReport: TaxReport;

    beforeEach(() => {
      [taxReport] = getMockTaxReports();
      apiService.getTaxReports.and.nextWith([taxReport]);

      fileService = ngMocks.findInstance(FileService) as any;
      spyOn(console, 'log');

      // call ngOnInit
      fixture.detectChanges();
    });

    it('should call fileService.downloadFile(fileId)', () => {
      fileService.downloadFile.and.returnValue({} as Window);

      component.downloadTaxReportFile(taxReport);

      expect(fileService.downloadFile).toHaveBeenCalledWith(taxReport.file.id);
    });

    it('should log error if openedWindow is not defined', () => {
      fileService.downloadFile.and.returnValue(null);

      component.downloadTaxReportFile(taxReport);

      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('We could not download your file')
      );
    });

    it('should log error if openedWindow.closed is true', () => {
      fileService.downloadFile.and.returnValue({ closed: true } as Window);

      component.downloadTaxReportFile(taxReport);

      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('We could not download your file')
      );
    });

    it('should log error if openedWindow.closed is undefined', () => {
      fileService.downloadFile.and.returnValue({ closed: undefined } as unknown as Window);

      component.downloadTaxReportFile(taxReport);

      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('We could not download your file')
      );
    });
  });

  describe('reloadTaxReports()', () => {
    beforeEach(() => {
      apiService.getTaxReports.and.nextWithValues([{ value: [] }, { value: getMockTaxReports() }]);

      // call ngOnInit
      fixture.detectChanges();
    });

    it('should call apiService.getTaxReports()', () => {
      component.reloadTaxReports().subscribe();

      expect(apiService.getTaxReports).toHaveBeenCalledTimes(2);
    });

    it('should set taxReports', () => {
      component.reloadTaxReports().subscribe();

      expect(component.taxReports()).toEqual(getMockTaxReports());
    });
  });

  describe('createTaxReport()', () => {
    let dialog: Spy<MatDialog>;
    let dialogRef: Spy<MatDialogRef<TaxReportDialogComponent, TaxReportCreateDialogResult>>;

    beforeEach(() => {
      apiService.getTaxReports.and.nextWith(getMockTaxReports());
      apiService.createTaxReport.and.nextWith({});
      dialogRef = createSpyFromClass(MatDialogRef) as any;
      dialog = ngMocks.findInstance(MatDialog) as any;
      dialog.open.and.returnValue(dialogRef);

      // call ngOnInit
      fixture.detectChanges();
    });

    it('should call dialog.open(TaxReportDialogComponent)', () => {
      dialogRef.afterClosed.and.nextWith({} as TaxReportCreateDialogResult);

      component.createTaxReport().subscribe();

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

          component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).toHaveBeenCalledWith(taxReports[0]);
        });
      });

      describe('filter(Boolean)', () => {
        it('should ignore null from dialog.afterClosed() stream', () => {
          dialogRef.afterClosed.and.nextWith(null);

          component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).not.toHaveBeenCalled();
        });

        it('should ignore undefined from dialog.afterClosed() stream', () => {
          dialogRef.afterClosed.and.nextWith(undefined);

          component.createTaxReport().subscribe();

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

          component.createTaxReport().subscribe();

          expect(apiService.createTaxReport).toHaveBeenCalledWith(taxReport);
        });
      });

      describe('switchMap(() => reloadTaxReports())', () => {
        it('should call reloadTaxReports()', () => {
          spyOn(component, 'reloadTaxReports').and.returnValue(of());

          const taxReport: TaxReportCreate = {
            fiscalQuarter: 1,
            fiscalYear: 2020,
            uploadedFile: {} as File,
          };
          dialogRef.afterClosed.and.nextWith({ taxReport });

          component.createTaxReport().subscribe();

          expect(component.reloadTaxReports).toHaveBeenCalled();
        });
      });
    });
  });

  describe('deleteTxaReport(taxReportId)', () => {
    beforeEach(() => {
      spyOn(component, 'reloadTaxReports').and.returnValue(of());
      apiService.getTaxReports.and.nextWith(getMockTaxReports());
      // call ngOnInit
      fixture.detectChanges();
    });

    it('should call apiService.deleteTaxReport(taxReportId)', () => {
      const [taxReport] = getMockTaxReports();
      apiService.deleteTaxReport.and.nextWith({});

      component.deleteTaxReport(taxReport.id).subscribe();

      expect(apiService.deleteTaxReport).toHaveBeenCalledWith(taxReport.id);
    });

    it('should call reloadTaxReports()', () => {
      const [taxReport] = getMockTaxReports();
      apiService.deleteTaxReport.and.nextWith({});

      component.deleteTaxReport(taxReport.id).subscribe();

      expect(component.reloadTaxReports).toHaveBeenCalled();
    });
  });
});
