import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

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
  ) {}
  staffs: any[] = [];
  getStaff() {
    this.http
      .get<any>(this.api.localhost + '/inventory/staff_members/')
      .subscribe((response) => {
        this.staffs = response.results;
        console.log(this.staffs);
      });
  }
  purchaseForm: any = FormGroup;
  purchaseForm2: any = FormGroup;

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
    this.purchaseForm2 = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      is_active: ['', Validators.required],
      permission: ['', Validators.required],
      password: ['', Validators.required],
      // isStaff: ['', Validators.required],
    });
    this.getPermission();
    this.getStaff();
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
      .get<any>(this.api.localhost + '/inventory/groups/')
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
        this.api.localhost + '/inventory/staff_members/',
        requestBody
      )
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Staff added successfully.',
          });
          this.getStaff();
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
              this.api.localhost + '/inventory/staff_members/'
            }${id}`
          )
          .subscribe(() => {
            // console.log(`Customer with ID ${id} deleted successfully!`);
            // this.getCustomers();
            Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
          });
        this.getStaff();
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your Customer is safe :)', 'info');
      }
    });
  }
  // open(content: any, selectedId: number) {
  //   this.modalService.open(content);
  //   const selectedStaff = this.permissions.find(
  //     (permission) => permission.id === selectedId
  //   );
  //   const formData = new FormData();
  //   formData.append('username', this.purchaseForm2.get('username')?.value);
  //   formData.append('firstname', this.purchaseForm2.get('first_name')?.value);
  //   formData.append('last_name', this.purchaseForm2.get('last_name')?.value);
  //   formData.append('email', this.purchaseForm2.get('email')?.value);
  //   formData.append('permission', this.purchaseForm2.get('permission')?.value);
  //   formData.append('status', this.purchaseForm2.get('status')?.value);
  //   console.log(formData);
  // }
  openUpdateModal(staff: any) {
    Swal.fire({
      title: 'Update Staff Detail',
      html: `
    <div class="update_form">
      <div class="form-group ">
        <div class="col">
          <label for="supplierTitle" class="float-start my-2">Username:</label>
          <input type="text" id="supplierTitle" class="form-control" placeholder="Username" value="${
            staff.username
          }">
        </div>
        <div class="col">
          <label for="firstname" class="float-start my-2">Firstname:</label>
          <input type="text" id="firstname" class="form-control" placeholder="Firstname" value="${
            staff.first_name
          }">
        </div>
      </div><br>
      <div class="form-group row">
        <div class="col">
          <label for="lastname" class="float-start my-2">Lastname:</label>
          <input type="text" id="lastname" class="form-control" placeholder="Lastname" value="${
            staff.last_name
          }">
        </div>
      </div><br>
      <div class="form-group row">
        <div class="col">
          <label for="email" class="float-start my-2">Email:</label>
          <input type="text" id="email" class="form-control" placeholder="Email" value="${
            staff.email
          }">
        </div>
      </div><br>
      <div class="form-group row">
        <div class="col">
          <label for="Status" class="float-start my-2">Status:</label>
          <select id="Status" class="form-select">
            <option value="1" ${
              staff.is_active ? 'selected' : ''
            }>Active</option>
            <option value="0" ${
              !staff.is_active ? 'selected' : ''
            }>Inactive</option>
          </select>
        </div>
      </div>
    </div><br>
    `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsername = (<HTMLInputElement>(
          document.querySelector('#supplierTitle')
        )).value;
        const updatedFirstname = (<HTMLInputElement>(
          document.querySelector('#firstname')
        )).value;
        const updatedLastname = (<HTMLInputElement>(
          document.querySelector('#lastname')
        )).value;
        const updatedEmail = (<HTMLInputElement>(
          document.querySelector('#email')
        )).value;
        const updatedStatus =
          (<HTMLSelectElement>document.querySelector('#Status')).value === '1';

        this.http
          .put(
            `${this.api.localhost + '/inventory/staff_members/'}${
              staff.id
            }/`,
            {
              username: updatedUsername,
              first_name: updatedFirstname,
              last_name: updatedLastname,
              email: updatedEmail,
              is_active: updatedStatus,
            }
          )
          .subscribe(() => {
            Swal.fire(
              'Updated!',
              'Your staff member has been updated.',
              'success'
            );
            this.getStaff();
          });
      }
    });
  }

  updateProduct: any;
  update_product(staff: any) {
    this.updateProduct = staff;
  }
  username: any;
  Search() {
    if (this.username == '') {
      this.ngOnInit();
    } else {
      this.staffs = this.staffs.filter((res) => {
        return res.username.match(this.username);
      });
    }
  }
  generatePDF() {
    const columns2 = { title: 'All Staff list' };

    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Username', dataKey: 'username' },
      { title: 'Firstname', dataKey: 'first_name' },
      { title: 'Lastname', dataKey: 'last_name' },
      { title: 'Status', dataKey: 'status' },
      { title: 'Email', dataKey: 'email' },
    ];

    const data = this.staffs.map((staff, index) => ({
      sn: index + 1,
      title: staff.username,
      address: staff.first_name,
      balance: staff.last_name,
      status: staff.is_active,
      email: staff.email,
    }));

    const doc = new jsPDF();
    doc.text(columns2.title, 86, 8);

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('all_Staff.pdf');
  }
  currentPage: any;
  p: any;
  onPageChange(event: any) {
    this.currentPage = event;
    this.getStaff();
  }
  staff: any;
  product: any;
}
