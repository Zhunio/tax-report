import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { FilePondFile } from 'filepond';
import { provideAutoSpy } from 'jasmine-auto-spies';
import { FilePondComponent } from 'ngx-filepond';
import { TaxReportDialogError, TaxReportDialogLabel } from '../../models/tax-report-dialog.model';
import { TaxReportDialogService } from '../../services/tax-report-dialog.service';
import { TaxReportDialogComponent } from './tax-report-dialog.component';

describe('TaxReportDialogComponent', () => {
  let s: Spectator<TaxReportDialogComponent>;

  const createComponent = createComponentFactory({
    component: TaxReportDialogComponent,
    providers: [TaxReportDialogService],
  });

  beforeEach(() => {
    s = createComponent({
      providers: [provideAutoSpy(MatDialogRef)],
    });
  });

  describe('ngOnInit()', () => {
    it('should read @ViewChild(FilePondComponent)', () => {
      expect(s.component.pond).toBeDefined();
    });

    it('should render fiscalQuarters', () => {
      const [fiscalQuarterSelect] = s.queryAll(MatSelect);
      const fiscalQuarterOptions = fiscalQuarterSelect.options.map((option) => option.value);

      expect(fiscalQuarterOptions).toEqual(s.component.fiscalQuarters());
    });

    it('should render fiscalQuarter', () => {
      const [fiscalQuarterSelect] = s.queryAll(MatSelect);

      expect(fiscalQuarterSelect.value).toEqual(s.component.fiscalQuarter());
    });

    it('should render fiscalYears', () => {
      const [, fiscalYearSelect] = s.queryAll(MatSelect);
      const fiscalYearOptions = fiscalYearSelect.options.map((option) => option.value);

      expect(fiscalYearOptions).toEqual(s.component.fiscalYears());
    });

    it('should render fiscalYear', () => {
      const [, fiscalYearSelect] = s.queryAll(MatSelect);

      expect(fiscalYearSelect.value).toEqual(s.component.fiscalYear());
    });

    it('should have pondFile set to undefined', () => {
      expect(s.component.pondFile).toBeUndefined();
    });

    it('should have pondOptions with default labelIdle', () => {
      expect(s.component.pondOptions.labelIdle).toEqual(TaxReportDialogLabel.DropFilesHere);
    });

    it('should have hasFileError set to false', () => {
      expect(s.component.hasFileError).toBe(false);
    });

    it('should render file-pond', () => {
      const filePond = s.query(FilePondComponent);

      expect(filePond).toBeDefined();
    });

    it('should render file-pond without .file-error class', () => {
      const filePond = s.query('file-pond.file-error');

      expect(filePond).toBeNull();
    });

    it('should render `Disregard Changes` button', () => {
      const disregardChangesButton = s.query(byText('Disregard Changes'));
      expect(disregardChangesButton).not.toBeNull();
    });

    it('should render `Save Changes` button', () => {
      const disregardChangesButton = s.query(byText('Save Changes'));

      expect(disregardChangesButton).not.toBeNull();
    });
  });

  describe('onPondAddFile(filePondFile)', () => {
    let filePondFile: FilePondFile;

    beforeEach(() => {
      spyOn(s.component as any, 'updateHasFileError');
      filePondFile = {} as FilePondFile;
    });

    it('should be called when onaddfile event is emitted from file-pond element', () => {
      spyOn(s.component, 'onPondAddFile');

      s.triggerEventHandler('file-pond', 'onaddfile', { file: filePondFile });

      expect(s.component.onPondAddFile).toHaveBeenCalled();
    });

    it('should call updateHasFileError(filePondFile)', () => {
      s.component.onPondAddFile(filePondFile);
      expect(s.component['updateHasFileError']).toHaveBeenCalledWith(filePondFile);
    });

    describe('when hasFileError is true', () => {
      it('should not set pondFile', () => {
        s.component.hasFileError = true;
        s.component.onPondAddFile(filePondFile);

        expect(s.component.pondFile).toBeUndefined();
      });
    });

    describe('when hasFileError is false', () => {
      it('should set pondFile', () => {
        s.component.hasFileError = false;
        s.component.onPondAddFile(filePondFile);

        expect(s.component.pondFile).toEqual(filePondFile);
      });
    });
  });

  describe('disregardChanges()', () => {
    it('should be called when `Disregard Changes` button is clicked', () => {
      spyOn(s.component, 'disregardChanges');

      const disregardChangesButton = s.query(byText('Disregard Changes'))!;
      s.click(disregardChangesButton);

      expect(s.component.disregardChanges).toHaveBeenCalled();
    });

    it('should call dialogRef.close()', () => {
      const dialogRef = s.inject(MatDialogRef);

      s.component.disregardChanges();

      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('saveChanges()', () => {
    it('should be called when `Save Changes` button is clicked', () => {
      spyOn(s.component, 'saveChanges');

      const saveChangesButton = s.query(byText('Save Changes'))!;
      s.click(saveChangesButton);

      expect(s.component.saveChanges).toHaveBeenCalled();
    });

    describe('when pondFile is valid', () => {
      it('should call updateHasFileError(pondFile)', () => {
        spyOn(s.component as any, 'updateHasFileError');

        const pondFile = {} as FilePondFile;

        s.component.pondFile = pondFile;
        s.component.saveChanges();

        expect(s.component['updateHasFileError']).toHaveBeenCalledWith(pondFile);
      });

      it('should have hasFileError set to false', () => {
        spyOn(s.component as any, 'updateHasFileError');

        s.component.hasFileError = false;
        s.component.pondFile = { file: {} } as FilePondFile;
        s.component.saveChanges();

        expect(s.component.hasFileError).toBeFalse();
      });

      it('should call dialogRef.close({ taxReport })', () => {
        spyOn(s.component as any, 'updateHasFileError');
        const dialogRef = s.inject(MatDialogRef);

        s.component.pondFile = { file: {} } as FilePondFile;
        s.component.saveChanges();

        expect(dialogRef.close).toHaveBeenCalledWith({
          taxReport: {
            fiscalQuarter: s.component.fiscalQuarter(),
            fiscalYear: s.component.fiscalYear(),
            uploadedFile: s.component.pondFile.file,
          },
        });
      });
    });

    describe('when pondFile is invalid', () => {
      it('should call updateHasFileError(pondFile)', () => {
        spyOn(s.component as any, 'updateHasFileError');

        const pondFile = {} as FilePondFile;

        s.component.pondFile = pondFile;
        s.component.saveChanges();

        expect(s.component['updateHasFileError']).toHaveBeenCalledWith(pondFile);
      });

      it('should have hasFileError set to true', () => {
        spyOn(s.component as any, 'updateHasFileError');

        s.component.hasFileError = true;
        s.component.pondFile = undefined;
        s.component.saveChanges();

        expect(s.component.hasFileError).toBeTrue();
      });

      it('should not call dialogRef.close({ taxReport })', () => {
        spyOn(s.component as any, 'updateHasFileError');

        s.component.hasFileError = true;
        s.component.pondFile = undefined;
        s.component.saveChanges();

        const dialogRef = s.inject(MatDialogRef);
        expect(dialogRef.close).not.toHaveBeenCalled();
      });
    });
  });

  describe('updateHasFileError(filePondFile)', () => {
    let taxReportDialogService: TaxReportDialogService;

    beforeEach(() => {
      taxReportDialogService = s.inject(TaxReportDialogService);

      spyOn(s.component as any, 'removeFile');
      spyOn(s.component as any, 'onTaxReportDialogError');

      s.component.fiscalYear.set(taxReportDialogService.fiscalYears()[0]);
      s.component.fiscalQuarter.set(taxReportDialogService.fiscalQuarters()[0]);
    });

    describe('when filePondFile is not defined', () => {
      it('should call onTaxReportDialogError(TaxReportDialogError.NoFileProvided)', () => {
        spyOn(taxReportDialogService, 'isValidFileExtension').and.returnValue(false);

        s.component['updateHasFileError']();

        expect(s.component['onTaxReportDialogError']).toHaveBeenCalledWith(
          TaxReportDialogError.NoFileProvided
        );
      });
    });

    describe('when filePondFile has invalid file extension', () => {
      it('should call removeFile(filePondFile)', () => {
        spyOn(taxReportDialogService, 'isValidFileExtension').and.returnValue(false);

        const filePondFile = { file: {} } as FilePondFile;
        s.component['updateHasFileError'](filePondFile);

        expect(s.component['removeFile']).toHaveBeenCalled();
      });

      it('should call onTaxReportDialogError(TaxReportDialogError.UnsupportedFileProvided)', () => {
        spyOn(taxReportDialogService, 'isValidFileExtension').and.returnValue(false);

        const filePondFile = { file: {} } as FilePondFile;
        s.component['updateHasFileError'](filePondFile);

        expect(s.component['onTaxReportDialogError']).toHaveBeenCalledWith(
          TaxReportDialogError.UnsupportedFileProvided
        );
      });
    });

    describe('when there is not error', () => {
      it('should set hasFileError set to false', () => {
        spyOn(taxReportDialogService, 'isValidFileExtension').and.returnValue(true);

        s.component.hasFileError = true;

        const filePondFile = { file: {} } as FilePondFile;
        s.component['updateHasFileError'](filePondFile);

        expect(s.component.hasFileError).toBeFalse();
      });
    });
  });

  describe('onTaxReportDialogError(taxReportDialogError)', () => {
    it('should set hasFileError to true', () => {
      s.component['onTaxReportDialogError'](TaxReportDialogError.NoFileProvided);

      expect(s.component.hasFileError).toBeTrue();
    });

    it('should call pond["pond"].setOptions({ labelIdle })', () => {
      spyOn(s.component.pond['pond'], 'setOptions');

      s.component['onTaxReportDialogError'](TaxReportDialogError.NoFileProvided);

      expect(s.component.pond['pond'].setOptions).toHaveBeenCalledWith({
        labelIdle: TaxReportDialogError.NoFileProvided,
      });
    });
  });

  describe('removeFile(filePondFile)', () => {
    it('should call pond["pond"].removeFile()', () => {
      spyOn(s.component.pond['pond'], 'removeFile');
      const filePondFile = {} as FilePondFile;

      s.component['removeFile'](filePondFile);

      expect(s.component.pond['pond'].removeFile).toHaveBeenCalledWith(filePondFile);
    });
  });
});
