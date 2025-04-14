import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FlightDialogComponent } from "../flight-dialog/flight-dialog.component";
import { FlightAuthServiceService } from "../services/flight-auth-service.service";
import Swal from "sweetalert2";

declare var $: any; // Declare jQuery for DataTable initialization

@Component({
  selector: "app-flight-page",
  standalone: false,
  templateUrl: "./flight-page.component.html",
  styleUrls: ["./flight-page.component.css"],
})
export class FlightPageComponent implements OnInit {
  flights: any[] = [];

  constructor(
    private flightService: FlightAuthServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllFlights();
  }

  getAllFlights() {
    this.flightService.getAllFlights().subscribe(
      (response: any) => {
        console.log(response); // Debugging
        this.flights = response;
        this.reinitializeDataTable(); // Ensure DataTable updates correctly
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.message ||
            error.error.message ||
            "Error while fetching data!",
          confirmButtonText: "OK",
        });
      }
    );
  }

  openForm(): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: "600px",
      data: { flight: null },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllFlights();
    });
  }

  editFlight(flight: any): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: "600px",
      data: { flight: flight },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllFlights();
    });
  }

  deleteFlight(flight: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion if the user confirms
        this.flightService.deleteFlight(flight.flightNumber).subscribe(
          (response) => {
            Swal.fire({
              icon: "success",
              title: "Flight Deleted!",
              text: response.message,
              confirmButtonText: "OK",
            });
            this.getAllFlights(); // Refresh the flight list
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error Deleting Flight!",
              text: error.error.message,
              confirmButtonText: "OK",
            });
          }
        );
      } else {
        // Optionally, show a cancellation message if the user cancels
        Swal.fire({
          icon: "info",
          title: "Deletion Cancelled",
          text: "The flight details have not been deleted.",
          confirmButtonText: "OK",
        });
      }
    });
  }

  reinitializeDataTable() {
    setTimeout(() => {
      if ($.fn.dataTable.isDataTable("#flightTable")) {
        $("#flightTable").DataTable().destroy();
      }
      $("#flightTable").DataTable({
        destroy: true,
        responsive: true,
        paging: true,
        searching: true,
      });
    }, 100);
  }

  trackByFn(index: number, flight: any) {
    return flight.id;
  }
}
