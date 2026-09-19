import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BookingDetailsDialogComponent } from "../booking-details-dialog/booking-details-dialog.component";
import { BookingServiceService } from "../services/booking-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-my-bookings",
  standalone: false,
  templateUrl: "./my-bookings.component.html",
  styleUrls: ["../booking-management/booking-management.component.css"],
})
export class MyBookingsComponent implements OnInit, AfterViewInit {
  bookings: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 10; 
  pageIndex = 0; 

  // Removed delete and download columns
  displayedColumns: string[] = [
    "position",
    "flightId",
    "amount",
    "bookingDate",
    "count",
    "name",
    "view",
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingServiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMyBookings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      if (sortHeaderId === 'name') {
        return `${data.firstName} ${data.lastName}`.toLowerCase();
      }
      return data[sortHeaderId];
    };

    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    });
  }

  getMyBookings() {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.bookings = response;
        this.dataSource.data = this.bookings;
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Error Fetching Bookings",
          text:
            error.message ||
            error.error?.message ||
            "There was a problem loading bookings data.",
          confirmButtonText: "OK",
          confirmButtonColor: "#4F46E5",
        });
      }
    );
  }

  getRowNumber(index: number): number {
    return this.pageIndex * this.pageSize + index + 1;
  }

  viewBookingDetails(booking: any): void {
    this.dialog.open(BookingDetailsDialogComponent, {
      width: "600px",
      data: { booking: booking },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  trackByFn(index: number, booking: any) {
    return booking.id;
  }
}
