import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth-service.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: false,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  darkMode: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    // Subscribe to the login status
    this.authService.isLoggedIn$.subscribe((loggedInStatus) => {
      this.isLoggedIn = loggedInStatus;
    });

    // Subscribe to the admin status
    this.authService.isAdmin$.subscribe((adminStatus) => {
      this.isAdmin = adminStatus;
    });

    // Check for saved theme in localStorage (only available in the browser)
    if (typeof window !== "undefined" && localStorage.getItem("theme")) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        this.darkMode = savedTheme === "dark";
        this.applyTheme();
      }
    }
  }

  logout(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out and redirected to the home page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, stay logged in!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with logout if the user confirms
        this.authService.logout(); // Call logout method from AuthService
        Swal.fire({
          icon: "info",
          title: "Logged Out",
          text: "You have successfully logged out.",
          confirmButtonText: "OK",
        });
        this.route.navigate(["/"]); // Navigate to the home page
      } else {
        // Optionally, show a cancellation message if the user cancels
        Swal.fire({
          icon: "info",
          title: "Logout Cancelled",
          text: "You are still logged in.",
          confirmButtonText: "OK",
        });
      }
    });
  }

  // Toggle dark/light mode
  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
  }

  // Apply the theme to the body and store in localStorage
  applyTheme(): void {
    if (typeof window !== "undefined") {
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    }
  }
}
