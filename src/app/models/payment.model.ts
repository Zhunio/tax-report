export interface Payment {
  paymentType: string;
  paymentDate: string;
  paymentNumber: string;
  customerName: string;
  paymentMethod: string;
  total: number;
  calculatedAmount: number;
  calculatedTax: number;
  calculatedTotal: number;
}
