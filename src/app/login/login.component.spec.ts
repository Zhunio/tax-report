import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let s: Spectator<LoginComponent>;
  let loader: HarnessLoader;

  const createComponent = createComponentFactory({
    component: LoginComponent,
    imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  });

  beforeEach(() => {
    s = createComponent();

    loader = TestbedHarnessEnvironment.loader(s.fixture);
  });

  it('should create', () => {
    expect(s.component).toBeTruthy();
  });
});
