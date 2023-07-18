import { Payment } from '../../api/models/payment.model';

export function getMockedPayments(): Payment[] {
  return [
    {
      id: 1233,
      type: 'Payment',
      date: '03/25/2020',
      number: '661661455',
      name: 'Scott Hecht',
      method: 'Check',
      amount: '486.56',
      isExempt: false,
      price: '100.00',
      tax: '8.13',
      total: '108.13',
    },
  ];
}
