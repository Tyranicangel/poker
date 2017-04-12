import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SocketService } from '../../socket.service';
// import * as io from "socket.io-client";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private tableId:string;
  constructor(private activatedRoute:ActivatedRoute, private socket:SocketService) {
      this.activatedRoute.params.subscribe((params:Params)=>{
        this.tableId=params['id'];
      })
   }

  ngOnInit() {
    // this.socket.connect(this.tableId);
    // this.socket.receive('outgoing').subscribe(data=>{
    //   console.log(data);
    // });
  }

  ngAfterViewInit(){
    
  }
}