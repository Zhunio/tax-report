import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable()
export class UrlService {
  constructor(private route: ActivatedRoute) {}

  getUrlParam(paramName: string) {
    return this.route.paramMap.pipe(map((paramMap) => paramMap.get(paramName)));
  }
}
