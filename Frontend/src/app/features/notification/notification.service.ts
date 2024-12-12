import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utility/base-api-service';
import { Observable } from 'rxjs';
import { NotificationModel } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseApiService {

  constructor(private http:HttpClient) { 
    super()
  }

  getNotifications(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.baseurl}/notification`);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.baseurl}/notification/${notificationId}`,'');
  }

}
