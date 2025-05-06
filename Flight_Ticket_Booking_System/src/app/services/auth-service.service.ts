// import { Injectable } from "@angular/core";
// import { BehaviorSubject } from "rxjs";

// @Injectable({
//   providedIn: "root",
// })
// export class AuthService {
//   private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
//   isLoggedIn$ = this.isLoggedInSubject.asObservable();

//   private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());
//   isAdmin$ = this.isAdminSubject.asObservable();

//   // Storage type keys
//   private readonly TOKEN_KEY = "token";
//   private readonly ROLE_KEY = "role";
//   private readonly REMEMBER_ME_KEY = "rememberMe";

//   constructor() {
//     // Check if the user was previously logged in
//     this.restoreSession();
//   }

//   // Restore session on service initialization
//   private restoreSession(): void {
//     if (this.isBrowser()) {
//       const token = this.getToken();
//       const role = this.getRole();
//       if (token && role) {
//         this.isLoggedInSubject.next(true);
//         this.isAdminSubject.next(role === "ADMIN");
//       }
//     }
//   }

//   // Private method to check if the token and role exist in storage
//   private hasToken(): boolean {
//     if (this.isBrowser()) {
//       const token = this.getToken();
//       const role = this.getRole();
//       return !!token && !!role;
//     }
//     return false;
//   }

//   // Private method to check if the user is an admin
//   private isAdmin(): boolean {
//     if (this.isBrowser()) {
//       const role = this.getRole();
//       return role === "ADMIN";
//     }
//     return false;
//   }

//   // Helper method to check if the code is running in the browser
//   private isBrowser(): boolean {
//     return (
//       typeof window !== "undefined" &&
//       typeof window.localStorage !== "undefined"
//     );
//   }

//   // Get the appropriate storage based on remember me setting
//   private getStorage(): any {
//     if (!this.isBrowser()) return null;

//     // Check if remember me was set to true
//     const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === "true";
//     return rememberMe ? localStorage : sessionStorage;
//   }

//   // Login method to store token and role
//   login(token: string, role: string, rememberMe: boolean = false): void {
//     if (this.isBrowser()) {
//       // Store rememberMe preference in localStorage so it persists
//       localStorage.setItem(this.REMEMBER_ME_KEY, String(rememberMe));

//       // Store token and role in the appropriate storage
//       const storage = rememberMe ? localStorage : sessionStorage;
//       storage.setItem(this.TOKEN_KEY, token);
//       storage.setItem(this.ROLE_KEY, role);

//       this.isLoggedInSubject.next(true);
//       this.isAdminSubject.next(role === "ADMIN");
//     }
//   }

//   // Logout method to clear token and role from storage
//   logout(): void {
//     if (this.isBrowser()) {
//       // Clear from both storages to be safe
//       localStorage.removeItem(this.TOKEN_KEY);
//       localStorage.removeItem(this.ROLE_KEY);
//       sessionStorage.removeItem(this.TOKEN_KEY);
//       sessionStorage.removeItem(this.ROLE_KEY);

//       // Keep the rememberMe preference

//       this.isLoggedInSubject.next(false);
//       this.isAdminSubject.next(false);
//     }
//   }

//   // Get the stored token
//   getToken(): string | null {
//     if (!this.isBrowser()) return null;

//     // Try localStorage first (for remembered sessions)
//     let token = localStorage.getItem(this.TOKEN_KEY);

//     // If not found, try sessionStorage
//     if (!token) {
//       token = sessionStorage.getItem(this.TOKEN_KEY);
//     }

//     return token;
//   }

//   // Get the stored role
//   getRole(): string | null {
//     if (!this.isBrowser()) return null;

//     // Try localStorage first (for remembered sessions)
//     let role = localStorage.getItem(this.ROLE_KEY);

//     // If not found, try sessionStorage
//     if (!role) {
//       role = sessionStorage.getItem(this.ROLE_KEY);
//     }

//     return role;
//   }

//   // Check if the user is authenticated by checking the token
//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
// }


import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt"; // Add this import

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  // Storage type keys
  private readonly TOKEN_KEY = "token";
  private readonly ROLE_KEY = "role";
  private readonly REMEMBER_ME_KEY = "rememberMe";
  private readonly COOKIE_TOKEN_NAME = "auth_token"; // Name of the cookie set by backend

  private jwtHelper = new JwtHelperService(); // Add this for token decoding

  constructor() {
    // Check auth status immediately on service initialization
    this.checkAuthStatus();
  }

  // Public method to check authentication status
  checkAuthStatus(): void {
    if (this.isBrowser()) {
      // First check for auth cookie (from OAuth direct login)
      const cookieToken = this.getTokenFromCookie(this.COOKIE_TOKEN_NAME);

      if (cookieToken) {
        // We have a token from OAuth, store it and extract role from JWT if possible
        try {
          // Decode the JWT to get the role
          const decodedToken = this.jwtHelper.decodeToken(cookieToken);
          const role = decodedToken?.role || "USER";

          // Store the token and role
          this.storeTokenAndRole(cookieToken, role, true);
          console.log("Auth restored from cookie with role:", role);
          return;
        } catch (e) {
          console.error("Error decoding JWT token:", e);
          // If decoding fails, use default role
          this.storeTokenAndRole(cookieToken, "USER", true);
          return;
        }
      }

      // If no cookie, fallback to regular token check
      const token = this.getToken();
      const role = this.getRole();

      if (token && role) {
        // console.log("Auth restored from storage with role:", role);
        this.isLoggedInSubject.next(true);
        this.isAdminSubject.next(role === "ADMIN");
      } else {
        // Make sure we explicitly set to false if no valid auth found
        this.isLoggedInSubject.next(false);
        this.isAdminSubject.next(false);
      }
    }
  }

  // Get token from cookie by name
  private getTokenFromCookie(name: string): string | null {
    if (!this.isBrowser()) return null;

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  // Helper method to check if the code is running in the browser
  private isBrowser(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  // Get the appropriate storage based on remember me setting
  private getStorage(): Storage | null {
    if (!this.isBrowser()) return null;

    // Check if remember me was set to true
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === "true";
    return rememberMe ? localStorage : sessionStorage;
  }

  // Store token and role in appropriate storage
  private storeTokenAndRole(token: string, role: string, rememberMe: boolean): void {
    if (!this.isBrowser()) return;

    // Store rememberMe preference in localStorage so it persists
    localStorage.setItem(this.REMEMBER_ME_KEY, String(rememberMe));

    // Store token and role in the appropriate storage
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, token);
    storage.setItem(this.ROLE_KEY, role);

    // Explicitly update the BehaviorSubjects
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(role === "ADMIN");
  }

  // Handle OAuth redirect with token in URL
  handleOAuthRedirect(token: string, role: string = "USER", rememberMe: boolean = true): void {
    // console.log("Handling OAuth redirect with token and role:", role);
    if (this.isBrowser()) {
      this.storeTokenAndRole(token, role, rememberMe);

      // Force emit login state even if it was already true
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(role === "ADMIN");
    }
  }

  // Login method to store token and role
  login(token: string, role: string, rememberMe: boolean = false): void {
    // console.log("Manual login with role:", role);
    if (this.isBrowser()) {
      this.storeTokenAndRole(token, role, rememberMe);
    }
  }

  // Logout method to clear token and role from storage
  logout(): void {
    if (this.isBrowser()) {
      // Clear from both storages to be safe
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROLE_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.ROLE_KEY);

      // Also clear auth cookie if it exists
      document.cookie = `${this.COOKIE_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // Update the state
      this.isLoggedInSubject.next(false);
      this.isAdminSubject.next(false);
    }
  }

  // Get the stored token (from storage or cookie)
  getToken(): string | null {
    if (!this.isBrowser()) return null;

    // First check for auth cookie
    const cookieToken = this.getTokenFromCookie(this.COOKIE_TOKEN_NAME);
    if (cookieToken) {
      return cookieToken;
    }

    // Try localStorage first (for remembered sessions)
    let token = localStorage.getItem(this.TOKEN_KEY);

    // If not found, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem(this.TOKEN_KEY);
    }

    return token;
  }

  // Get the stored role
  getRole(): string | null {
    if (!this.isBrowser()) return null;

    // Try localStorage first (for remembered sessions)
    let role = localStorage.getItem(this.ROLE_KEY);

    // If not found, try sessionStorage
    if (!role) {
      role = sessionStorage.getItem(this.ROLE_KEY);
    }

    return role;
  }

  // Check if the user is authenticated by checking the token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}