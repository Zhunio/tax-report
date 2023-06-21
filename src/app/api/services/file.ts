import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FileService {
  private http = inject(HttpClient);

  downloadFile(fileId: number) {
    return window.open(`${environment.baseUrl}/file/download/${fileId}`);
  }

  getFileBuffer(fileId: number) {
    return this.http.get<{ type: 'Buffer'; data: Buffer }>(
      `${environment.baseUrl}/file/buffer/${fileId}`
    );
  }
}
