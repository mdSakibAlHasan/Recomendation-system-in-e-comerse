import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductStatusService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  getTredingProduct():Observable<any[]>{     
      return this.http.get<any[]>(`${this.baseurl}/like/trending`);
  }

  getStockOutProduct(size: number):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseurl}/like/stockout/${size}`)
  }
}
