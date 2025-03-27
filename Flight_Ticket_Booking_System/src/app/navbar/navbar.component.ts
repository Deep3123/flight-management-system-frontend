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

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    // Subscribe to the login status
    this.authService.isLoggedIn$.subscribe((loggedInStatus) => {
      this.isLoggedIn = loggedInStatus;
    });
  }

  logout(): void {
    this.authService.logout(); // Call logout method from AuthService
    Swal.fire({
      icon: "info",
      title: "Logged Out",
      text: "You have successfully logged out.",
      confirmButtonText: "OK",
    });
    this.route.navigate(["/"]);
  }
}
