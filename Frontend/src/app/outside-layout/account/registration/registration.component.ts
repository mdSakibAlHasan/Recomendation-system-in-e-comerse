import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { Registration, Login } from '../account.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../shared/alert/alert.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  errorMessage: string = ''

  constructor(
    private accountService: AccountService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void { }

  signup(form: { value: any; }) {
    let data: Registration = form.value
    console.log(data.username + ' ' + data.email + ' ' + data.password);

    this.accountService.signup(data.username, data.email, data.password).subscribe(
      response => {
        alert('Welcome, ' + data.username);
        this.router.navigate(['login']);
      },
      err => {
        this.alertService.tosterDanger('Something Went wrong');
        let errStr = "";
        console.log('oppppppppppp', err.error);
        
        errStr = (err.error.username) ? err.error.username : err.error.email;  
        // alert('Error: ' + errStr);
      })
  }
}
