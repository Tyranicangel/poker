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
  private tableUsers: any[] = [];
  private userId:number;
  private tableUserId:number;
  constructor(private activatedRoute:ActivatedRoute, private socket:SocketService, /*private chat:ChatService*/) {
      this.activatedRoute.params.subscribe((params:Params)=>{
        this.tableId=params['id'];
      })
      this.tableUserId=0;
   }

   sendMessage(){
     this.socket.send("message",{message:this.chatMessage});
     this.chatMessage="";
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
      this.userId=data['userId'];
    });
    this.socket.receive("table:status").subscribe((data)=>{
      console.log(data);
    });
    this.socket.receive("chat:status").subscribe((data)=>{
      this.tableUsers=data['tableusers'];
      this.chatMessages.push({message:data['message'],TableUserId:'None'});
      for(let user of this.tableUsers){
        if(user.User.id==this.userId){
          this.tableUserId=user.id;
        }
      }
    });

    this.socket.receive("chat:message").subscribe((data)=>{
      this.chatMessages.push(data['dat']);
      console.log(this.chatMessages);
    })
  }

  getUserName(tableuserid){
    if(tableuserid==this.tableUserId){
      return "You";
    }
    for(let user of this.tableUsers){
      if(user.id==tableuserid){
        return user.User.name;
      }
    }
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