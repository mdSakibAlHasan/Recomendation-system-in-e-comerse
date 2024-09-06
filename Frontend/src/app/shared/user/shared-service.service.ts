import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../../outside-layout/account/account.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  currentUserSubscription: Subscription | undefined;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    let storedUser: string | null = null;
    
    if (isPlatformBrowser(this.platformId)) {
      storedUser = localStorage.getItem('currentUser');
    }

    this.currentUserSubject = new BehaviorSubject<User>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
}
