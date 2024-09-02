import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  createUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, user);
  }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  loginUser(user: AppUser): Observable<AppUser | null> {
    return this.http.post<AppUser | null>(`${this.apiUrl}/login`, user);
  }
}


