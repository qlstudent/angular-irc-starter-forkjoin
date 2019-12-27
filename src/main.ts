import './polyfills';

import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

declare global {
  interface Window {
    ngRef: NgModuleRef<AppModule>;
  }
}

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window.ngRef) {
    window.ngRef.destroy();
  }
  window.ngRef = ref;

  // Otherise, log the boot error
}).catch(err => console.error(err));
