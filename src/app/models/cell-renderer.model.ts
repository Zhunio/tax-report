import { ICellRendererParams } from 'ag-grid-community';


export interface RowActionCellParams<Data = unknown>
  extends ICellRendererParams<Data> {
  deleteAction(params: RowActionCellParams<Data>): void;
  editAction(params: RowActionCellParams<Data>): void;
}
