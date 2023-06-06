import { MatCheckboxChange } from '@angular/material/checkbox';
import { ICellRendererParams } from 'ag-grid-community';

export interface RowActionCellParams<Data = unknown> extends ICellRendererParams<Data> {
  onDownloadRowAction?: (params: RowActionCellParams<Data>) => {};
  onDeleteRowAction?: (params: RowActionCellParams<Data>) => {};
}

export interface CheckboxCellRendererParams<Data = any> extends ICellRendererParams<Data> {
  onCheckboxChange?: (checkboxChangeEvent: CheckboxChangeEvent<Data>) => {};
}

export type CheckboxChangeEvent<Data> = CheckboxCellRendererParams<Data> & MatCheckboxChange;
