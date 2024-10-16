import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel, PaginationProductModel } from '../../shared/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseApiService{
  private productSubject = new BehaviorSubject<any>({});
  currentProduct = this.productSubject.asObservable();
  constructor(private http:HttpClient) {
    super();
  }

  updateProduct(searchText: string, categoryID: number) {
    this.productSubject.next({ searchText, categoryID });
  }

  getAllProduct(pageNumber: number): Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/like/recommendations?page=${pageNumber}`);
  }

  getProductById(id: number): Observable<ProductModel>{
    return this.http.get<ProductModel>(`${this.baseurl}/product/${id}`);
  }

  updateProductInfo2(id: number, page: number):Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/product/?page=${page}&CategoryID=${id}`)
  }

  updateProductBySearch(searchText: string, page: number):Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/product/?page=${page}&search=${searchText}`);
  }

  updateProductInfo(categoryID: number,searchText: string, price_lt: number, price_gt: number,  page: number, ordering: string):Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/product/?CategoryID=${categoryID==0?'':categoryID}&ordering=${ordering}&page=${page}&price__gt=${price_gt==-Infinity?'':price_gt}&price__lt=${price_lt==Infinity?'':price_lt}&search=${searchText}`);
  }

}
