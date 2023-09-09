import { TaxReportCreateDto } from '../shared/services/api/api.model';

export type TaxReportCreateDialogResult =
  | {
      taxReport: TaxReportCreateDto;
    }
  | null
  | undefined;
