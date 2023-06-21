import { parse } from 'date-fns';

export function parseDate(date: string) {
  return parse(date, 'MM/dd/yyyy', new Date());
}
