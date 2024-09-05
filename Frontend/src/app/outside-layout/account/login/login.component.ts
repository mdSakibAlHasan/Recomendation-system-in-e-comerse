import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
    private router: Router) { }

  login(form: { value: any; }) {
    let data = form.value
    this.accountService.login(data.username, data.password).subscribe(
      response => {
        if (response.hasOwnProperty('user')) {
          console.log('response', response);
          alert('Welcome, ' + data.username);
          this.router.navigate([''])
          // let currentUser = new User(response.user)

          // localStorage.setItem('currentUser', JSON.stringify(currentUser));
          // this.shServ.currentUserSubject.next(currentUser);

          // console.log(currentUser);

          alert('Welcome, ' + data.username);
          this.router.navigate([''])
        } else {
          alert(response.error);
        }
      },
      err => {
        console.log(err);
        
        console.log(err.error);
        alert('Error: ' + err.error);
      })
  }
}
