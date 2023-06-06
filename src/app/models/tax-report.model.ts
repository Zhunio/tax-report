import { Payment } from '@/app/models/payment.model';
import { File as IFile } from 'src/app/models/file.model';

export interface TaxReport {
  id: number;
  fiscalQuarter: number;
  fiscalYear: number;
  fileId: number | null;
  file: IFile;
  payments: Payment[];
}

export interface TaxReportGrid extends TaxReport {
  fileName: string;
}

export interface TaxReportCreate {
  fiscalQuarter: number;
  fiscalYear: number;
  fileName: string;
  fileDestination: string;
  uploadedFile: File;
}

export interface TaxReportEdit {
  id: number;
  fileId: number;
  fiscalQuarter?: number;
  fiscalYear?: number;
  fileName?: string;
  fileDestination?: string;
  file?: File;
}

export interface TaxReportCreateDialogResult {
  taxReport: TaxReportCreate;
}
