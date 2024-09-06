import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './home.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseApiService{

  constructor(private http:HttpClient) {
    super();
  }

  getAllProduct(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseurl}/product`);
  }

  getProductById(id: number): Observable<Product>{
    return this.http.get<Product>(`${this.baseurl}/product/${id}`);
  }
}
