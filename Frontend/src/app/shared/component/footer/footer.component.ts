import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../features/notification/websocket.service';
import { AlertService } from '../../alert/alert.service';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  constructor(
    private webSocketService: WebsocketService,
    private alertService: AlertService,
    private navBarService: NavbarService
  ){}

  ngOnInit(): void {
     this.webSocketService.connect('ws://localhost:8000/ws/notifications/')
          .subscribe({
              next: (data) =>{ 
                this.alertService.tosterSuccess("A notification come");
                this.navBarService.updateUnreadNotificationNumber();
              },
              error: (error) => console.log('WebSocket error:', error),
      });
  }

  currentYear: number = new Date().getFullYear();
}
