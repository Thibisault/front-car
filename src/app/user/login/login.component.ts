import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AppUser } from '../../models/app-user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onLogin() {
    const user: AppUser = { id: 0, name: '', email: this.email, password: this.password };
    this.userService.loginUser(user).subscribe((loggedInUser) => {
      if (loggedInUser) {
        sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        this.router.navigate(['/users']);
      } else {
        console.log('Login failed');
      }
    });
  }
}
