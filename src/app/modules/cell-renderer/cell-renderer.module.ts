import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RowActionCellRendererComponent } from './row-action-cell-renderer/row-action-cell-renderer.component';
import { CommonModule } from '@angular/common';

const components = [RowActionCellRendererComponent];

@NgModule({
  exports: [...components],
  declarations: [...components],
  imports: [CommonModule, MatIconModule],
})
export class CellRendererModule {}
