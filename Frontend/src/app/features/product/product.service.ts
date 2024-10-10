import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../home/home.model';
import { ProductModel } from '../../shared/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService{
  constructor(private http: HttpClient) {
    super();
  }

  getProductById(id: string):Observable<ProductModel[]>{
    return this.http.get<ProductModel[]>(`${this.baseurl}/product/${id}/`);
  }

  getPicturesByProductId(id: string):Observable<any>{
    return this.http.get<any>(`${this.baseurl}/product/${id}/pictures`);
  }

  getCommentsByProductId(id: string):Observable<any>{
    return this.http.get<any>(`${this.baseurl}/${id}/comments/`);
  }

  createComment(data: any, product_id: number):Observable<any>{
    return this.http.post<any>(`${this.baseurl}/${product_id}/comments/`,data)
  }

  addToCart(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseurl}/cart/`,data);
  }

  viewCartStatus(productId: string):Observable<boolean>{
    return this.http.get<boolean>(`${this.baseurl}/cart/viewCart/${productId}`);
  }

  viewLikeStatus(productId: string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseurl}/like/likeStatus/${productId}`);
  }

  UpdateLikeStatus(productId: string, model: any):Observable<any>{
    return this.http.post<any>(`${this.baseurl}/like/likeStatus/${productId}`,model);
  }

  deleteLikeStatus(productId: string):Observable<any>{
    return this.http.delete<any>(`${this.baseurl}/like/likeStatus/${productId}`);
  }
}
