import { Injectable, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarService } from '../../shared/component/navbar/navbar.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements OnInit{
    isAuthenticated: boolean = false;
	constructor(
		private authService: NavbarService,
        private navbarService: NavbarService,
		private router: Router
	) {}

    ngOnInit(): void {
        this.navbarService.loginData$.subscribe((loginStatus) => {
            this.isAuthenticated = loginStatus;
        });
        // this.authService.getUserDetails().subscribe({
        //     next: res=>{
        //         if(res){
        //             this.isAuthenticated = true;
        //         }else{
        //             this.isAuthenticated = false;
        //         }
        //     },
        //     error: err=>{
        //         this.isAuthenticated = false;
        //     }
        // })
    }

	isLogedIn(){
        debugger
        this.navbarService.loginData$.subscribe({
            next: res=>{
                if(!res){
                    this.router.navigate(['account/login']);
                    return false;
                }else{
                    return true;
                }
            },
            error: err=>{
                this.router.navigate(['account/login']);
                return false;
            }
           
        });
        return false;
    }
}
