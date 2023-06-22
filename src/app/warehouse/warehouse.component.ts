import { WarehouseService } from './../warehouse.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { LocalhostApiService } from '../localhost-api.service';
export interface Product {
  id: number;
  name: string;
  contact: number;
  email: string;
  status: string;
}

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent {
  taskToEdit: any;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  products: any = {};
  product: Product = { id: 0, name: '', contact: 0, email: '', status: '' };
  closeResult: any;

  public url = this.api.localhost + '/inventory/warehouses/';
  totalItems: any;

  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    public warehouseService: WarehouseService,
    public api: LocalhostApiService
  ) {
    this.getwarehouse();
  }
  ngOnInit(): void {
    this.getwarehouse();
  }

  newProduct = { title: '', contact: '', email: '', status: '' };
  addProduct() {
    Swal.fire({
      title: 'Add Warehouse',
      html: `
      <div class="form-group">
      <label for="supplierTitle" class="float-start my-2"> Title:</label>
      <input type="text" id="productName" class="form-control" class="form-control" placeholder="Warehouse Name" >
    </div><br>
      <div class="form-group">
      <label for="supplierTitle" class="float-start my-2"> Contact:</label>
      <input type="number"  id="productContact" class="form-control" class="form-control" placeholder="Warehouse Contact" >
    </div><br>
      <div class="form-group">
      <label for="supplierTitle" class="float-start my-2"> Email:</label>
      <input type="text"  id="productEmail" class="form-control" class="form-control" placeholder="Warehouse Email" >
    </div><br>
    <div class="form-group">
    <label for="supplierStatus" class="float-start my-2"> Status:</label> 
    <select id="productStatus" class="form-select">
      <option value="1"}>Enabled</option>
      <option value="0"}>Disabled</option>
    </select>
  </div>
    
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const productName = (<HTMLInputElement>(
          document.getElementById('productName')
        )).value;
        const productContact = (<HTMLInputElement>(
          document.getElementById('productContact')
        )).value;
        const productEmail = (<HTMLInputElement>(
          document.getElementById('productEmail')
        )).value;
        const productStatus = (<HTMLSelectElement>(
          document.getElementById('productStatus')
        )).value;

        if (!productName) {
          Swal.showValidationMessage('Warehouse Name is required');
        } else {
          const newProduct = {
            title: productName,
            email: productEmail,
            contact: productContact,
            status: productStatus,
          };
          this.http.post<Product>(this.url, newProduct).subscribe(() => {
            this.newProduct = { title: '', contact: '', email: '', status: '' };
            this.getwarehouse();
            Swal.fire('Added!', 'Your Warehouse has been added.', 'success');
          });
        }
        this.getwarehouse();
      },
    });
  }

  getwarehouse() {
    this.warehouseService.GetWarehouse().subscribe((response) => {
      this.products = <any>response;
      this.addCount(this.products);
    });
  }

  search() {
    this.searchSale(this.searchTerm);
  }
  public searchurl = this.api.localhost + '/inventory/warehouses/';
  searchTerm: any;
  searchSale(searchTerm: any) {
    const searchUrl = this.url + '?search=' + searchTerm;
    this.http.get(searchUrl).subscribe((res: any) => {
      this.products = res;
      this.addCount(this.products);
    });
  }

  addCount(data: any) {
    let pageSize = 10;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }
  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.url}${id}`).subscribe(() => {
          console.log(`Product with ID ${id} deleted successfully!`);
          this.getwarehouse();
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'info');
      }
    });
  }
  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }
  openUpdateModal(product: Product) {
    Swal.fire({
      title: 'Update Warehouse',
      html: `
      <div class="form-group">
      <label class="float-start my-2">Name:</label>
      <input type="text" id="productName" class="form-control swal1" placeholder="Name"  value="${
        product.name
      }">
      </div>
      <div class="form-group">
      <br><label class="float-start my-2">Address:</label>
      <input type="text" id="productEmail" class="form-control swal2" placeholder="Address"  value="${
        product.email
      }">
      </div>
      <br>
      <div class="form-group">
      <br><label class="float-start my-2">Address:</label>
      <input type="text" id="productContact" class="form-control swal3" placeholder="Address"  value="${
        product.contact
      }">
      </div>
      <br>
      <div class="form-group">
      <label class="float-start my-2">Status:</label>
      <select id="productStatus" class="form-select">
        <option value="1" ${
          product.status == '1' ? 'selected' : ''
        }>Enabled</option>
        <option value="0" ${
          product.status == '0' ? 'selected' : ''
        }>Disabled</option>
      </select>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedName = (<HTMLInputElement>document.querySelector('.swal1'))
          .value;
        const productEmail = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedContact = (<HTMLInputElement>(
          document.querySelector('.swal3')
        )).value;
        const updatedStatus = (<HTMLInputElement>(
          document.querySelector('.form-select')
        )).value;
        this.http
          .put(`${this.url}${product.id}/`, {
            name: updatedName,
            email: productEmail,
            contact: updatedContact,
            status: updatedStatus,
          })
          .subscribe(() => {
            console.log(`Product with ID ${product.id} updated successfully!`);
            this.getwarehouse();
            Swal.fire(
              'Updated!',
              'Your warehouse has been updated.',
              'success'
            );
          });
      }
    });
  }
  generatePDF() {
    const columns2 = { title: 'All Warehouse List' };
    // const columns2 = { title: 'All Warehouse List' };
    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Address', dataKey: 'address' },
      { title: 'Status', dataKey: 'status' },
    ];

    const data = this.products.map((product: any, index: any) => ({
      sn: index + 1,
      name: product.name,
      address: product.address,
      status: product.status === '1' ? 'Enabled' : 'Disabled',
    }));

    const doc = new jsPDF();
    doc.text(columns2.title, 86, 8);
    doc.setFontSize(22);
    doc.text('All Warehouses', 14, 22);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });

    doc.save('all_warehouses.pdf');
  }
  p: any;
  name: any;
  Search() {
    if (this.name == '') {
      this.ngOnInit();
    } else {
      this.products = this.products.filter((res: any) => {
        return res.name.match(this.name);
      });
    }
  }
}
