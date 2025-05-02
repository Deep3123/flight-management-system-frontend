import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OAuthService {
  private baseUrl: string = "http://localhost:8080/bookings"; // Change to your actual API endpoint
  // private baseUrl: string = "https://jetwayz-backend.onrender.com/bookings";
  // private baseUrl: string = "https://jetwayz-backend-production.up.railway.app/bookings";

  constructor(private http: HttpClient) {}

  // Complete profile after OAuth login
  completeOAuthProfile(profileData: any, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/oauth/complete-profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
