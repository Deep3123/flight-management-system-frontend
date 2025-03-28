import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root",
})
export class UserAuthServiceService {
  private baseUrl: string = "http://localhost:8080"; // Make sure this is the correct API base URL

  constructor(private http: HttpClient) {}

  // Send the registration data to the backend API (no Authorization needed)
  saveUserData(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, user);
  }
  
  saveUserDataWithHeader(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, user);
  }

  // Send login data to backend API (no Authorization needed)
  userLogin(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, params);
  }

  // Forgot password (no Authorization needed)
  forgotPassword(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/forgot-password`, params);
  }

  // Reset password (no Authorization needed)
  resetPassword(
    resetPassword: any,
    username: any,
    timestamp: any,
    token: any
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/user/reset-password/${username}/${timestamp}/${token}`,
      resetPassword
    );
  }

  // Get all users (Authorization required)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get-all-user-details`);
  }

  // Delete user (Authorization required)
  deleteUser(username: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/user/delete-user-by-username/${username}`
    );
  }

  // Update user (Authorization required)
  updateUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/update-user-by-username`, user);
  }
}
