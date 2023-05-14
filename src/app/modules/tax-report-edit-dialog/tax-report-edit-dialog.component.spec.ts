import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAutoSpy } from 'jasmine-auto-spies';

import { TaxReportEditDialogModule } from '@/app/modules/tax-report-edit-dialog/tax-report-edit-dialog.module';
import { TaxReportEditDialogComponent } from './tax-report-edit-dialog.component';

describe('TaxReportEditDialogComponent', () => {
  let component: TaxReportEditDialogComponent;
  let fixture: ComponentFixture<TaxReportEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxReportEditDialogComponent],
      providers: [provideAutoSpy(MatDialogRef), { provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [TaxReportEditDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxReportEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
