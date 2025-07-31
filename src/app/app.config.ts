import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideInterceptors } from './core/interceptors/interceptor.providers';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '@environments/environment';
import { ImageOff, ListMusic, Loader2, LogOut, LucideAngularModule, Music, PlusCircle, Search, Trash, Trash2, XCircle,  } from 'lucide-angular';

const listIcons = {
  Music, ImageOff, Loader2, ListMusic, XCircle, LogOut, PlusCircle, Search,
  Trash, Trash2
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideInterceptors(), 
    provideFirebaseApp(() => 
      initializeApp(environment.firebaseConfig)
    ), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()),
    importProvidersFrom([
      LucideAngularModule.pick(listIcons),
    ])
  ]
};
