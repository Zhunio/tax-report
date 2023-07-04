import { AppComponent } from '@/app/app.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(() => MockBuilder(AppComponent));

  it('should create', async () => {
    const fixture = MockRender(AppComponent);

    expect(fixture.point.componentInstance).toBeDefined();
  });

  describe('goHome()', () => {
    it('should navigate to home when `Tax Report` button is clicked', async () => {
      const fixture = MockRender(AppComponent);

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const taxReportButton = await loader.getHarness(
        MatButtonHarness.with({ text: 'Tax Report' })
      );
      await taxReportButton.click();

      const router = fixture.point.injector.get(Router);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
