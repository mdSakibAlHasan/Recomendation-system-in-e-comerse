import { Component } from '@angular/core';
import { AlertService } from './alert.service';
import { slideInOutAnimation } from './slideInOutAnimation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.css',
	animations: [slideInOutAnimation],
})
export class AlertComponent {
	loading: boolean | undefined;
	message: any;
	tosterCollection: any[] = [];
	titleTosterCollection: any[] = [];
	constructor(private alertService: AlertService) {}

	ngOnInit() {
		this.alertService.getMessage().subscribe({
			next: message => {
				if ((message != null ? message.type : 'undefine') == 'loading') {
					if (message.text == 'true') {
						this.loading = true;
					} else {
						this.loading = false;
					}
				} else if (message != null && message.type == 'toster') {
					let tosterId = Math.floor(1000 + Math.random() * 9000);
					this.tosterCollection.push({
						type: message.alertType,
						text: message.text,
						id: tosterId,
					});

					setTimeout(() => {
						this.tosterCollection = this.tosterCollection.filter(res => res.id != tosterId);
					}, 5000);
				} else if (message != null && message.type.includes('title-toster')) {
					// for title toster
					let tosterId = Math.floor(1000 + Math.random() * 9000);
					this.titleTosterCollection.push({
						type: message.alertType,
						text: message.text,
						id: tosterId,
					});

					setTimeout(() => {
						this.titleTosterCollection = this.titleTosterCollection.filter(res => res.id != tosterId);
					}, 300000);
				}
				this.message = message;
			},
			error: err => {},
		});
	}

	fnRemoveToster(tosterId: any) {
		this.tosterCollection = this.tosterCollection.filter(res => res.id != tosterId);
	}
	fnRemoveTitleToster(tosterId: any) {
		this.titleTosterCollection = this.titleTosterCollection.filter(res => res.id != tosterId);
	}
}
