import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class FileService {
  constructor(private readonly http: HttpClient) { }

  downloadFile(fileId: number) {
    return window.open(`${environment.baseUrl}/file/download/${fileId}`);
  }

  getFileBuffer(fileId: number) {
    return this.http.get<{ type: 'Buffer'; data: Buffer }>(
      `${environment.baseUrl}/file/buffer/${fileId}`
    );
  }
}
