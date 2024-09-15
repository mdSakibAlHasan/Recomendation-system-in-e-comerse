import { Injectable, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarService } from '../../shared/component/navbar/navbar.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard{
	constructor(
        private navbarService: NavbarService,
		private router: Router
	) {}


	isLoggedIn(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.navbarService.loginData$.subscribe({
                next: res => {
                    if (!res) {
                        this.router.navigate(['account/login']);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                },
                error: err => {
                    this.router.navigate(['account/login']);
                    resolve(false);
                }
            });
        });
    }
    
}
