import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { RowActionCellParams } from 'src/app/models/cell-renderer.model';

@Component({
  selector: 'row-action-cell-renderer',
  template: `
    <button mat-icon-button color="primary" (click)="editAction()">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button color="warn" (click)="deleteAction()">
      <mat-icon>delete</mat-icon>
    </button>
  `,
  styleUrls: ['./row-action-cell-renderere.component.scss'],
})
export class RowActionCellRendererComponent implements ICellRendererAngularComp {
  cellParams!: RowActionCellParams;

  agInit(params: RowActionCellParams) {
    this.cellParams = params;
  }

  refresh() {
    return true;
  }

  editAction() {
    this.cellParams.editAction(this.cellParams);
  }

  deleteAction() {
    this.cellParams.deleteAction(this.cellParams);
  }
}
