import { compareAsc, parse } from 'date-fns';
import { PaymentDto } from '../shared/services/api/api.model';

export function byDate(a: PaymentDto, b: PaymentDto) {
  return compareAsc(
    parse(a.date, 'MM/dd/yyyy', new Date()),
    parse(b.date, 'MM/dd/yyyy', new Date())
  );
}
