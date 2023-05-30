import { WarehouseService } from './../warehouse.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
export interface Product {
  id: number;
  name: string;
  address: string;
  status: string;
}

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent {
  ip_address = '192.168.1.9:8000';
  taskToEdit: any;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  products: any[] = [];
  product: Product = { id: 0, name: '', address: '', status: '' };
  closeResult: any;

  public url = 'http://' + this.ip_address + '/inventory/warehouses/';
  totalItems: any;

  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    public warehouseService: WarehouseService
  ) {
    this.getwarehouse();
  }
  ngOnInit(): void {
    this.getwarehouse();
  }

  newProduct = { name: '', address: '', status: '' };
  addProduct() {
    Swal.fire({
      title: 'Add Warehouse',
      html: `
      <div class="form-group">
      <label for="supplierTitle" class="float-start my-2"> Title:</label>
      <input type="text" id="productName" class="form-control" class="form-control" placeholder="Warehouse Name" >
    </div><br>
      <div class="form-group">
      <label for="supplierTitle" class="float-start my-2"> Address:</label>
      <input type="text"  id="productAddress" class="form-control" class="form-control" placeholder="Warehouse Address" >
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
        const productAddress = (<HTMLInputElement>(
          document.getElementById('productAddress')
        )).value;
        const productStatus = (<HTMLSelectElement>(
          document.getElementById('productStatus')
        )).value;

        if (!productName) {
          Swal.showValidationMessage('Warehouse name is required');
        } else {
          const newProduct = {
            name: productName,
            address: productAddress,
            status: productStatus,
          };
          this.http.post<Product>(this.url, newProduct).subscribe(() => {
            this.newProduct = { name: '', address: '', status: '' };
            this.getwarehouse();
            Swal.fire('Added!', 'Your Warehouse has been added.', 'success');
          });
        }
      },
    });
  }

  getwarehouse() {
    this.warehouseService.GetWarehouse().subscribe((response) => {
      this.products = <any>response.results;
    });
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
      <input type="text" id="productAddress" class="form-control swal2" placeholder="Address"  value="${
        product.address
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
        const updatedAddress = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedStatus = (<HTMLInputElement>(
          document.querySelector('.form-select')
        )).value;
        this.http
          .put(`${this.url}${product.id}/`, {
            name: updatedName,
            address: updatedAddress,
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

    const data = this.products.map((product, index) => ({
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
      this.products = this.products.filter((res) => {
        return res.name.match(this.name);
      });
    }
  }
}
