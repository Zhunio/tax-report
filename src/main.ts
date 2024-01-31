import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AppComponent } from '@/app/app.component';
import { routes } from '@/app/routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { authInterceptor } from './app/shared/services/auth/auth.interceptor';
import { AuthService } from './app/shared/services/auth/auth.service';
import { SessionStorageService } from './app/shared/services/session-storage/session-storage.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    SessionStorageService,
    AuthService,
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
