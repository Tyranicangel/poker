import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-tablelist',
  templateUrl: './tablelist.component.html',
  styleUrls: ['./tablelist.component.css']
})
export class TablelistComponent implements OnInit {
  tableList:Array<any>;
  constructor(private api:ApiService) { 
    this.tableList=[];
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.api.getAll('/table/list')
    .subscribe(data=>{
      console.log(data);
      this.tableList=data;
    })
  }
}