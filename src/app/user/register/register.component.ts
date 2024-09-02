import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AppUser } from '../../models/app-user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onRegister() {
    const user: AppUser = { id: 0, name: this.name, email: this.email, password: this.password };
    this.userService.createUser(user).subscribe(response => {
      if (response) {
        sessionStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigate(['/users']);
      } else {
        alert('La création du compte a échoué, essayez encore une fois.');
      }
    });
  }
}
