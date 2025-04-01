import { Component } from "@angular/core";
import { ContactServiceService } from "../services/contact-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-contact",
  standalone: false,
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent {
  name: string = "";
  email: string = "";
  phoneNumber: string = "";
  message: string = "";

  constructor(private service: ContactServiceService) {}

  onSubmit(form: any) {
    if (form.invalid) return;

    const contactRequest = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      message: this.message,
    };

    this.service.saveContactData(contactRequest).subscribe(
      (response) => {
        // Success popup
        Swal.fire({
          icon: "success",
          title: "We received your query!",
          text: response.message,
          confirmButtonText: "OK",
        }).then(() => {
          // Reset form fields after success
          form.reset();
        });
      },
      (error) => {
        // Error popup
        let errorMessage = "Something went wrong. Please try again later.";

        if (error.error && error.error.message) {
          errorMessage = error.error.message; // If error contains a custom message from backend
        }

        Swal.fire({
          icon: "error",
          title: "Oops, something went wrong!",
          text: errorMessage,
          confirmButtonText: "OK",
        });
      }
    );
  }
}
