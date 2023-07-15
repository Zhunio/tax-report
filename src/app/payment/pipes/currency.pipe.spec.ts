import { CurrencyPipe } from '@angular/common';
import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator';

describe('CurrencyPipe', () => {
  let s: SpectatorPipe<CurrencyPipe>;

  const createPipe = createPipeFactory(CurrencyPipe);

  it('should format the given value as currency', () => {
    s = createPipe('{{ 100.00 | currency }}');

    expect(s.element).toHaveText('$100.00');
  });
});
