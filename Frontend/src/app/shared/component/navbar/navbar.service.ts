import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PaginationProductModel } from '../../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class NavbarService extends BaseApiService{
  private isLoginSubject = new BehaviorSubject<boolean>(false);
  loginData$ = this.isLoginSubject.asObservable();
  private cartUpdateSubject = new BehaviorSubject<any>(null);
  cartData$ = this.cartUpdateSubject.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    super();
  }

  updateCartNumber(){
    this.cartUpdateSubject.next(null);
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
}
