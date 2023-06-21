import { ApiService } from '@/app/api/services/api';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable()
export class UrlService {
  private api = inject(ApiService);

  getUrlParam(paramName: string) {
    const route = inject(ActivatedRoute);

    return route.paramMap.pipe(map((paramMap) => paramMap.get(paramName)));
  }
}
