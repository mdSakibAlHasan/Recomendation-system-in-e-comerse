import { Component, OnInit } from '@angular/core';
import { NotificationModel } from './notification.model';
import { NotificationService } from './notification.service';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  notifications: NotificationModel[] = [];

  constructor(
    private notificationService: NotificationService,
    private alertService: AlertService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: res=>{
        this.notifications = res;
      },
      error: err=>{
        this.alertService.tosterDanger('Something went wrong to load notification');
      }
    });
  }

  markAsRead(notificationId: any) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
    });
  }

  navigateTo(link: string, id: number): void {
    this.markAsRead(id);
    this.route.navigate([link]);
  }
}
