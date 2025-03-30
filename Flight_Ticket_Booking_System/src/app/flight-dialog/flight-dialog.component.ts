import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightAuthServiceService } from '../services/flight-auth-service.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-flight-dialog',
  standalone: false,
  templateUrl: './flight-dialog.component.html',
  styleUrls: ['./flight-dialog.component.css'],
})
export class FlightDialogComponent {
  isEditing = false;
  selectedFlight: any = {
    flightNumber: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    departureAirport: '',
    arrivalAirport: '',
    price: null,
    seatsAvailable: null,
    durationMinutes: null,
    airlineName: '',
    flightClass: ''
  };

  flightClasses: string[] = ['Economy', 'Business', 'First Class'];

  constructor(
    public dialogRef: MatDialogRef<FlightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private flightService: FlightAuthServiceService
  ) {
    if (data.flight) {
      this.isEditing = true;
      this.selectedFlight = { ...data.flight };
    }
  }

  onNoClick(): void {
    Swal.fire({
      icon: 'info',
      title: 'Operation Cancelled!',
      text: 'The flight details were not updated!',
      confirmButtonText: 'OK',
    });
    this.dialogRef.close();
  }

  submitForm(flightForm: NgForm): void {
    if (flightForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input!',
        text: 'Please fill in all required fields correctly.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.isEditing) {
      this.flightService.updateFlight(this.selectedFlight).subscribe(
        () => {
          this.dialogRef.close(true);
          Swal.fire({
            icon: 'success',
            title: 'Flight Updated Successfully!',
            text: 'The flight details were updated.',
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Flight!',
            text: error.error?.message || 'An unexpected error occurred.',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      this.flightService.saveFlightData(this.selectedFlight).subscribe(
        () => {
          this.dialogRef.close(true);
          Swal.fire({
            icon: 'success',
            title: 'Flight Added Successfully!',
            text: 'The new flight was added.',
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Adding Flight!',
            text: error.error?.message || 'An unexpected error occurred.',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }

  calculateDuration(): void {
    if (!this.selectedFlight.departureDate || !this.selectedFlight.arrivalDate || !this.selectedFlight.departureTime || !this.selectedFlight.arrivalTime) {
      this.selectedFlight.durationMinutes = null;
      return;
    }

    const departureDateTime = new Date(`${this.selectedFlight.departureDate}T${this.selectedFlight.departureTime}`);
    const arrivalDateTime = new Date(`${this.selectedFlight.arrivalDate}T${this.selectedFlight.arrivalTime}`);

    const durationMs = arrivalDateTime.getTime() - departureDateTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000); // Convert milliseconds to minutes

    this.selectedFlight.durationMinutes = durationMinutes >= 0 ? durationMinutes : null;
  }
}
