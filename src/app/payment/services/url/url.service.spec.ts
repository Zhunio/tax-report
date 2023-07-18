import { ActivatedRoute, ParamMap } from '@angular/router';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { of } from 'rxjs';
import { UrlService } from './url.service';

describe('UrlService', () => {
  let s: SpectatorService<UrlService>;
  let route: Spy<ActivatedRoute>;

  const createService = createServiceFactory({
    service: UrlService,
  });

  beforeEach(() => {
    s = createService({
      providers: [provideAutoSpy(ActivatedRoute, { gettersToSpyOn: ['paramMap'] })],
    });
    route = s.inject(ActivatedRoute) as any;
  });

  describe('getUrlParam()', () => {
    it('should get url param from route.paramMap', () => {
      const paramMap = { get: () => '1' } as unknown as ParamMap;
      route.accessorSpies.getters.paramMap.and.returnValue(of(paramMap));

      s.service.getUrlParam('id').subscribe((urlParam) => expect(urlParam).toEqual('1'));
    });
  });
});
