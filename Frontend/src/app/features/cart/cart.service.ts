import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseApiService{
  selectedItems: any[] = [];
  constructor(private http: HttpClient) {
    super();
  }

  getCartItem():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/cart`);
  }

  getSelectedItems(){
    return this.selectedItems;
  }

}
