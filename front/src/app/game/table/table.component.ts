import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SocketService } from '../../socket.service';
import { ChatService } from '../chat.service';
// import * as io from "socket.io-client";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private tableId:string;
  private chatMessage: string;
  private chatMessages: any[] = [];
  constructor(private activatedRoute:ActivatedRoute, private socket:SocketService, /*private chat:ChatService*/) {
      this.activatedRoute.params.subscribe((params:Params)=>{
        this.tableId=params['id'];
      })
   }

   sit(){
    
   }

   check(){

   }

   raise(){

   }

   fold(){

   }

   stand(){

   }

   leave(){
     
   }

  ngOnInit() {
    this.socket.connect(this.tableId);  
    this.socket.receive("auth").subscribe((data)=>{
      console.log(data);
    });
    this.socket.receive("table:status").subscribe((data)=>{
      console.log(data);
    });
    this.socket.receive("chat:status").subscribe((data)=>{
      console.log(data);
    });

    this.socket.receive("chat:message").subscribe((data)=>{
      console.log(data);
    })

  }

  ngAfterViewInit(){
    
  }
  
  // trackByIndex(index: number, obj: any): any {
  //   return index;
  // }

  // getBGColor(){
  //   return this.chat.joined ? 'green': 'gray';
  // }
  // onclickJoin(){
  //   this.chat.joinRoom();
  // } 
  // onclickSend(){
  //   this.chat.sendMessage(this.chatMessage);
  //   this.chatMessage = "";
  // }
}