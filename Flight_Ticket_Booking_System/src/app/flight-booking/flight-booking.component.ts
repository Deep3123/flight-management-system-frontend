import { Component, HostListener, OnInit } from "@angular/core";
import { FlightAuthServiceService } from "../services/flight-auth-service.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-flight-booking",
  standalone: false,
  templateUrl: "./flight-booking.component.html",
  styleUrls: ["./flight-booking.component.css"],
})
export class FlightBookingComponent implements OnInit {
  adultCount: number = 1;
  childCount: number = 0;
  infantCount: number = 0;
  showCounter: boolean = false;

  selectedClass: string = "Economy";
  showClassDropdown: boolean = false;

  departureAirport: string = "";
  arrivalAirport: string = "";
  departureTime: any = "";
  arrivalTime: any = "";

  isLoading: any = false;

  allAirports: string[] = [];
  departureAirports: string[] = [];
  arrivalAirports: string[] = [];
  routesMap: { [key: string]: string[] } = {};

  filteredDepartureAirports: string[] = [];
  filteredArrivalAirports: string[] = [];

  constructor(
    private service: FlightAuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAirports();
  }

  loadAirports(): void {
    this.service.getAirports().subscribe({
      next: (data: any) => {
        if (data) {
          this.allAirports = data.airports || [];
          this.departureAirports = data.departureAirports || this.allAirports;
          this.arrivalAirports = data.arrivalAirports || this.allAirports;
          this.routesMap = data.routes || {};

          this.filteredDepartureAirports = [...this.departureAirports];
          this.filteredArrivalAirports = [...this.arrivalAirports];
        }
      },
      error: (err) => {
        console.error("Failed to load airports:", err);
      },
    });
  }

  filterDepartureAirports(): void {
    const query = (this.departureAirport || "").toLowerCase().trim();
    if (!query) {
      this.filteredDepartureAirports = [...this.departureAirports];
    } else {
      this.filteredDepartureAirports = this.departureAirports.filter((apt) =>
        apt.toLowerCase().includes(query)
      );
    }
  }

  onDepartureSelected(airport: string): void {
    this.departureAirport = airport;
    // Update arrival options based on routes from this departure
    if (this.routesMap[airport] && this.routesMap[airport].length > 0) {
      this.filteredArrivalAirports = this.routesMap[airport].filter(
        (a) => a.toLowerCase() !== airport.toLowerCase()
      );
    } else {
      this.filteredArrivalAirports = this.arrivalAirports.filter(
        (a) => a.toLowerCase() !== airport.toLowerCase()
      );
    }

    // If currently selected arrival is the same as departure, clear it
    if (
      this.arrivalAirport &&
      this.arrivalAirport.toLowerCase() === airport.toLowerCase()
    ) {
      this.arrivalAirport = "";
    }
  }

  filterArrivalAirports(): void {
    const query = (this.arrivalAirport || "").toLowerCase().trim();
    const dep = (this.departureAirport || "").toLowerCase().trim();

    let baseList = this.arrivalAirports;
    if (this.departureAirport && this.routesMap[this.departureAirport]) {
      baseList = this.routesMap[this.departureAirport];
    }

    // Filter out the selected departure airport
    baseList = baseList.filter((apt) => apt.toLowerCase() !== dep);

    if (!query) {
      this.filteredArrivalAirports = [...baseList];
    } else {
      this.filteredArrivalAirports = baseList.filter((apt) =>
        apt.toLowerCase().includes(query)
      );
    }
  }

  onArrivalSelected(airport: string): void {
    this.arrivalAirport = airport;
  }

  getAirportCode(airport: string): string {
    const codes: { [key: string]: string } = {
      Ahmedabad: "AMD",
      Bangalore: "BLR",
      Bengaluru: "BLR",
      Chennai: "MAA",
      Delhi: "DEL",
      Hyderabad: "HYD",
      Kolkata: "CCU",
      Mumbai: "BOM",
      Pune: "PNQ",
      Jaipur: "JAI",
      Kochi: "COK",
      Lucknow: "LKO",
      Chandigarh: "IXC",
      Surat: "STV",
      Goa: "GOI",
      Indore: "IDR",
      Bhopal: "BHO",
      Amritsar: "ATQ",
      Patna: "PAT",
      Kanpur: "KNU",
      Varanasi: "VNS",
    };
    return codes[airport] || "";
  }

  get passengerCount(): number {
    return this.adultCount + this.childCount + this.infantCount;
  }

  get passengerCountText(): string {
    return `${this.passengerCount} Passenger${
      this.passengerCount > 1 ? "s" : ""
    }`;
  }

  toggleCounter(event?: Event): void {
    event?.stopPropagation();
    this.showCounter = !this.showCounter;
    this.showClassDropdown = false;
  }

  toggleClassDropdown(event?: Event): void {
    event?.stopPropagation();
    this.showClassDropdown = !this.showClassDropdown;
    this.showCounter = false;
  }

  increment(type: "adult" | "child" | "infant"): void {
    if (this.passengerCount >= 9) return;

    if (type === "adult") this.adultCount++;
    if (type === "child") this.childCount++;
    if (type === "infant") this.infantCount++;
  }

  decrement(type: "adult" | "child" | "infant"): void {
    if (type === "adult" && this.adultCount > 1) this.adultCount--;
    if (type === "child" && this.childCount > 0) this.childCount--;
    if (type === "infant" && this.infantCount > 0) this.infantCount--;
  }

  selectClass(classType: string): void {
    this.selectedClass = classType;
    this.showClassDropdown = false;
  }

  formatDateTime(date: Date): string {
    if (date != null) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());

      // Send local midnight with India timezone offset (+05:30) to prevent UTC date shifting
      return `${year}-${month}-${day}T00:00:00.000+05:30`;
    }
    throw new Error("Invalid date");
  }

  onSubmit() {
    if (!this.departureAirport || !this.departureAirport.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Departure Airport",
        text: "Please select or enter a departure airport.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!this.arrivalAirport || !this.arrivalAirport.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Arrival Airport",
        text: "Please select or enter an arrival airport.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (
      this.departureAirport.trim().toLowerCase() ===
      this.arrivalAirport.trim().toLowerCase()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Route",
        text: "Departure and arrival airports cannot be the same.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!this.departureTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Departure Date",
        text: "Please select a departing date.",
        confirmButtonText: "OK",
      });
      return;
    }

    const depDate = new Date(this.departureTime);
    depDate.setHours(0, 0, 0, 0);

    const flight: any = {
      departureAirport: this.departureAirport.toLowerCase().trim(),
      arrivalAirport: this.arrivalAirport.toLowerCase().trim(),
      departureDate: this.formatDateTime(depDate),
      personCount: this.passengerCount,
      flightClass: this.selectedClass,
    };

    if (this.arrivalTime) {
      flight.arrivalDate = this.formatDateTime(this.arrivalTime);
    }

    // console.log(flight);
    // console.log("Departure:", this.departureTime, "Arrival:", this.arrivalTime);

    this.isLoading = true;
    this.service.getFlightByAllDetails(flight).subscribe(
      (response) => {
        this.isLoading = false;
        // Success popup
        Swal.fire({
          icon: "success",
          title: "Flights Loaded Successfully ✈️",
          text:
            response.message ||
            "We found matching flights based on your search criteria.",
          confirmButtonText: "View Results",
        }).then(() => {
          // console.log("Flight search response:", response);
          // You can add logic here to show or navigate to the results
          this.router.navigate(["/flight-result"], {
            state: { flights: response, count: this.passengerCount }, // Pass count directly
          });
        });
      },
      (error) => {
        // Error popup
        let errorMessage =
          "We couldn't find any flights matching your search. Please try different dates or locations.";

        if (error.error && error.error.message) {
          errorMessage = error.error.message; // Custom message from backend
        }

        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "No Flights Found 😔",
          text: errorMessage,
          confirmButtonText: "Try Again",
        });
      }
    );
  }

  get minDate(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  validateDate(event: any, type: "departure" | "arrival") {
    const selectedRaw = new Date(event.value); // Raw selected date
    const today = new Date(); // Today's date for comparison

    // Strip both dates to compare day-wise only
    const selectedDateOnly = new Date(
      selectedRaw.setHours(0, 0, 0, 0)
    ).getTime();
    const todayDateOnly = new Date(today.setHours(0, 0, 0, 0)).getTime();

    if (selectedDateOnly < todayDateOnly) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date!",
        text: `${
          type === "departure" ? "Departure" : "Arrival"
        } date cannot be in the past.`,
      });

      // Reset the selected date if it's invalid
      if (type === "departure") {
        this.departureTime = null;
      } else {
        this.arrivalTime = null;
      }
      return;
    }

    // Always set time to midnight (00:00:00) so date represents pure calendar day
    selectedRaw.setHours(0, 0, 0, 0);

    // Assign date to the respective field
    if (type === "departure") {
      this.departureTime = selectedRaw;
    } else {
      this.arrivalTime = selectedRaw;
    }

    // If selected date is today, append current time
    // let finalDate: Date;
    // if (selectedDateOnly === todayDateOnly) {
    //   const now = new Date();
    //   finalDate = new Date(
    //     selectedRaw.getFullYear(),
    //     selectedRaw.getMonth(),
    //     selectedRaw.getDate(),
    //     now.getHours(),
    //     now.getMinutes(),
    //     now.getSeconds()
    //   );
    // } else {
    //   // Future date, set time to 00:00 (or leave as is)
    //   finalDate = new Date(
    //     selectedRaw.getFullYear(),
    //     selectedRaw.getMonth(),
    //     selectedRaw.getDate()
    //   );
    // }

    // // Assign updated date to model
    // if (type === 'departure') {
    //   this.departureTime = finalDate;
    // } else {
    //   this.arrivalTime = finalDate;
    // }
  }

  @HostListener("document:click", ["$event"])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isPassenger =
      target.closest(".passenger-group") ||
      target.closest(".passenger-counter");
    const isClass =
      target.closest(".class-group") || target.closest(".class-dropdown");

    if (!isPassenger) this.showCounter = false;
    if (!isClass) this.showClassDropdown = false;
  }
}
