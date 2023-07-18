import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  breakpointObserver = inject(BreakpointObserver);

  isXSmall = this.isMatched(Breakpoints.XSmall);
  isSmall = this.isMatched(Breakpoints.Small);
  isMedium = this.isMatched(Breakpoints.Medium);
  isLarge = this.isMatched(Breakpoints.Large);
  isXLarge = this.isMatched(Breakpoints.XLarge);

  isMatched(value: string | readonly string[]) {
    return toSignal(this.breakpointObserver.observe(value).pipe(map(({ matches }) => matches)));
  }
}
