import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
	public subject = new Subject<any>();
	public loadingFlag: boolean = false;
	constructor() {}
	confirm(message: string, siFn: () => void, noFn: () => void, type: string = 'confirm') {
		this.setConfirmation(message, siFn, noFn, type);
	}

	confirmAlert(message: string, siFn: () => void, type: string = 'confirmAlert') {
		let noFn: () => void = () => {};
		this.setConfirmation(message, siFn, noFn, type);
	}

	alertAutoTerminated(message: string, siFn: () => void = this.closeFn, noFn: () => void = this.closeFn, type: string = 'alert-terminated') {
		this.setConfirmation(message, siFn, noFn, type);
	}

	confirmAsync(message: string, siFn: () => Promise<any>, noFn: () => void, type: string = 'confirm') {
		this.setConfirmation(message, siFn, noFn, type);
	}

	alert(message: string, noFn: () => void = this.closeFn, type: string = 'alert') {
		this.setConfirmation(message, this.closeFn, noFn, type);
	}

	alertResponeCode(message: any, siFn: () => void = this.closeFn, noFn: () => void = this.closeFn, type: string = 'alert') {
		if (message.status == 200) {
			this.setConfirmation(message._body.replace(/"/g, ''), siFn, noFn, type);
		}
	}

	fnLoading(flag: boolean) {
		if (flag) {
			this.loadingFlag = true;
			this.setConfirmation('true', () => {}, () => {}, 'loading');
		} else {
			this.loadingFlag = false;
			this.setConfirmation('false', () => {}, () => {}, 'loading');
		}
	}
	closeFn = function () {};

	setConfirmation(message: string, siFn: () => void, noFn: () => void, type: string, alertType: string = 'success') {
		let that = this;
		this.subject.next({
			type: type,
			text: message,
			alertType: alertType,
			siFn: function () {
				that.subject.next(undefined); //this will close the modal
				siFn();
			},
			noFn: function () {
				that.subject.next(undefined);
				noFn();
			},
		});

		if (type == 'alert-terminated') {
			setTimeout(() => {
				this.subject.next(undefined);
			}, 3000);
		}
	}

	//#region
	tosterSuccess(message: string, noFn: () => void = this.closeFn, type: string = 'toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'success');
	}
	tosterDanger(message: string, noFn: () => void = this.closeFn, type: string = 'toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'danger');
	}
	tosterWarning(message: string, noFn: () => void = this.closeFn, type: string = 'toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'warning');
	}
	tosterInfo(message: string, noFn: () => void = this.closeFn, type: string = 'toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'info');
	}
	//#endregion toster

	//#region
	titleTosterSuccess(message: string, noFn: () => void = this.closeFn, type: string = 'title-toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'success');
	}
	titleTosterDanger(message: string, noFn: () => void = this.closeFn, type: string = 'title-toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'danger');
	}
	titleTosterWarning(message: string, noFn: () => void = this.closeFn, type: string = 'title-toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'warning');
	}
	titleTosterInfo(message: string, noFn: () => void = this.closeFn, type: string = 'title-toster') {
		this.setConfirmation(message, this.closeFn, noFn, type, 'info');
	}
	//#endregion toster

	public getMessage(): Observable<any> {
		return this.subject.asObservable();
	}
}
