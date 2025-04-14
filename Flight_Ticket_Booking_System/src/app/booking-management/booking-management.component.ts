import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BookingDetailsDialogComponent } from '../booking-details-dialog/booking-details-dialog.component';
import { BookingServiceService } from '../services/booking-service.service';

declare var $: any;

@Component({
  selector: 'app-booking-management',
  standalone: false,
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.css']
})
export class BookingManagementComponent implements OnInit {
  bookings: any[] = [];

  isLoading: boolean = false;

  constructor(private bookingService: BookingServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings() {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.bookings = response;
        this.reinitializeDataTable();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Bookings',
          text: 'There was a problem loading bookings data.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  viewBookingDetails(booking: any): void {
    const dialogRef = this.dialog.open(BookingDetailsDialogComponent, {
      width: '600px',
      data: { booking: booking }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllBookings();
    });
  }

  deleteBookingDetails(booking: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.bookingService.deleteBooking(booking.paymentId).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully!",
              text: response.message,
              confirmButtonText: "OK",
            });
            this.getAllBookings();
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: "error",
              title: "Error Deleting Booking",
              text: error.message || error.error.message || "There was an issue deleting the booking.",
              confirmButtonText: "OK",
            });
          }
        );
      } else {
        Swal.fire({
          icon: "info",
          title: "Deletion Cancelled",
          text: "The booking was not deleted.",
          confirmButtonText: "OK",
        });
      }
    });
  }

  // reinitializeDataTable(): void {
  //   setTimeout(() => {
  //     const table = $('#bookingTable');
  //     if ($.fn.DataTable.isDataTable(table)) {
  //       table.DataTable().clear().destroy();
  //     }

  //     table.DataTable({
  //       responsive: true,
  //       paging: true,
  //       searching: true,
  //       ordering: true,
  //       columnDefs: [
  //         { orderable: false, targets: -1 } // Disable sorting for the "Actions" column
  //       ]
  //     });
  //   }, 0); // Set timeout to 0 to execute after DOM update
  // }

  reinitializeDataTable() {
    setTimeout(() => {
      if ($.fn.dataTable.isDataTable("#bookingTable")) {
        $("#bookingTable").DataTable().destroy();
      }
      $("#bookingTable").DataTable({
        destroy: true,
        responsive: true,
        paging: true,
        searching: true,
      });
    }, 100);
  }


  trackByFn(index: number, booking: any) {
    return booking.id;
  }
}
