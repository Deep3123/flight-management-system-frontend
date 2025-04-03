import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ContactUsDialogComponent } from "../contact-us-dialog/contact-us-dialog.component"; // Import dialog component
import Swal from "sweetalert2";
import { ContactServiceService } from "../services/contact-service.service";

declare var $: any; // Declare jQuery for DataTable initialization

@Component({
  selector: "app-contact-us-page",
  standalone: false,
  templateUrl: "./contact-us-page.component.html",
  styleUrls: ["./contact-us-page.component.css"],
})
export class ContactUsPageComponent implements OnInit {
  contacts: any[] = [];

  constructor(
    private contactService: ContactServiceService, // Contact service
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllContacts();
  }

  // Fetch all contact queries from the backend
  getAllContacts() {
    this.contactService.getAllContactData().subscribe(
      (response: any) => {
        this.contacts = response;
        this.reinitializeDataTable(); // Reinitialize DataTable
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error Fetching Data",
          text: "There was an issue fetching contact queries.",
          confirmButtonText: "OK",
        });
      }
    );
  }

  // Open dialog with full details of the contact query
  viewContact(contact: any): void {
    const dialogRef = this.dialog.open(ContactUsDialogComponent, {
      width: "600px",
      data: { contact: contact },
    });

    dialogRef.afterClosed().subscribe(() => {
      // Swal.fire({
      //   icon: "info",
      //   title: "Closed View",
      //   text: "You have closed the contact query details.",
      //   confirmButtonText: "OK",
      // });
      // Optionally, you can refresh the list of contacts
      this.getAllContacts();
    });
  }

  // Delete contact query with confirmation
  deleteContact(contact: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete API from service
        this.contactService.deleteContact(contact).subscribe(
          (response) => {
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully!",
              text: "The contact query has been deleted.",
              confirmButtonText: "OK",
            });
            // Refresh the contact list
            this.getAllContacts();
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error Deleting Query",
              text: "There was an issue deleting the contact query.",
              confirmButtonText: "OK",
            });
          }
        );
      }
      else{
        Swal.fire({
          icon: "info",
          title: "Deletion Cancelled",
          text: "The contact query was not deleted.",
          confirmButtonText: "OK",
        });        
      }
    });
  }

  // Reinitialize DataTable with new data
  reinitializeDataTable() {
    setTimeout(() => {
      if ($.fn.dataTable.isDataTable("#contactUsTable")) {
        $("#contactUsTable").DataTable().destroy();
      }
      $("#contactUsTable").DataTable({
        destroy: true,
        responsive: true,
        paging: true,
        searching: true,
      });
    }, 100);
  }

  trackByFn(index: number, contact: any) {
    return contact.id;
  }
}
