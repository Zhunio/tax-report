import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { IFile } from 'src/app/models/file.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  files$ = new BehaviorSubject<IFile[]>([]);

  uploadFile(file: File): Observable<IFile> {
    const files = this.files$.value;

    const newFile: IFile = { id: files.length + 1, name: file.name, url: file.name };

    this.files$.next([...files, newFile]);

    return of(newFile);
  }

  deleteFile(file: IFile) {
    const files = this.files$.value;
    const fileIndex = files.findIndex(({ id: fileId }) => fileId === file.id);
    const deletedFile = fileIndex >= 0 && files.splice(fileIndex, 1)[0];

    return deletedFile ? of(deletedFile) : throwError(() => new Error('File does not exists'));
  }
}
