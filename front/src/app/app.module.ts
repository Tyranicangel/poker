import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy,HashLocationStrategy } from '@angular/common';

import { AppRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { ChatService } from './game/chat.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpModule,
    AppRouting,
    HomeModule
  ],
  providers: [{provide:LocationStrategy,useClass:HashLocationStrategy},ApiService,SocketService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
