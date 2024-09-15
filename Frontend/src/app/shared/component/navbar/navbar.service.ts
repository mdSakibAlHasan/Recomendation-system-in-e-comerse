import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  getCartNumber():Observable<{'cart_count': number}>{
    return this.http.get<{'cart_count': number}>(`${this.baseurl}/cart/count`);
  }

  getCartItem():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/cart`);
  }
}
