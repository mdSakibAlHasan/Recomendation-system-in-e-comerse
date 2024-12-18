import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

    private socket!: WebSocket;
    private subject!: Subject<any>;

    connect(url: string): Subject<any> {
        this.socket = new WebSocket(url);
        this.subject = new Subject();

        this.socket.onmessage = (event) => {
            this.subject.next(JSON.parse(event.data));
        };

        this.socket.onerror = (event) => {
            this.subject.error(event);
        };

        return this.subject;
    }

    send(message: any): void {
        this.socket.send(JSON.stringify(message));
    }
}
