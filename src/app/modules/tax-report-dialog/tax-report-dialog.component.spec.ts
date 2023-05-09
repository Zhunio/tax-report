import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { byText, createComponentFactory, Spectator } from '@ngneat/spectator';
import { FilePondComponent } from 'ngx-filepond';

import { TaxReportModule } from 'src/app/pages/tax-report/tax-report.module';

import { MatOption } from '@angular/material/core';
import { FilePond, FilePondFile } from 'filepond';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';
import { PondOtionsLabels } from 'src/app/models';
import { TaxReportDialogComponent } from './tax-report-dialog.component';

describe('TaxReportDialogComponent', () => {
  let spectator: Spectator<TaxReportDialogComponent>;
  let component: TaxReportDialogComponent;

  let dialogRef: Spy<MatDialogRef<TaxReportDialogComponent>>;

  let fiscalQuarterLabel: Element;
  let fiscalQuarterSelect: MatSelect;

  let fiscalYearLabel: Element;
  let fiscalYearSelect: MatSelect;

  let pondComponent: FilePondComponent;
  let pondEl: Element;
  let pond: FilePond;

  let disregardChangesBtn: Element;
  let saveChangesBtn: Element;

  const createComponent = createComponentFactory({
    component: TaxReportDialogComponent,
    imports: [TaxReportModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      providers: [provideAutoSpy(MatDialogRef)],
    });
    component = spectator.component;
    dialogRef = spectator.inject<any>(MatDialogRef);

    fiscalQuarterLabel = spectator.query(byText('Fiscal Quarter'))!;
    fiscalQuarterSelect = spectator.queryAll(MatSelect)[0]!;

    fiscalYearLabel = spectator.query(byText('Fiscal Year'))!;
    fiscalYearSelect = spectator.queryAll(MatSelect)[1]!;

    pondComponent = spectator.query(FilePondComponent)!;
    pondEl = spectator.query('file-pond')!;
    pond = pondComponent['pond'];

    disregardChangesBtn = spectator.query(byText('Disregard Changes'))!;
    saveChangesBtn = spectator.query(byText('Save Changes'))!;
  });

  describe('ngOnInit()', () => {
    it('should not have any file uploaded', () => {
      expect(component.pondFile).toBeUndefined();
    });

    it('should render fiscal quarter', () => {
      expect(fiscalQuarterLabel).toBeTruthy();
      expect(fiscalQuarterSelect.value).toEqual(component.fiscalQuarter.value);
    });

    it('should render fiscal year', () => {
      expect(fiscalYearLabel).toBeTruthy();
      expect(fiscalYearSelect.value).toEqual(component.fiscalYear.value);
    });

    it('should render fiscal quarter options after clicking fiscal quarter select', () => {
      spectator.click(fiscalQuarterSelect._elementRef);

      const fiscalQuarterOptions = spectator.queryAll(MatOption).map((option) => option.value);

      expect(fiscalQuarterOptions).toEqual(component.fiscalQuarters);
    });

    it('should render fiscal year options after clicking fiscal year select', () => {
      spectator.click(fiscalYearSelect._elementRef);

      const fiscalYearOptions = spectator.queryAll(MatOption).map((option) => option.value);

      expect(fiscalYearOptions).toEqual(component.fiscalYears);
    });

    it('should render filepond', () => {
      expect(pondComponent).toBeTruthy();
      expect(pond.files).toEqual([]);
    });

    it('should render filepond with not error class', () => {
      pondEl = spectator.query('.file-error')!;

      expect(pondEl).toBeNull();
    });

    it('should render `Disregard Changes` button', () => {
      expect(disregardChangesBtn).toBeTruthy();
    });

    it('should render `Save Changes` button', () => {
      expect(saveChangesBtn).toBeTruthy();
    });
  });

  describe('onPondAddFile()', () => {
    describe('when not file is provided', () => {
      it('should not update file', () => {
        const file = undefined;

        spectator.triggerEventHandler(FilePondComponent, 'onaddfile', { file });

        expect(component.pondFile).toBeUndefined();
      });
    });

    describe('when unsupported file is provided', () => {
      it('should not update file', () => {
        const file = {
          file: new File([''], 'invalid.pdf', { type: '' }),
        } as unknown as FilePondFile;

        spectator.triggerEventHandler(FilePondComponent, 'onaddfile', { file });

        expect(component.pondFile).toBeUndefined();
      });
    });

    describe('when valid file is provided', () => {
      it('should update file', () => {
        const file = {
          file: new File([''], 'valid.xlsx', { type: '' }),
        } as unknown as FilePondFile;

        spectator.triggerEventHandler(FilePondComponent, 'onaddfile', { file });

        expect(component.pondFile).toEqual(file);
      });
    });
  });

  describe('disregardChanges()', () => {
    it('should close dialog after clicking `Disregard Changes`', () => {
      spectator.click(disregardChangesBtn);

      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('saveChanges()', () => {
    describe('when not file is provided', () => {
      it('should not close dialog', () => {
        component.pondFile = undefined;

        spectator.click(saveChangesBtn);

        expect(dialogRef.close).not.toHaveBeenCalled();
      });
    });

    describe('when unsupported file is provided', () => {
      it('should not close dialog', () => {
        component.pondFile = {
          file: new File([''], 'invalid.pdf', { type: '' }),
        } as unknown as FilePondFile;

        spectator.click(saveChangesBtn);

        expect(dialogRef.close).not.toHaveBeenCalled();
      });
    });

    describe('when valid file is provided', () => {
      it('should close dialog', () => {
        const file = {
          file: new File([''], 'report.xlsx', { type: '' }),
        } as unknown as FilePondFile;

        const expectedCloseValue = {
          fiscalQuarter: component.fiscalQuarter.value,
          fiscalYear: component.fiscalYear.value,
          droppedFile: file.file,
        };

        component.pondFile = file;

        spectator.click(saveChangesBtn);

        expect(dialogRef.close).toHaveBeenCalledWith(expectedCloseValue);
      });
    });
  });

  describe('updateHasFileError()', () => {
    describe('when not file is provided', () => {
      it('should show file error class', () => {
        component.pondFile = undefined;

        spectator.click(saveChangesBtn);

        expect(component.hasFileError).toBeTrue();
        expect(spectator.query('.file-error')!).toBeTruthy();
      });

      it('should show not file provided error message', () => {
        component.pondFile = undefined;

        spectator.click(saveChangesBtn);

        expect(pond.labelIdle).toEqual(PondOtionsLabels.NoFileProvidedError);
      });
    });

    describe('when invalid file is provided', () => {
      it('should show file error class', () => {
        component.pondFile = {
          file: new File([''], 'invalid.pdf', { type: '' }),
        } as unknown as FilePondFile;

        spectator.click(saveChangesBtn);

        expect(component.hasFileError).toBeTrue();
        expect(spectator.query('.file-error')!).toBeTruthy();
      });

      it('should remove provided file', () => {
        spyOn(pond, 'removeFile');

        component.pondFile = {
          id: 1,
          file: new File([''], 'invalid.pdf', { type: '' }),
        } as unknown as FilePondFile;

        spectator.click(saveChangesBtn);

        // @ts-ignore
        expect(pond['removeFile']).toHaveBeenCalledWith(component.pondFile);
      });

      it('should show unsupported file provided error message', () => {
        component.pondFile = {
          id: 1,
          file: new File([''], 'invalid.pdf', { type: '' }),
        } as unknown as FilePondFile;

        spectator.click(saveChangesBtn);

        expect(pond.labelIdle).toEqual(PondOtionsLabels.UnsupportedFileProvidedError);
      });
    });
  });
});
