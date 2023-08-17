import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable()
export class BreakpointService {
  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  isXSmall = this.isMatched(Breakpoints.XSmall);
  isSmall = this.isMatched(Breakpoints.Small);
  isMedium = this.isMatched(Breakpoints.Medium);
  isLarge = this.isMatched(Breakpoints.Large);
  isXLarge = this.isMatched(Breakpoints.XLarge);

  isMatched(value: string) {
    return toSignal(this.breakpointObserver.observe(value).pipe(map(({ matches }) => matches)));
  }
}
