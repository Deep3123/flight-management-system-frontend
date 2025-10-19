import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { AuthService } from "./auth-service.service";
import { API_BASE_URL } from '../constats';

@Injectable({
  providedIn: "root",
})
export class UserAuthServiceService {
  // private baseUrl: string = "http://localhost:8080/user"; // Make sure this is the correct API base URL
  // private baseUrl: string = "https://jetwayz-backend.onrender.com/user";
  // private baseUrl: string =
  //   "https://jetwayz-backend-production.up.railway.app/user";

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Send the registration data to the backend API (no Authorization needed)
  saveUserData(user: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/user/register`, user);
  }

  // Send login data to backend API (no Authorization needed)
  // userLogin(params: any): Observable<any> {
  //   return this.http.post(`${API_BASE_URL}/user/login`, params, {
  //     withCredentials: true,
  //   });
  // }

  // userLogin(params: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     // Include the session token if it exists
  //     ...(sessionStorage.getItem('X-Auth-Token') ?
  //       { 'X-Auth-Token': sessionStorage.getItem('X-Auth-Token')! } : {})
  //   });

  //   return this.http.post<any>(`${API_BASE_URL}/user/login`, params, {
  //     headers: headers,
  //     withCredentials: true
  //   });
  // }

  userLogin(params: any): Observable<any> {
    const headers = new HttpHeaders({
      // Include the session token if it exists
      ...(sessionStorage.getItem("X-Auth-Token")
        ? { "X-Auth-Token": sessionStorage.getItem("X-Auth-Token")! }
        : {}),
    });

    return this.http.post<any>(`${API_BASE_URL}/user/login`, params, {
      headers: headers,
      withCredentials: true,
    });
  }

  // Forgot password (no Authorization needed)
  forgotPassword(params: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/user/forgot-password`, params);
  }

  // Reset password (no Authorization needed)
  resetPassword(
    resetPassword: any,
    username: any,
    timestamp: any,
    token: any
  ): Observable<any> {
    return this.http.post(
      `${API_BASE_URL}/user/reset-password/${username}/${timestamp}/${token}`,
      resetPassword
    );
  }

  // Get all users (Authorization required)
  getAllUsers(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/user/get-all-user-details`);
  }

  // New method for paginated users
  getUsersPaginated(page: number, size: number, sortField: string | null, sortDirection: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (sortField) {
      params = params.set('sortField', sortField)
                     .set('sortDirection', sortDirection);
    }
    
    return this.http.get(`${API_BASE_URL}/user/get-users-paginated`, { params });
  }
  

  // Method to get total count of users
  getTotalUsersCount(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/user/get-total-users-count`);
  }
  
  // Delete user (Authorization required)
  deleteUser(username: any): Observable<any> {
    return this.http.get(`${API_BASE_URL}/user/delete-user-by-username/${username}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/user/update-user-by-username`, user);
  }

  // Download users Excel file
  downloadUsersExcel(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/user/download-all-user-data`);
  }

  // checkAccountExists(): Observable<any> {
  //   return this.http.post(
  //     `${API_BASE_URL}/user/check-account-exists`,
  //     this.authService.getToken()
  //   );
  // }
}
