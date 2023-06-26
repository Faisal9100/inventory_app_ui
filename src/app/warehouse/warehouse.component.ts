import { WarehouseService } from './../warehouse.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { LocalhostApiService } from '../localhost-api.service';
import html2canvas from 'html2canvas';
export interface Warehouse {
  id: number;
  title: string;
  contact: number;
  email: string;
  status: string;
  address: string;
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
  product: Warehouse = {
    id: 0,
    title: '',
    address: '',
    contact: 0,
    email: '',
    status: '',
  };
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

  newProduct = { title: '', contact: '', address: '', email: '', status: '' };
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
      <label for="supplierAddress" class="float-start my-2"> Address:</label>
      <input type="text"  id="productAddress" class="form-control" class="form-control" placeholder="Warehouse Address" >
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
        const productAddress = (<HTMLInputElement>(
          document.getElementById('productAddress')
        )).value;
        const productEmail = (<HTMLInputElement>(
          document.getElementById('productEmail')
        )).value;
        const productStatus = (<HTMLSelectElement>(
          document.getElementById('productStatus')
        )).value;

        if (!productName || !productAddress || !productEmail) {
          Swal.showValidationMessage('Title, Address and Email are required ');
        } else {
          const newProduct = {
            title: productName,
            email: productEmail,
            contact: productContact,
            status: productStatus,
            address: productAddress,
          };
          this.http.post<Warehouse>(this.url, newProduct).subscribe(() => {
            this.newProduct = {
              title: '',
              contact: '',
              address: '',
              email: '',
              status: '',
            };
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
      text: 'You will not be able to recover this warehouse!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.url}${id}`).subscribe(() => {
          console.log(`Warehouse with ID ${id} deleted successfully!`);
          this.getwarehouse();
          Swal.fire('Deleted!', 'Your warehouse has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your warehouse is safe :)', 'info');
      }
    });
  }
  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }
  openUpdateModal(warehouse: Warehouse) {
    Swal.fire({
      title: 'Update Warehouse',
      html: `
        <div class="form-group">
          <label class="float-start my-2">Name:</label>
          <input type="text" id="productName" class="form-control swal1" placeholder="Name" value="${
            warehouse.title
          }">
        </div>
        
        <div class="form-group">
          <br><label class="float-start my-2">Email:</label>
          <input type="text" id="warehouseEmail" class="form-control swal2" placeholder="Email" value="${
            warehouse.email || ''
          }">
        </div>
        
        <div class="form-group">
          <br><label class="float-start my-2">Address:</label>
          <input type="text" class="form-control swal3" placeholder="Address" value="${
            warehouse.address || ''
          }">
        </div>
   
        <div class="form-group">
          <br><label class="float-start my-2">Contact:</label>
          <input type="text" class="form-control swal4" placeholder="Contact" value="${
            warehouse.contact || ''
          }">
        </div>
     
        <div class="form-group">
          <label class="float-start my-2">Status:</label>
          <select id="warehouseStatus" class="form-select">
            <option value="1" ${
              warehouse.status == '1' ? 'selected' : ''
            }>Enabled</option>
            <option value="0" ${
              warehouse.status == '0' ? 'selected' : ''
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
        const warehouseEmail = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedContact = (<HTMLInputElement>(
          document.querySelector('.swal4')
        )).value;
        const updatedAddress = (<HTMLInputElement>(
          document.querySelector('.swal3')
        )).value;
        const updatedStatus = (<HTMLInputElement>(
          document.querySelector('.form-select')
        )).value;
        if (!warehouseEmail) {
          Swal.fire('Error', 'Email field must not be blank.', 'error');
          return;
        }
        if (!updatedAddress) {
          Swal.fire('Error', 'Address field must not be blank.', 'error');
          return;
        }
        this.http
          .put(`${this.url}${warehouse.id}/`, {
            title: updatedName,
            email: warehouseEmail,
            address: updatedAddress,
            contact: updatedContact,
            status: updatedStatus,
          })
          .subscribe(() => {
            console.log(
              `warehouse with ID ${warehouse.id} updated successfully!`
            );
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
    const pdfElement = document.getElementById('pdf-content');

    if (pdfElement) {
      pdfElement.style.marginTop = '20px';
      const options = {
        scale: 5,
        dpi: 300,
        useCORS: true,
      };

      html2canvas(pdfElement, options).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Add extra text or heading
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        // pdf.text('Additional Text', 1, 5);

        pdf.save('All Warehouses.pdf');
        pdfElement.style.marginTop = '0';
      });
    }
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
