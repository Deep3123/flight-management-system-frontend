import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_BASE_URL } from '../constats';

@Injectable({
  providedIn: "root",
})
export class FlightAuthServiceService {
  // private apiUrl = 'http://localhost:8080/flight'; // Update this if your backend URL is different
  // private apiUrl = "https://jetwayz-backend.onrender.com/flight";
  // private apiUrl = 'https://jetwayz-backend-production.up.railway.app/flight';

  constructor(private http: HttpClient) {}

  // Get all flights
  getAllFlights(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/flight/get-all-flights-details`);
  }

  // Get flight details by flight number
  getFlightByFlightNumber(flightNumber: string): Observable<any> {
    return this.http.get(
      `${API_BASE_URL}/flight/get-flights-details-by-flight-number/${flightNumber}`
    );
  }

  getFlightByAllDetails(flight: any): Observable<any> {
    return this.http.post(
      `${API_BASE_URL}/flight/get-flight-details-by-departure-and-arrival`,
      flight
    );
  }

  // Save new flight details
  saveFlightData(flight: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/flight/add-flight-details`, flight);
  }

  // Update flight details
  updateFlight(flight: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/flight/update-flight-details`, flight);
  }

  // Delete flight details
  deleteFlight(flightNumber: string): Observable<any> {
    return this.http.get(
      `${API_BASE_URL}/flight/delete-flight-details/${flightNumber}`
    );
  }

  // Search flights by departure and arrival
  searchFlightsByRoute(departure: string, arrival: string): Observable<any> {
    return this.http.get(
      `${API_BASE_URL}/flight/get-flight-details-by-departure-and-arrival`,
      {
        params: { departureStation: departure, arrivalStation: arrival },
      }
    );
  }

  downloadFlightExcel(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/flight/download-all-flight-data`);
  }
}
