import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  private hasToken(): boolean {
    // Check if running in the browser before accessing localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("token") !== null;
    }
    return false;
  }

  login(token: string): void {
    // Check if running in the browser before accessing localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("token", token);
      this.isLoggedInSubject.next(true);
    }
  }

  logout(): void {
    // Check if running in the browser before accessing localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
      this.isLoggedInSubject.next(false);
    }
  }
}
