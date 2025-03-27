import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root",
})
export class UserAuthServiceService {
  private baseUrl: string = "http://localhost:8080"; // Make sure this is the correct API base URL

  constructor(private http: HttpClient, private service: AuthService) {}

  // Create the headers including the Authorization token
  private createHeaders(): HttpHeaders {
    const token = this.service.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  // Send the registration data to the backend API
  saveUserData(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, user, {
      headers: this.createHeaders(),
    });
  }

  userLogin(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, params, {
      headers: this.createHeaders(),
    });
  }

  forgotPassword(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/forgot-password`, params, {
      headers: this.createHeaders(),
    });
  }

  resetPassword(
    resetPassword: any,
    username: any,
    timestamp: any,
    token: any
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/user/reset-password/${username}/${timestamp}/${token}`,
      resetPassword,
      { headers: this.createHeaders() }
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get-all-user-details`, {
      headers: this.createHeaders(),
    });
  }

  deleteUser(username: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/user/delete-user-by-username/${username}`,
      { headers: this.createHeaders() }
    );
  }

  updateUser(user: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/user/update-user-by-username`,
      user,
      { headers: this.createHeaders() }
    );
  }
}
