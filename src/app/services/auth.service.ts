import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserRole: string = 'admin'; //TODO

  constructor() { }

  getUserRole(): string {
    return this.currentUserRole;
  }

  isLoggedIn(): boolean {
    //TODO
    return true;
  }
}