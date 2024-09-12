import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export function tokenGetter() {
	return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(),		
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withFetch(), 
    withInterceptorsFromDi()),
		importProvidersFrom(HttpClientModule),
    // importProvidersFrom(
		// 	JwtModule.forRoot({
		// 		config: {
		// 			tokenGetter: tokenGetter,
		// 			allowedDomains: [],
		// 			disallowedRoutes: [],
		// 		},
		// 	})
		// ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
};
