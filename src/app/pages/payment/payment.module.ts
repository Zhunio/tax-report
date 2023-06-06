import { PaymentRoutingModule } from '@/app/pages/payment/payment-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PaymentComponent } from './payment.component';

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, PaymentRoutingModule, MatIconModule, MatTableModule, MatCheckboxModule],
})
export class PaymentModule {}
