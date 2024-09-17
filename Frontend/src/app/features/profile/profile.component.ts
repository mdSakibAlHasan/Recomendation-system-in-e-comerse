import { Component } from '@angular/core';
import { ProfileService } from './profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {
    username: '',
    email: '',
    address: '',
    create_time: ''
  };
  orderHistory: any[] = [];
  passwordData = { current_password: '', new_password: '' , confirm_password: ''};

  constructor(
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadOrderHistory();
  }

  loadUserData(): void {
    this.profileService.getUserDetails().subscribe({
      next: data=>{
        this.user = data[0];
      },error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    });
  }

  loadOrderHistory(): void {     
    this.profileService.getOrderHistory().subscribe({
      next: data=>{
        this.orderHistory = data;
      },error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    });
  }

  updateUser(): void {      //api not ready
    this.profileService.updateUser(this.user).subscribe(response => {
      alert('Profile updated successfully!');
    });
  }


  changePassword(): void {
    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      this.alertService.tosterDanger('New password and confirm password do not match!');
      return;
    }
    this.profileService.changePassword( {"oldPassword": this.passwordData.current_password,"newPassword": this.passwordData.new_password}).subscribe({ 
      next: data=>{
        if(data.isSuccess)
          this.alertService.tosterSuccess(data.message)
        else
          this.alertService.tosterDanger(data.message)
      },error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    });
  }

}
