import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root",
})
export class UserAuthServiceService {
  private baseUrl: string = "http://localhost:8080/user"; // Make sure this is the correct API base URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Send the registration data to the backend API (no Authorization needed)
  saveUserData(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // Send login data to backend API (no Authorization needed)
  // userLogin(params: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, params, {
  //     withCredentials: true,
  //   });
  // }

  userLogin(params: any): Observable<any> {
    const headers = new HttpHeaders({
      // Include the session token if it exists
      ...(sessionStorage.getItem('X-Auth-Token') ? 
        { 'X-Auth-Token': sessionStorage.getItem('X-Auth-Token')! } : {})
    });
  
    return this.http.post<any>(`${this.baseUrl}/login`, params, {
      headers: headers,
      withCredentials: true
    });
  }
  
  // Forgot password (no Authorization needed)
  forgotPassword(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, params);
  }

  // Reset password (no Authorization needed)
  resetPassword(
    resetPassword: any,
    username: any,
    timestamp: any,
    token: any
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reset-password/${username}/${timestamp}/${token}`,
      resetPassword
    );
  }

  // Get all users (Authorization required)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-user-details`);
  }

  // Delete user (Authorization required)
  deleteUser(username: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/delete-user-by-username/${username}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-user-by-username`, user);
  }

  // checkAccountExists(): Observable<any> {
  //   return this.http.post(
  //     `${this.baseUrl}/check-account-exists`,
  //     this.authService.getToken()
  //   );
  // }
}
