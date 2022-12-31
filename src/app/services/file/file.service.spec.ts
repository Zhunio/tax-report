import { ObserverSpy } from '@hirez_io/observer-spy';
import { IFile } from 'src/app/models/file.model';
import { FileService } from './file.service';

describe('FileService', () => {
  let fileService: FileService;
  let spy: ObserverSpy<IFile>;

  beforeEach(() => {
    fileService = new FileService();
    spy = new ObserverSpy({ expectErrors: true });
  });

  it('should upload tax report file', () => {
    const file = new File([''], 'valid.xlsx', { type: '' });
    const expectedFile: IFile = { id: 1, name: 'valid.xlsx', url: 'valid.xlsx' };

    fileService.uploadFile(file).subscribe(spy);

    expect(spy.getLastValue()).toEqual(expectedFile);
  });

  it('should remove file', () => {
    const file: IFile = { id: 1, name: 'valid.xlsx', url: 'valid.xlsx' };

    fileService.files$.next([file]);
    fileService.deleteFile(file).subscribe(spy);

    expect(spy.getLastValue()).toEqual(file);
  });

  it('should throw an error when removing file that does not exists', () => {
    const file: IFile = { id: 1, name: 'valid.xlsx', url: 'valid.xlsx' };

    fileService.deleteFile(file).subscribe(spy);

    expect(spy.getError()).toEqual(new Error('File does not exists'));
  });
});
