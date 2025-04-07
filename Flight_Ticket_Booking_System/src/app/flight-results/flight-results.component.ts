import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-flight-results",
  standalone: false,
  templateUrl: "./flight-results.component.html",
  styleUrls: ["./flight-results.component.css"],
})
export class FlightResultsComponent implements OnInit {
  flightResults: any[] = [];
  count: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.flightResults = nav?.extras?.state?.["flights"] || [];
    this.count = nav?.extras?.state?.["count"] || 0;
  }

  ngOnInit(): void {
    // You can handle cases like no results here
    console.log(this.flightResults); // Check the structure of your flightResults array
  }

  // Format duration (convert minutes into hours and minutes)
  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} hrs ${minutes} mins`;
  }

  // Get the airport name based on the airport code
  getAirportName(airportCode: string): string {
    const airportNames: { [key: string]: string } = {
      Ahmedabad: "AMD",
      Delhi: "DLH",
      DXB: "Dubai International Airport",
      // Add more airports as needed
    };
    return airportNames[airportCode] || airportCode;
  }

  // Get the lowest price from flight results (return '0' if no results)
  getLowestPrice(): string {
    if (this.flightResults?.length > 0) {
      return (Math.min(...this.flightResults.map((f) => f.price)) * this.count).toString();
    } else {
      return "0";
    }
  }

  getLowestPriceValue(): number {
    if (this.flightResults?.length > 0) {
      return Math.min(...this.flightResults.map((f) => f.price));
    } else {
      return 0;
    }
  }

  // Booking flight function (you can expand this logic as per your requirements)
  bookFlight(flight: any): void {
    alert(`Flight ${flight.flightNumber} has been selected!`);
    // Additional logic to process flight booking can go here (e.g., navigating to a payment page)
  }

  // Track by function for performance optimization in *ngFor
  trackByFn(index: number, item: any): number {
    return index; // Or return a unique identifier for the item if available
  }
}
