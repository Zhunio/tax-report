import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { RowActionCellParams } from 'src/app/models/cell-renderer.model';

@Component({
  selector: 'row-action-cell-renderer',
  template: `
    <button mat-icon-button color="primary" (click)="onDownloadRowAction()">
      <mat-icon>cloud_download</mat-icon>
    </button>
    <button mat-icon-button color="warn" (click)="onDeleteRowAction()">
      <mat-icon>delete</mat-icon>
    </button>
  `,
  styleUrls: ['./row-action-cell-renderere.component.scss'],
})
export class RowActionCellRendererComponent implements ICellRendererAngularComp {
  cellParams!: RowActionCellParams;

  agInit(params: RowActionCellParams) {
    this.cellParams = params;
    this.cellParams.eParentOfValue.classList.add('row-action-cell-renderer-parent');
  }

  refresh() {
    return true;
  }

  onDownloadRowAction() {
    this.cellParams.onDownloadRowAction?.(this.cellParams);
  }

  onDeleteRowAction() {
    this.cellParams.onDeleteRowAction?.(this.cellParams);
  }
}
