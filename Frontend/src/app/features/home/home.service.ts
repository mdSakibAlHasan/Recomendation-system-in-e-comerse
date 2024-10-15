import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel, PaginationProductModel } from '../../shared/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseApiService{
  // private productSubject = new BehaviorSubject<any[]>([]);
  // currentProduct = this.productSubject.asObservable();
  constructor(private http:HttpClient) {
    super();
  }

  // updateProduct(product: any[]) {
  //   this.productSubject.next(product);
  // }

  getAllProduct(pageNumber: number): Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/like/recommendations?page=${pageNumber}`);
  }

  getProductById(id: number): Observable<ProductModel>{
    return this.http.get<ProductModel>(`${this.baseurl}/product/${id}`);
  }
}
