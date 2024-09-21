import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuperUserService extends BaseApiService{

  constructor(private http: HttpClient) {
    super();
  }

  
}
