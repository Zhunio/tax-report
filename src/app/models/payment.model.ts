export interface Payment {
  id: number;
  type: string;
  date: string;
  number: string;
  method: string;
  name: string;
  amount: string;
  isExempt: boolean;
  price: string;
  tax: string;
  total: string;
}

export interface PaymentUpdateDto {
  isExempt?: boolean;
}

export interface Report {
  month: string;
  taxableSales: string;
  nonTaxableSales: string;
  netTaxableSales: string;
}
