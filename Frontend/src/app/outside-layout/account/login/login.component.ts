import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../shared/alert/alert.service';
import { error } from 'console';
import { User } from '../account.model';
import { SharedServiceService } from '../../../shared/user/shared-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(
    private accountService: AccountService,
    private router: Router,
    private alertService: AlertService,
    private sharedService: SharedServiceService,
  ) { }

  login(form: { value: any; }) {
    let data = form.value
    this.accountService.login(data.username, data.password).subscribe({
      next: response => {
        if (response.hasOwnProperty('user')) {
          // console.log('response', response);
          // alert('Welcome, ' + data.username);
          // this.router.navigate(['account/register'])
          let currentUser: User = response.user;

          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.sharedService.currentUserSubject.next(currentUser);

          // console.log(currentUser);

          // alert('Welcome, ' + data.username);
          this.router.navigate(['account/register'])
        } else {
          this.alertService.tosterDanger('Wrong password')
        }
      },
      error: err => {
        console.log(err)
        this.alertService.tosterDanger(err.error.detail)
      }
    })
  }
}
