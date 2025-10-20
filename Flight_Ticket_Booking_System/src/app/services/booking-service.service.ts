import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_BASE_URL } from '../constats';

@Injectable({
  providedIn: "root",
})
export class BookingServiceService {
  // private apiUrl: string = "http://localhost:8080/bookings"; // Change to your actual API endpoint
  // private apiUrl: string = "https://jetwayz-backend.onrender.com/bookings";
  // private apiUrl: string = "https://jetwayz-backend-production.up.railway.app/bookings";

  constructor(private http: HttpClient) {}

  verifyPayment(bookingData: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/bookings/verify-payment`, bookingData);
  }

  // Create a new booking
  createBooking(bookingData: any): Observable<any> {
    // return this.http.post(`${this.apiUrl}/confirm`, bookingData, {
    //   responseType: "text",
    // });

    return this.http.post(`${API_BASE_URL}/bookings/confirm`, bookingData);
  }

  generatePdfOfTicket(bookingData: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/bookings/generate-ticket`, bookingData);
  }

  // Get booking by ID
  getBookingById(id: string): Observable<any> {
    return this.http.get(`${API_BASE_URL}/bookings/${id}`);
  }

  // Get all bookings for a user (assuming user authentication is implemented)
  getUserBookings(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/bookings/user`);
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/bookings/all-bookings`);
  }

  deleteBooking(id: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/bookings/delete-booking-details`, id);
  }

  downloadBookingExcel(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/bookings/download-all-booking-data`);
  }
}
