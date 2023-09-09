import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';

import { NotificationService } from './notification.service';

@Component({
  standalone: true,
  selector: 'simple-notification',
  template: 'simple-notification',
  providers: [NotificationService],
  imports: [MatSnackBarModule],
})
class SimpleNotificationComponent {
  constructor(private readonly snackBar: MatSnackBar) {}

  openErrorMessage() {
    return this.snackBar.open('Error message');
  }
}

describe('NotificationService', () => {
  let s: Spectator<SimpleNotificationComponent>;

  const createComponent = createComponentFactory({
    component: SimpleNotificationComponent,
  });

  beforeEach(() => {
    s = createComponent();
  });

  it('should open error message', () => {
    s.component.openErrorMessage();

    expect(s.query(byText('Error message'), { root: true })).toBeVisible();
  });
});
