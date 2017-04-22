import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';


@Injectable()
export class SocketService {
  private socket: CustomSocketType;
  private url: string;
  constructor() {
    this.url = "http://localhost:3000";
  }

  connect(tableId: string) {
    console.log('SOCKET CONNECTED')
    this.socket = io.connect(this.url, { query: "tableId=" + tableId });
  }

  send(method: string, data: any) {
    console.log(method, data)
    this.socket.emit(method, data);
  }

  receive(method: string) {
    let observable = new Observable(observer => {
      this.socket.on(method, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  
  on(method: string, cb:(data: any)=> void) {
    return this.socket.on(method, cb);
  }

  once(method: string, cb:(data: any)=> void) {
    return this.socket.once(method, cb);
  }

  close() {
    this.socket.disconnect();
  }

}
