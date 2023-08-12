import { IFile } from '@/app/shared/services/file/file.model';

export interface TaxReportDto {
  id: number;
  fiscalQuarter: number;
  fiscalYear: number;
  fileId: number | null;
  file: IFile;
  payments: PaymentDto[];
}

export interface TaxReportCreateDto {
  fiscalQuarter: number;
  fiscalYear: number;
  uploadedFile: File;
}

export interface PaymentDto {
  id: number;
  type: string;
  date: string;
  number: string;
  method: string;
  name: string;
  amount: string;
  isExempt: boolean;
}

export interface PaymentUpdateDto {
  isExempt?: boolean;
}
