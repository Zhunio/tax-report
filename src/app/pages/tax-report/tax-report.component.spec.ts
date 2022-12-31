import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';
import { DialogClosedAddTaxReport, TaxReport } from 'src/app/models';
import { IFile } from 'src/app/models/file.model';
import { TaxReportDialogComponent } from 'src/app/modules';
import { TaxReportService } from 'src/app/services';
import { FileService } from 'src/app/services/file/file.service';
import { TaxReportComponent } from './tax-report.component';
import { TaxReportModule } from './tax-report.module';

describe('TaxReportComponent', () => {
  let spectator: Spectator<TaxReportComponent>;
  let component: TaxReportComponent;

  let dialog: Spy<MatDialog>;
  let dialogRef: Spy<MatDialogRef<TaxReportDialogComponent>>;

  let fileService: Spy<FileService>;
  let taxReportService: Spy<TaxReportService>;

  const createComponent = createComponentFactory({
    component: TaxReportComponent,
    imports: [TaxReportModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      providers: [
        provideAutoSpy(MatDialog),
        provideAutoSpy(MatDialogRef),
        provideAutoSpy(FileService),
        provideAutoSpy(TaxReportService),
      ],
    });

    component = spectator.component;
    dialog = spectator.inject<any>(MatDialog);
    dialogRef = spectator.inject<any>(MatDialogRef);
    fileService = spectator.inject<any>(FileService);
    taxReportService = spectator.inject<any>(TaxReportService);

    dialog.open.and.returnValue(dialogRef);
  });

  describe('addTaxReport()', () => {
    it('should open dialog', () => {
      dialogRef.afterClosed.and.nextWith(undefined);

      component.addTaxReport();

      expect(dialog.open).toHaveBeenCalledWith(TaxReportDialogComponent);
    });

    describe('when dialog is dismissed', () => {
      it('should not upload file', () => {
        dialogRef.afterClosed.and.nextWith(undefined);

        component.addTaxReport();

        expect(fileService.uploadFile).not.toHaveBeenCalled();
      });

      it('should not create tax report', () => {
        dialogRef.afterClosed.and.nextWith(undefined);

        component.addTaxReport();

        expect(taxReportService.addTaxReport).not.toHaveBeenCalled();
      });
    });

    describe('when dialog is closed with `Save Changes` action', () => {
      it('should upload file', () => {
        const droppedFile = {} as File;
        const dialogClosedAddTaxReport = {
          fiscalQuarter: 1,
          fiscalYear: 2023,
          droppedFile,
        } as DialogClosedAddTaxReport;
        const uploadedFile = {} as IFile;

        dialogRef.afterClosed.and.nextWith(dialogClosedAddTaxReport);
        fileService.uploadFile.and.nextWith(uploadedFile);
        taxReportService.addTaxReport.and.nextWith({} as TaxReport);

        component.addTaxReport();

        expect(fileService.uploadFile).toHaveBeenCalledWith(droppedFile);
        expect(taxReportService.addTaxReport).toHaveBeenCalledWith({
          fiscalQuarter: dialogClosedAddTaxReport.fiscalQuarter,
          fiscalYear: dialogClosedAddTaxReport.fiscalYear,
          file: uploadedFile,
        });
      });
    });
  });

  describe('editTaxReport()', () => {
    it('should open dialog', () => {
      dialogRef.afterClosed.and.nextWith(undefined);

      component.editTaxReport();

      expect(dialog.open).toHaveBeenCalledWith(TaxReportDialogComponent);
    });
  });
});
