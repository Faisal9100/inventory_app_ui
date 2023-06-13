import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    });
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
      .get<any>('http://' + this.api.localhost + '/inventory/permissions/')
      .subscribe((response) => {
        this.permissions = response;
        console.log(response);
      });
  }
}
