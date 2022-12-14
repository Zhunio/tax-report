import { TaxReport } from './tax-report.model';

export interface TaxReportDialogData {
  taxReport: TaxReport | undefined;
}

export enum PondOtionsLabels {
  DropFilesHere = 'Drop files here...',
  NoFileProvidedError = 'No file provided. Please provide Excel Workbook file generated by QuickBooks Desktop Pro',
  UnsupportedFileProvidedError = 'Unsupported file provided. Please provide Excel Workbook file generated by QuickBooks Desktop Pro.',
}
