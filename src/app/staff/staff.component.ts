import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  constructor(
    public http: HttpClient,
    private fb: FormBuilder,
    public api: LocalhostApiService,
    private modalService: NgbModal
  ) {
    this.getStaff();
  }
  staffs: any[] = [];
  getStaff() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/staff_members/')
      .subscribe((response) => {
        this.staffs = response;
      });
  }
  purchaseForm: any = FormGroup;

  ngOnInit(): void {
    this.purchaseForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      status: ['', Validators.required],
      permission: ['', Validators.required],
      password: ['', Validators.required],
      // isStaff: ['', Validators.required],
    });
    this.getPermission();
  }
  update_purchase_id: any;
  openAddProductModal(content3: any, item: any) {
    this.update_purchase_id = item.id;
    this.modalService.open(content3).result.then((result) => {
      if (result === 'add') {
        // this.addStock(this.purchaseId);
        // this.addProduct();
      }
    });
  }
  permissions: any[] = [];
  getPermission() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/groups/')
      .subscribe((response) => {
        this.permissions = response;
      });
  }
  // if (this.purchaseForm.invalid) {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error',
  //     text: 'Please fill in all the required fields.',
  //   });
  //   return;
  // }
  onSubmit() {
    if (this.purchaseForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the required fields.',
      });
      return;
    }
    const username = this.purchaseForm.get('username').value;
    const password = this.purchaseForm.get('password').value;
    const firstname = this.purchaseForm.get('firstname').value;
    const lastname = this.purchaseForm.get('lastname').value;
    const email = this.purchaseForm.get('email').value;
    const status = this.purchaseForm.get('status').value; // Extract the selected value from the object
    const permission = this.purchaseForm.get('permission').value.$ngOptionLabel; // Extract the selected value from the object
    // const isStaff = this.purchaseForm.get('isStaff').value.$ngOptionLabel;
    const group_id = this.purchaseForm.get('permission').value;

    const requestBody = {
      username: username,
      password: password,
      first_name: firstname,
      last_name: lastname,
      email: email,
      is_active: status,
      permission: permission,
      group: group_id,
    };

    this.http
      .post(
        'http://' + this.api.localhost + '/inventory/staff_members/',
        requestBody
      )
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Staff added successfully.',
          });
          this.purchaseForm.reset();
        },

        (error) => {
          console.error(error);
          if (error && error.error && error.error.username) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Username already exists.',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add staff.',
            });
          }
        }
      );
  }
  deleteStaff(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(
            `${
              'http://' + this.api.localhost + '/inventory/staff_members/'
            }${id}`
          )
          .subscribe(() => {
            console.log(`Customer with ID ${id} deleted successfully!`);
            // this.getCustomers();
            Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
          });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your Customer is safe :)', 'info');
      }
    });
  }
}
