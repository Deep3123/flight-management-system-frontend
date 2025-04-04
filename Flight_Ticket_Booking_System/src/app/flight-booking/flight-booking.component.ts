import { Component } from "@angular/core";

@Component({
  selector: "app-flight-booking",
  standalone: false,
  templateUrl: "./flight-booking.component.html",
  styleUrl: "./flight-booking.component.css",
})
export class FlightBookingComponent {
  // // Toggle calendar display
  // showCalendar: boolean = false;

  // // Dropdown toggles (for passengers & class)
  // showPassengerDropdown: boolean = false;
  // showClassDropdown: boolean = false;

  // // Selected values for form dropdowns
  // selectedPassenger: string = "1 Adult";
  // selectedClass: string = "Economy Class";

  // // Flexible dates toggle flag
  // flexibleDates: boolean = false;

  // // Selected date from the calendar
  // selectedDate: Date | null = null;

  // // Calendar generation:
  // currentMonth: Date = new Date(); // current month (will use the 1st day of month)
  // calendar1: CalendarCell[][] = []; // calendar grid for currentMonth
  // calendar2: CalendarCell[][] = []; // calendar grid for next month

  // ngOnInit(): void {
  //   // Reset currentMonth to the first of the month.
  //   this.currentMonth = new Date(
  //     this.currentMonth.getFullYear(),
  //     this.currentMonth.getMonth(),
  //     1
  //   );
  //   this.updateCalendars();
  // }

  // // Toggle the calendar display
  // toggleCalendar(): void {
  //   this.showCalendar = !this.showCalendar;
  // }

  // // Dropdown toggles and selections
  // togglePassengerDropdown(): void {
  //   this.showPassengerDropdown = !this.showPassengerDropdown;
  // }

  // toggleClassDropdown(): void {
  //   this.showClassDropdown = !this.showClassDropdown;
  // }

  // selectPassenger(passenger: string): void {
  //   this.selectedPassenger = passenger;
  //   this.showPassengerDropdown = false;
  // }

  // selectClass(cls: string): void {
  //   this.selectedClass = cls;
  //   this.showClassDropdown = false;
  // }

  // toggleFlexibleDates(): void {
  //   this.flexibleDates = !this.flexibleDates;
  // }

  // // Navigate to the next month (updates both calendar views)
  // navigateNext(): void {
  //   this.currentMonth = new Date(
  //     this.currentMonth.getFullYear(),
  //     this.currentMonth.getMonth() + 1,
  //     1
  //   );
  //   this.updateCalendars();
  // }

  // // Generate a 6-week (42 cells) calendar grid for a given month.
  // generateCalendar(monthDate: Date): CalendarCell[][] {
  //   const year = monthDate.getFullYear();
  //   const month = monthDate.getMonth();
  //   const firstDayOfMonth = new Date(year, month, 1);

  //   // Adjusting so Monday is the first day. (JS: Sunday === 0, so treat 0 as 7)
  //   let dayOfWeek = firstDayOfMonth.getDay();
  //   dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  //   const offset = dayOfWeek - 1; // days to subtract to reach the Monday of the first week

  //   // Start date for the grid (could be from the previous month)
  //   const startDate = new Date(year, month, 1 - offset);

  //   const weeks: CalendarCell[][] = [];
  //   let current = new Date(startDate);

  //   // Always generate 6 weeks (6 * 7 = 42 cells)
  //   for (let week = 0; week < 6; week++) {
  //     const weekCells: CalendarCell[] = [];
  //     for (let i = 0; i < 7; i++) {
  //       weekCells.push({
  //         date: new Date(current),
  //         inCurrentMonth: current.getMonth() === month,
  //       });
  //       current.setDate(current.getDate() + 1);
  //     }
  //     weeks.push(weekCells);
  //   }
  //   return weeks;
  // }

  // // Update both calendar views.
  // updateCalendars(): void {
  //   // Calendar for the current month
  //   this.calendar1 = this.generateCalendar(this.currentMonth);

  //   // Calendar for the next month
  //   const nextMonth = new Date(
  //     this.currentMonth.getFullYear(),
  //     this.currentMonth.getMonth() + 1,
  //     1
  //   );
  //   this.calendar2 = this.generateCalendar(nextMonth);
  // }

  // // Handle a date click. You can expand this logic if needed.
  // onDateSelect(cell: CalendarCell): void {
  //   // Allow selection only for dates visible in the current month view (optional)
  //   if (
  //     !cell.inCurrentMonth &&
  //     cell.date.getMonth() !== this.currentMonth.getMonth()
  //   ) {
  //     return;
  //   }
  //   this.selectedDate = cell.date;
  //   console.log("Selected date:", this.selectedDate);
  // }

  // // Helper to format a month label (e.g., 'April 2025')
  // getMonthYear(date: Date): string {
  //   return date.toLocaleString("default", { month: "long", year: "numeric" });
  // }

  // // Helper to compare dates (ignoring the time)
  // isSameDate(d1: Date, d2: Date): boolean {
  //   return (
  //     d1.getFullYear() === d2.getFullYear() &&
  //     d1.getMonth() === d2.getMonth() &&
  //     d1.getDate() === d2.getDate()
  //   );
  // }
}
