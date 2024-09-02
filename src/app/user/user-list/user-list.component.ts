import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppUser } from '../../models/app-user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: AppUser[] = [];
  currentUser: AppUser | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      console.log('pas d"utilisateur connécté.');
    }

    this.userService.getAllUsers().subscribe((users) => {
      this.users = users.filter(user => user.id !== this.currentUser?.id);
    });
  }

  openChat(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }
}
