import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperUserService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  addCategory(data: any):Observable<any>{     //{"name":"book"}
    return this.http.post<any>(`${this.baseurl}/category`,data);
  }
  updateCategory(id: number,data: any):Observable<any>{//{"name":"book"}
    return this.http.put<any>(`${this.baseurl}/category/${id}`,data);
  }
  deleteCategory(id: number):Observable<any>{
    return this.http.delete<any>(`${this.baseurl}/category/${id}`);
  }

  addBrand(id: number,data: any):Observable<any>{    //{"name":"sumsung"}
    return this.http.post<any>(`${this.baseurl}/brand/${id}`,data);
  }
  updateBrand(id: number,data: any):Observable<any>{    //{"name":"sumsung"}
    return this.http.put<any>(`${this.baseurl}/brand/${id}`,data);
  }
  deleteBrand(id: number,data: any):Observable<any>{    //{"name":"sumsung"}
    return this.http.post<any>(`${this.baseurl}/category/${id}`,data);
  }
  
}
