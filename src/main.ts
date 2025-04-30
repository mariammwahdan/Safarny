
import { bootstrapApplication } from '@angular/platform-browser'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app/app.component'
import { appConfig } from './app/app.config'
import { provideRouter } from '@angular/router'
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes),
    ...(appConfig.providers ?? [])
  ]
})
.catch(err => console.error(err));


