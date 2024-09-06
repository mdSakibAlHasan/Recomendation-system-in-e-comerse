import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../../outside-layout/account/account.model';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  currentUserSubscription: Subscription | undefined;
  
  constructor() { 
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
}
