import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RowActionCellRendererComponent } from './row-action-cell-renderer/row-action-cell-renderer.component';

const components = [RowActionCellRendererComponent];

@NgModule({
  exports: [...components],
  declarations: [...components],
  imports: [MatIconModule],
})
export class CellRendererModule {}
