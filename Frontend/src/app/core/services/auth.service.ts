import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('currentUser');
      return token;
    } else {
      console.log('SSR: localStorage is not available');
      return null;
    }
  }

  saveToken(tokenData: { accessToken: string }) {
    if (isPlatformBrowser(this.platformId)) {
      this.logOut();
      localStorage.setItem('currentUser', tokenData.accessToken);
    } else {
      console.log('SSR: cannot save token in localStorage');
    }
  }

  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('User_Name');
    } else {
      console.log('SSR: localStorage is not available');
    }
  }
}
