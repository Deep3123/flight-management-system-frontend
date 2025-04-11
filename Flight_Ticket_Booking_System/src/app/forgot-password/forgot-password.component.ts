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
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService
  ) {}

  onSubmit(forgotPasswordForm: NgForm) {
    if (forgotPasswordForm.valid) {
      const email = forgotPasswordForm.value.email;
      this.isLoading = true;
      console.log("Loading started...");

      this.userAuthService.forgotPassword(email).subscribe(
        (response) => {
          this.isLoading = false;
          console.log("Loading finished");

          Swal.fire({
            icon: "success",
            title: "Email Sent Successfully!",
            text: response.message,
            confirmButtonText: "OK",
          }).then(() => {
            forgotPasswordForm.reset();
          });
        },
        (error) => {
          this.isLoading = false;
          console.error("Error occurred:", error);

          const errorMsg =
            error?.error?.message || error?.message || "Something went wrong!";

          Swal.fire({
            icon: "error",
            title: "Email has not been sent!",
            text: errorMsg,
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "Form Invalid",
        text: "Please enter a valid email address.",
        confirmButtonText: "OK",
      });
    }
  }
}
