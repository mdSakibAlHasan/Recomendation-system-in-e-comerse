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
		private router: Router
	) {}

    ngOnInit(): void {
        this.authService.getUserDetails().subscribe({
            next: res=>{
                if(res){
                    this.isAuthenticated = true;
                }else{
                    this.isAuthenticated = false;
                }
            },
            error: err=>{
                this.isAuthenticated = false;
            }
        })
    }

	isLogedIn(){
        if(!this.isAuthenticated){
            this.router.navigate(['account/login']);
            return false;
        }else{
            return true;
        }
    }
}
