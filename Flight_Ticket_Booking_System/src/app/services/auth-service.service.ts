import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  // Private method to check if the token and role exist in localStorage
  private hasToken(): boolean {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      return !!token && !!role; // Return true if both token and role are present
    }
    return false;
  }

  // Login method to store token and role in localStorage
  login(token: string, role: string): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("token", token); // Store token
      localStorage.setItem("role", role); // Store role
      this.isLoggedInSubject.next(true); // Update login status
    }
  }

  // Logout method to clear token and role from localStorage
  logout(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token"); // Remove token
      localStorage.removeItem("role"); // Remove role
      this.isLoggedInSubject.next(false); // Update login status
    }
  }

  // Get the stored token from localStorage
  getToken(): string | null {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Get the stored role from localStorage
  getRole(): string | null {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("role");
    }
    return null;
  }

  // Check if the user is authenticated by checking the token
  isAuthenticated(): boolean {
    return !!this.getToken(); // Return true if the token exists
  }
}
