import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {
  private socket;
  private url:string;
  constructor() {
    this.url="http://localhost:3000";
   }

   connect(tableId:string){
     this.socket = io.connect(this.url,{query:"tableId="+tableId});
   }

   send(method:string,data:any){
     this.socket.emit(method,data);
   }

   receive(method:string){
     let observable = new Observable(observer=>{
       this.socket.on(method,(data)=>{
         observer.next(data);
       });
     });
     return observable;
   }

   close(){
     this.socket.disconnet();
   }

}
