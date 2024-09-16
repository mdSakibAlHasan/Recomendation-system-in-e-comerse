import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  getUserDetails():Observable<any>{
    return this.http.get<any>(`${this.baseurl}/user/details`);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put<any>(this.baseurl + '2/', userData);  // Use the logged-in user's ID
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(this.baseurl + 'change-password/', passwordData);
  }

  getOrderHistory(): Observable<any> {
    return this.http.get<any>(this.baseurl + '2/orders');  // Replace with actual order API
  }
}
