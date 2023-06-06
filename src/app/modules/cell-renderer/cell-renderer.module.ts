import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { RowActionCellRendererComponent } from './row-action-cell-renderer/row-action-cell-renderer.component';
import { CommonModule } from '@angular/common';
import { CheckboxCellRendererComponent } from '@/app/modules/cell-renderer/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { FormsModule } from '@angular/forms';

const components = [RowActionCellRendererComponent, CheckboxCellRendererComponent];

@NgModule({
  exports: [...components],
  declarations: [...components],
  imports: [CommonModule, MatIconModule, MatCheckboxModule, FormsModule],
})
export class CellRendererModule {}
