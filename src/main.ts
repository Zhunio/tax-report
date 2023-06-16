import { enableProdMode, importProvidersFrom } from '@angular/core';

import { AppComponent } from '@/app/app';
import { routes } from '@/app/routes';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule)],
}).catch((err) => console.error(err));
