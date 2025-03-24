import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-forgot-password",
  standalone: false,
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent {
  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService
  ) {}
  // This method will be called when the form is submitted
  onSubmit(forgotPasswordForm: any) {
    if (forgotPasswordForm.valid) {
      const email = forgotPasswordForm.value.email;

      // Call the service to save the user data
      this.userAuthService.forgotPassword(email).subscribe(
        (response) => {
          // Display success pop-up on successful registration
          Swal.fire({
            icon: "success",
            title: "Email Sent Successfully!",
            text: response.message,
            confirmButtonText: "OK",
          }).then(() => {
            forgotPasswordForm.reset(); // Reset the form after successful registration
          });
        },
        (error) => {
          console.log(error);
          // Display error pop-up if registration fails
          Swal.fire({
            icon: "error",
            title: "Email has not been sent!",
            text: error.error.message,
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "Form Invalid",
        text: "Please fill in all fields correctly.",
        confirmButtonText: "OK",
      });
    }
  }
}
