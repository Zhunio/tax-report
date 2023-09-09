import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';

import { FileService } from './file.service';

describe('FileService', () => {
  let s: SpectatorService<FileService>;
  let service: FileService;
  let mockHttp: Spy<HttpClient>;

  const createService = createServiceFactory({
    service: FileService,
    providers: [provideAutoSpy(HttpClient)],
  });

  beforeEach(() => (s = createService()));

  beforeEach(() => {
    service = s.inject(FileService);
    mockHttp = s.inject(HttpClient) as any;
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  describe('downloadFile()', () => {
    it('should open new window with the following URL `/file/download/:fileId`', () => {
      spyOn(window, 'open');

      const fileId = 1;
      service.downloadFile(fileId);

      expect(window.open).toHaveBeenCalledWith(`${environment.baseUrl}/file/download/${fileId}`);
    });
  });

  describe('getFileBuffer()', () => {
    it('should make `GET /file/buffer/:fileId` request', () => {
      mockHttp.get.and.nextWith({});

      const fileId = -1;
      service.getFileBuffer(fileId).subscribe();

      expect(mockHttp.get).toHaveBeenCalledWith(`${environment.baseUrl}/file/buffer/${fileId}`);
    });
  });
});
