import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-booking-details",
  standalone:false,
  templateUrl: "./booking-details.component.html",
  styleUrls: ["./booking-details.component.css"],
})
export class BookingDetailsComponent implements OnInit {
  selectedFlight: any;
  passengerCount: number = 1;
  countryCodes: any[] = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+65", country: "Singapore" },
    { code: "+971", country: "UAE" },
    // Add more country codes as needed
  ];

  passengers: any[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.selectedFlight = nav?.extras?.state?.["flight"] || null;
    this.passengerCount = nav?.extras?.state?.["count"] || 1;

    // Initialize passengers array
    this.initializePassengersForm();
  }

  ngOnInit(): void {
    if (!this.selectedFlight) {
      this.router.navigate(["/flight-results"]);
    }
  }

  // Initialize the passengers array based on passenger count
  initializePassengersForm(): void {
    this.passengers = [];
    for (let i = 0; i < this.passengerCount; i++) {
      this.passengers.push({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        countryCode: "+91",
        mobile: "",
      });
    }
  }

  // Calculate total price
  getTotalPrice(): number {
    return this.selectedFlight
      ? this.selectedFlight.price * this.passengerCount
      : 0;
  }

  // Handle form submission
  onSubmit(): void {
    // Proceed to payment or handle errors here
    this.initiatePayment();
  }

  // Initiate Razorpay payment (simulated in this example)
  initiatePayment(): void {
    // Handle Razorpay payment logic here
  }
}
