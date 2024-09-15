// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(@Inject(PLATFORM_ID) private platformId: any) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let token = '';

//     // Check if we are in the browser environment
//     if (isPlatformBrowser(this.platformId)) {
//       token = localStorage.getItem('currentUser') || '';
//     }

//     // Clone the request and add the token to the headers if available
//     const clonedRequest = req.clone({
//       setHeaders: {
//         Authorization: token ? `Bearer ${token}` : ''
//       }
//     });

//     // Pass the cloned request to the next handler
//     return next.handle(clonedRequest);
//   }
// }

import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, throwError,finalize, of } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private inject: Injector
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let authService = this.inject.get(AuthService);
		let authReq = req;

		if (authService.isLoggedIn()) authReq = this.addTokenHeader(req, authService.getToken());

		authReq = this.addRequestTimeHeader(authReq);

		return next.handle(authReq).pipe(
			catchError((errordata: any) => {
				if (errordata instanceof HttpErrorResponse && errordata.status === 401) {
					return throwError(errordata);
				}
				return throwError(errordata);
			}),
			finalize(() => {
              
      })
		)
	}

	addTokenHeader(request: HttpRequest<any>, token: any) {
		return request.clone({
			headers: request.headers.set('Authorization', `Bearer ${token}`),
		});
	}

	addRequestTimeHeader(request: HttpRequest<any>) {
		return request.clone({
			headers: request.headers.set('Request-Time', new Date().toDateString()),
		});
	}
}
