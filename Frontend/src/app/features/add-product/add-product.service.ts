import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddProductService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseurl}/productManagement`, formData);
  }

  updateProduct(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseurl}/productManagement`, formData);
  }

  getCategory():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/category`);
  }

  getBrand(categoryID: number):Observable<any>{
    return this.http.get<any>(`${this.baseurl}/brand/${categoryID}`);
  }
}
