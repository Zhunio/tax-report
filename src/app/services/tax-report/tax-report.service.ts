import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FileService } from 'src/app/services/file/file.service';
import { environment } from 'src/environments/environment';
import { TaxReport, TaxReportCreate } from '../../models/tax-report.model';

@Injectable({ providedIn: 'root' })
export class TaxReportService {
  constructor(private http: HttpClient, private fileService: FileService) {}

  getTaxReports() {
    return this.http.get<TaxReport[]>(`${environment.baseUrl}/tax-report`);
  }

  createTaxReport({
    fiscalQuarter,
    fiscalYear,
    fileName,
    fileDestination,
    uploadedFile,
  }: TaxReportCreate) {
    const formData = new FormData();

    formData.append('fiscalQuarter', fiscalQuarter.toString());
    formData.append('fiscalYear', fiscalYear.toString());
    formData.append('fileName', fileName);
    formData.append('fileDestination', fileDestination);
    formData.append('file', uploadedFile);

    return this.http.post(`${environment.baseUrl}/tax-report`, formData);
  }

  deleteTaxReport(taxReportId: number) {
    return this.http.delete(`${environment.baseUrl}/tax-report/${taxReportId}`);
  }
}
