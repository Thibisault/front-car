import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../../services/websocket.service.service';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { ChatMessage } from '../../models/chat-message.model';
import { AppUser } from '../../models/app-user.model';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  messages: ChatMessage[] = [];
  contacts: AppUser[] = [];
  receiverId!: number;
  receiverName: string = '';
  sender: AppUser;
  senderName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private chatService: ChatService,
    private userService: UserService,
    private websocketService: WebSocketService
  ) {
    this.sender = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.senderName = this.sender ? this.sender.name : '';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.receiverId = +params.get('id')!;
      this.loadReceiverName();
      this.loadMessages();
      this.loadContacts();
    });

    this.websocketService.getMessages().subscribe((message: ChatMessage) => {
      if (
        (message.senderId === this.sender.id && message.receiverId === this.receiverId) ||
        (message.senderId === this.receiverId && message.receiverId === this.sender.id)
      ) {
        this.messages.push(message);
      }
    });
  }

  loadReceiverName(): void {
    this.userService.getUserById(this.receiverId).subscribe(user => {
      this.receiverName = user.name;
    });
  }

  loadMessages(): void {
    this.chatService
      .getMessagesBetweenUsers(this.sender.id, this.receiverId)
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  loadContacts(): void {
    this.userService.getAllUsers().subscribe((users: AppUser[]) => {
      this.contacts = users.filter(user => user.id !== this.sender.id);
    });
  }

  switchConversation(contact: AppUser): void {
    this.router.navigate(['/chat', contact.id]);
  }

  sendMessage(content: string): void {
    const message: ChatMessage = {
      id: 0,
      senderId: this.sender.id,
      receiverId: this.receiverId,
      messageContent: content,
      timestamp: Date.now(),
    };
    this.websocketService.sendMessage(message);
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']); 
  }
}
