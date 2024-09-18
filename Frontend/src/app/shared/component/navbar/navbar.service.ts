import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService extends BaseApiService{
  private isLoginSubject = new BehaviorSubject<boolean>(false);
  loginData$ = this.isLoginSubject.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    super();
  }

  updateLoginInfo(isLogin: boolean) {
    this.isLoginSubject.next(isLogin);
  }

  getCartNumber():Observable<{'cart_count': number}>{
    return this.http.get<{'cart_count': number}>(`${this.baseurl}/cart/count`);
  }

  getUserDetails():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/user/details`);
  }

  getCategory():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/category`);
  }

  updateProductInfo(id: number):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseurl}/product/?CategoryID=${id}`)
  }
}
