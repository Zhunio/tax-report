import { ICellRendererParams } from 'ag-grid-community';

export interface RowActionCellParams<Data = unknown> extends ICellRendererParams<Data> {
  onDownloadRowAction?: (params: RowActionCellParams<Data>) => {};
  onDeleteRowAction?: (params: RowActionCellParams<Data>) => {};
}
