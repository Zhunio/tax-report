import { Payment } from '@/app/models/payment.model';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, RowSelectedEvent, ValueGetterParams } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

function currencyValueGetter<T>(fieldId: keyof T) {
  return (params: ValueGetterParams<T>) => {
    const value = params.data?.[fieldId];

    if (typeof value !== 'number') {
      return 'Invalid number';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
}

@Component({
  selector: 'app-tax-report-edit-dialog',
  templateUrl: './tax-report-edit-dialog.component.html',
  styleUrls: ['./tax-report-edit-dialog.component.scss'],
})
export class TaxReportEditDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<TaxReportEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: { payments: Payment[] }
  ) {}

  @ViewChild(AgGridAngular) grid!: AgGridAngular<Payment>;

  taxExemptCustomers = ['Edy Garcia'];

  gridOptions: GridOptions<Payment> = {
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    headerHeight: 40,
    rowHeight: 30,
    defaultColDef: {
      sortable: true,
      filter: true,
    },
    columnDefs: [
      { headerName: 'Type', field: 'paymentType', width: 100 },
      { headerName: 'Date', field: 'paymentDate', width: 120 },
      { headerName: 'Number', field: 'paymentNumber', width: 120 },
      { headerName: 'Method', field: 'paymentMethod', width: 120 },
      { headerName: 'Customer', field: 'customerName', flex: 1 },
      { headerName: 'Amount', valueGetter: currencyValueGetter('calculatedAmount'), flex: 1 },
      { headerName: 'Tax', valueGetter: currencyValueGetter('calculatedTax'), flex: 1 },
      { headerName: 'Total', valueGetter: currencyValueGetter('calculatedTotal'), flex: 1 },
      { headerName: 'Exempt?', flex: 1, checkboxSelection: true },
    ],
  };

  payments$ = new BehaviorSubject(this.dialogData.payments);

  ngOnInit(): void {}

  onGridReady() {
    this.grid.api.forEachNode((node) => {
      if (this.taxExemptCustomers.includes(node.data?.customerName ?? '')) {
        node.setSelected(true);
      }
    });
  }

  onRowSelected({ data, node }: RowSelectedEvent<Payment>) {
    if (!data) {
      return;
    }

    const isTaxExempt = node.isSelected();
    if (isTaxExempt) {
      data.calculatedAmount = data.total;
      data.calculatedTax = 0;
    } else {
      data.calculatedAmount = data.total / 1.08125;
      data.calculatedTax = data.calculatedAmount * 0.08125;
    }

    data.calculatedTotal = data.calculatedAmount + data.calculatedTax;

    node.setData({ ...data });
  }
}
