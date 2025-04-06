import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-results',
  standalone: false,
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.css']
})
export class FlightResultsComponent implements OnInit {
  flightResults: any[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.flightResults = nav?.extras?.state?.['flights'] || [];
  }

  ngOnInit(): void {
    // You can handle cases like no results here
  }
}
