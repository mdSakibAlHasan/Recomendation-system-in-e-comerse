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
        console.log(response)
        if (response.hasOwnProperty('token')) {
          localStorage.setItem('currentUser', JSON.stringify(response.token));
          this.router.navigate(['product'])
        } else {
          this.alertService.tosterDanger(response.message)
        }
      },
      error: err => {
        console.log(err)
        this.alertService.tosterDanger('Something went wrong')
      }
    })
  }
}
