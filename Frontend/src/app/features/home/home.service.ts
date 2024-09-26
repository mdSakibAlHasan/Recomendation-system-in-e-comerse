import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './home.model';
import { ProductModel } from '../../shared/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseApiService{
  private productSubject = new BehaviorSubject<any[]>([]);
  currentProduct = this.productSubject.asObservable();
  constructor(private http:HttpClient) {
    super();
  }

  updateProduct(product: any[]) {
    this.productSubject.next(product);
  }


  getAllProduct(): Observable<ProductModel[]>{
    return this.http.get<ProductModel[]>(`${this.baseurl}/product`);
  }

  getProductById(id: number): Observable<ProductModel>{
    return this.http.get<ProductModel>(`${this.baseurl}/product/${id}`);
  }
}
