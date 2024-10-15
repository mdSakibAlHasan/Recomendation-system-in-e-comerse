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

  updateProductInfo(id: number, page: number):Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/product/?page=${page}&CategoryID=${id}`)
  }

  updateProductBySearch(searchText: string, page: number):Observable<PaginationProductModel>{
    return this.http.get<PaginationProductModel>(`${this.baseurl}/product/?page=${page}&search=${searchText}`);
  }
}
