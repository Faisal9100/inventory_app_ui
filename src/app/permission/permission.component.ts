import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalhostApiService } from '../localhost-api.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
})
export class PermissionComponent implements OnInit {
  currentPage: any;
  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    public api: LocalhostApiService
  ) {
    this.getGroups();
    this.getPermissions();
  }
  ngOnInit(): void {}

  deleteStaff() {}
  groups: any[] = [];
  permissions: any[] = [];
  update_purchase_id: any;
  item: any;
  // openAddProductModal(content3: any, item: any) {
  //   this.update_purchase_id = item.id;
  //   this.modalService.open(content3).result.then((result) => {
  //     if (result === 'add') {
  //       // this.addStock(this.purchaseId);
  //       // this.addProduct();
  //     }
  //   });
  // }
  getGroups() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/groups/')
      .subscribe((response) => {
        this.groups = response;
        console.log(this.groups);
      });
  }
  getPermissions() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/permissions/')
      .subscribe((response) => {
        this.permissions = response;
        console.log(this.permissions);
      });
  }
  onPageChange(event: any) {
    this.currentPage = event;
    this.getGroups();
  }
  p: any;
  pages: number[] = [];

  name: any;
  Search() {
    if (this.name === '') {
      this.ngOnInit();
    } else {
      this.permissions = this.permissions.filter((res) => {
        return res.name.includes(this.name);
      });
    }
  }
  open(content3: any) {
    this.modalService.open(content3, { size: 'lg' });
  }
}
