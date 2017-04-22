import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class ApiService {

  constructor(private http:Http) { }

  private jwt(){
    let authtoken=localStorage.getItem('PokrToken');
    if(authtoken){
      let header=new Headers({'JWT-AuthToken':authtoken});
      return new RequestOptions({headers:header})
    }
  }

  getAll(path){
    return this.http.get('/api/'+path,this.jwt()).map((response:Response)=>response.json());
  }

  get(path,data){
    let params:URLSearchParams=new URLSearchParams();
    for (var key in data){
      params.set(key,data[key]);
    }
    let req:RequestOptions=this.jwt();
    req['search']=params;
    return this.http.get('/api/'+path,req).map((response:Response)=>response.json());
  }

  post(path,data){
    return this.http.post('/api/'+path,data,this.jwt()).map((response:Response)=>response.json());
  }

  put(path,data){
    return this.http.put('/api/'+path,data,this.jwt()).map((response:Response)=>response.json());
  }

  delete(path,data){
    return this.http.delete('/api/'+path+data,this.jwt()).map((response:Response)=>response.json());
  }

  upload(file:File){
    return new Promise((resolve,reject)=>{
      let fData=new FormData();
      let xhr=new XMLHttpRequest();
      fData.append("file",file);
      xhr.onreadystatechange=function(){
        if (xhr.readyState==4){
          if(xhr.status==200){
            resolve(JSON.parse(xhr.response));
          }
          else{
            reject(xhr.response);
          }
        }
      }
      xhr.open('POST','/api/user/upload',true);
      let authtoken=localStorage.getItem('PokrToken');
      if(authtoken){
        xhr.setRequestHeader('JWT-AuthToken',authtoken);
      }
      xhr.send(fData);
    });
  }

}
