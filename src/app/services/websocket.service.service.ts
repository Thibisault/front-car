(window as any).global = window;

import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';  
import { Subject } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private messageSubject = new Subject<ChatMessage>();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/chat-websocket'),
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected');
      this.stompClient.subscribe('/topic/messages', (message: Message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.activate();
  }

  public sendMessage(chatMessage: ChatMessage): void {
    this.stompClient.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(chatMessage),
    });
  }

  public getMessages() {
    return this.messageSubject.asObservable();
  }
}
