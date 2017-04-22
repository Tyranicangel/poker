import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SocketService } from '../socket.service';
import { orderBy } from 'lodash';

@Injectable()
export class ChatService {
    public joined = false;
    public userId: number;
    public chatMessages: any[] = [];
    private incomingMessageHandler: (chatMessage: any) => void;
    constructor(private socket: SocketService) {
        this.incomingMessageHandler = (chatMessage) => {
            this.handleIncomingChat(chatMessage)
        }
    }

    private handleIncomingChat(message: any){
        if(!this.joined){
            console.warn('Discarding message.. not joined chat')
            return false
        }
        this.chatMessages.push(message)
        console["table"](this.chatMessages)
    }

    joinRoom() {
        this.userId = 1;
        const {socket} = this;

        socket.once("chat:authorize:response", (data) => {
            console.log(data);
            if (data.userId == this.userId) {
                this.joined = true;
                socket.on("chat:message:new", this.incomingMessageHandler)
            }
        });

        socket.send("chat:authorize", { userId: this.userId });
    }
    sendMessage(message: string) {
        const {socket} = this;
        socket.send("chat:message", { message, time: new Date() });
    }

    leaveRoom() {
    }

}