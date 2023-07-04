import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { FileService } from './file.service';
import { HttpClient } from '@angular/common/http';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { environment } from '../../../environments/environment';

describe('FileService', () => {
  let service: FileService;
  let mockHttp: Spy<HttpClient>;

  beforeEach(() =>
    MockBuilder(FileService).provide({
      provide: HttpClient,
      useValue: createSpyFromClass(HttpClient),
    })
  );

  beforeEach(() => MockRender());

  beforeEach(() => {
    service = ngMocks.findInstance(FileService);
    mockHttp = ngMocks.findInstance(HttpClient) as Spy<HttpClient>;
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
