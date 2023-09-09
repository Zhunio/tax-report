import { PaymentDto } from '../shared/services/api/api.model';

export interface Payment extends PaymentDto {
  price: string;
  tax: string;
  total: string;
}

export interface Report {
  month: string;
  taxableSales: string;
  nonTaxableSales: string;
  netTaxableSales: string;
}
