import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseApiService{

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  signup(username: string, email: string, password: string ) {
    return this.http.post(this.baseurl+`/user/register/`, { username, email, password });
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.baseurl+`/user/login/`, { username, password })
}

  // logout() {
  //     localStorage.removeItem('currentUser');
  //     this.shServ.currentUserSubject.next(null);
  // }
}
