import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	user:User;
	errorMsg:string;
  constructor(private api:ApiService, private router:Router) { 
  	this.user = new User;
  	this.errorMsg="";
  }

  ngOnInit() {
  }

  login(){
  	this.api.post('/main/login',this.user)
  	.subscribe(data=>{
  		if(data[0]=="Success"){
  			localStorage.setItem('PokrToken',data[1]);
  			this.router.navigate(['/game']);
  		}
  		else if(data[0]=="Verify"){
  			localStorage.setItem('PokrToken',data[1]);
  			this.router.navigate(['/verify']);
  		}
  		else{
  			this.errorMsg=data[1];
  		}
  	});
  }

}
