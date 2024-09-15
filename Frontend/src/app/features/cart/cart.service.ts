import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseApiService{
  selectedItems: any[] = [];
  totalPrice: number = 0;
  constructor(private http: HttpClient) {
    super();
  }

  getCartItem():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/cart`);
  }

  updateCartItems(data: any[]):Observable<any>{
    return this.http.patch<any>(`${this.baseurl}/cart/`,{updates: data})
  }

  getSelectedItems(){
    return this.selectedItems;
  }

  getTotalPrice(){
    return this.totalPrice;
  }

}
