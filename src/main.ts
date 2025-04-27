// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

// main.ts
import { bootstrapApplication } from '@angular/platform-browser'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app/app.component'
import { appConfig } from './app/app.config'

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    ...(appConfig.providers ?? [])
  ]
})
.catch(err => console.error(err))
