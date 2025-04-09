import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class BookingServiceService {
  private apiUrl = "http://localhost:8080/bookings"; // Change to your actual API endpoint

  constructor(private http: HttpClient) {}

  // Create a new booking
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, bookingData);
  }

  // Get booking by ID
  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Get all bookings for a user (assuming user authentication is implemented)
  getUserBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }
}
