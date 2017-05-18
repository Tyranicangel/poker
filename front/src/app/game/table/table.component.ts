import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SocketService } from '../../socket.service';
import { ChatService } from '../chat.service';
import { ModalDirective } from 'ng2-bootstrap';

// import * as io from "socket.io-client";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @ViewChild('modal') public buyInModal:ModalDirective;
  @ViewChild('modal2') public raiseModal:ModalDirective;
  private tableId:string;
  private chatMessage: string;
  private chatMessages: any[] = [];
  private tableUsers: any[] = [];
  private userId:number;
  private tableUserId:number;
  private tableData:any;
  private userData:any;
  private myRaise:number;
  private gameSettings: {
    position:number,
    BuyIn:number
  }

  private userAction:{
    bet:number
  }

  constructor(private activatedRoute:ActivatedRoute, private socket:SocketService, /*private chat:ChatService*/) {
      this.myRaise=0;
      this.gameSettings={
        position:0,
        BuyIn:0
      };
      this.userAction={
        bet:0
      }
      this.activatedRoute.params.subscribe((params:Params)=>{
        this.tableId=params['id'];
      })
      this.tableUserId=0;
   }

   getuserstatus(tableuser){
     if(tableuser.gameuser){
        if(tableuser.gameuser.status==1){
          return "None"
        }
        else if(tableuser.gameuser.status==2){
          return "Check"
        }
        else if(tableuser.gameuser.status==3){
          return "Call"
        }
        else if(tableuser.gameuser.status==4){
          return "Raise"
        }
        else if(tableuser.gameuser.status==0){
          return "Fold"
        }
     }
     else{
       return "None";
     }
   }

   getuserbet(tableuser){
     if(tableuser.userplay){
        if(tableuser.gameuser.status==1){
          return tableuser.userplay.betAmount;
        }
        else if(tableuser.gameuser.status==2){
          return "None"
        }
        else if(tableuser.gameuser.status==3){
          return tableuser.userplay.betAmount;
        }
        else if(tableuser.gameuser.status==4){
          return tableuser.userplay.betAmount;
        }
        else if(tableuser.gameuser.status==0){
          return "None"
        }
     }
     else{
       return "None";
     }
   }

   showsit(val){
    for(let user of this.tableData.tableusers){
      if(user && user['User.id']==this.userId){
          return null;
      }
    }
    this.gameSettings.position=val;
    this.buyInModal.show();
   }

   sendMessage(){
     this.socket.send("message",{message:this.chatMessage});
     this.chatMessage="";
   }

   sit(){
     //Todo:check for max and min and user chips
      this.socket.send("sit",this.gameSettings);
      this.buyInModal.hide();
   }

   check(){
     this.userAction.bet=0;
      this.socket.send("check",this.userAction);
   }

   call(){
     this.userAction.bet=this.userData.minBet;
     this.socket.send("call",this.userAction);
   }

   showRaise(){
     this.raiseModal.show();
   }

   allin(){

   }

   raise(){
      if(this.myRaise==0){
        alert("Please raise something");
      }
      else if(this.myRaise>this.userData['TableUser.currentChips']){
        alert("You do no have enough chips to raise");
      }
      else if(this.myRaise<this.userData.minBet){
        alert("You have to do the minimum raise");
      }
      else{
        this.userAction.bet=this.myRaise;
        this.socket.send("raise",this.userAction);
        this.myRaise=0;
        this.raiseModal.hide();
      }
   }

   fold(){
      this.userAction.bet=0;
      this.socket.send("fold",this.userAction);
   }

   stand(){
    this.userAction.bet=0;
    this.socket.send("stand",this.userAction);
   }

   leave(){
     this.userAction.bet=0;
     this.socket.send("leave",this.userAction);
   }

  ngOnInit() {
    this.socket.connect(this.tableId);  
    this.socket.receive("auth").subscribe((data)=>{
      this.userId=data['userId'];
      this.socket.receive("user:status:"+this.userId).subscribe((udata)=>{
        this.userData=udata;
        console.log(udata);
      });
    });
    this.socket.receive("table:status").subscribe((data)=>{
      this.tableData=data;
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
}