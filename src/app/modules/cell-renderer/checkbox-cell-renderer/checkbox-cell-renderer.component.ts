import { CheckboxCellRendererParams } from '@/app/models';
import { Component } from '@angular/core';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'checkbox-cell-renderer',
  template: `<mat-checkbox (change)="onChange($event)" [(ngModel)]="isChecked"></mat-checkbox>`,
  styleUrls: ['./checkbox-cell-renderer.component.scss'],
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {
  isChecked = false;
  private params!: CheckboxCellRendererParams;

  // gets called once before the renderer is used
  agInit(params: CheckboxCellRendererParams) {
    if (!params.data) {
      return console.error('Please provide data to work with');
    }
    if (!params.colDef?.field) {
      return console.error('Please provide field');
    }

    this.isChecked = !!params.value;
    this.params = params;
  }

  refresh() {
    return false;
  }

  onChange({ source, checked }: MatCheckboxChange) {
    this.params.setValue?.(checked);
    this.params.onCheckboxChange?.({ ...this.params, source, checked });
  }
}
