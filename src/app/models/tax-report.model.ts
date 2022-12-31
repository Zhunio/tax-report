import { IFile } from './file.model';

export interface TaxReport {
  id: number;
  fiscalQuarter: number;
  fiscalYear: number;
  file: IFile;
}

export type DialogClosedAddTaxReport = Pick<TaxReport, 'fiscalYear' | 'fiscalQuarter'> & {
  droppedFile: File;
};

export type AddTaxReport = Pick<TaxReport, 'fiscalYear' | 'fiscalQuarter'> & {
  file: IFile;
};
