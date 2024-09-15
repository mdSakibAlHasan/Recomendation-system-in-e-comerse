import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../home/home.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  getProductById(id: string):Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseurl}/product/${id}/`);
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
}
