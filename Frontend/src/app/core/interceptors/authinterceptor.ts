import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, throwError,finalize, of } from 'rxjs';
// import { LoaderService } from '../../shared/components/loader/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private inject: Injector,
		// private loading: LoaderService
	) {
        console.log("Here are")
    }
    
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// this.loading.setLoading(true,req.url);
		debugger
		let authService = this.inject.get(AuthService);
		let authReq = req;

		if (authService.isLoggedIn()) authReq = this.addTokenHeader(req, authService.getToken());

		authReq = this.addRequestTimeHeader(authReq);
        console.log(authReq)

		return next.handle(authReq).pipe(
			catchError((errordata: any) => {
                console.log(errordata)
				if (errordata instanceof HttpErrorResponse && errordata.status === 401) {
					return throwError(errordata);
				}
				return throwError(errordata);
			}),
			finalize(() => {
                // this.loading.setLoading(false, req.url);
            })
		)
	}

	addTokenHeader(request: HttpRequest<any>, token: any) {
		return request.clone({
			headers: request.headers.set('Authorization', 'bearer ' + token),
		});
	}

	addRequestTimeHeader(request: HttpRequest<any>) {
		return request.clone({
			headers: request.headers.set('Request-Time', new Date().toDateString()),
		});
	}
}
