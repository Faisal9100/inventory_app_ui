import { Injectable } from '@angular/core';
import Notify from 'simple-notify';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  constructor(private router: Router) {
    let item = localStorage.getItem('size');
    if (!item) {
      localStorage.setItem('size', <any>this.pagination);
    } else {
      this.pagination = Number(item);
    }
    // this.date = new Date();
    // this.onlydate = `${
    //   this.date.getMonth() + 1
    // }/${this.date.getDate()}/${this.date.getFullYear()}`;
  }
  get date() {
    let date = new Date();
    let date_value = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return date_value;
  }

  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  refresh: boolean = true;
  pagination: number = 20;
  // host: string = 'localhost:8000';
  // back: string = 'http://localhost:8000/';
  host: string = '52.221.4.133';
  back: string = 'http://52.221.4.133/';

  url: string = this.back + 'api/';
  auth: string = this.back + 'auth/';
  static: string = this.back + 'static/';
  images: string = this.back + 'static/images/';
  // date: Date;
  onlydate: any;
  // nopermission: boolean = false;
  // unauthorized: boolean = false;
  nointernet: boolean = false;
  // removeNoPermission(event: any) {
  //   event.target.parentElement.parentElement.classList.add('remove');
  //   setTimeout(() => {
  //     this.nopermission = false;
  //   }, 1000);
  // }
  internel_error: boolean = false;
  close_internal_error() {
    this.internel_error = false;
    var error_code = document.getElementById('error_code');
    if (error_code) error_code.innerHTML = '';
    var button = `
      <button class="close" (click)="basic.close_internal_error()">
        <i class="bi bi-x"></i>
      </button>
    `;
    error_code?.insertAdjacentHTML('afterbegin', button);
  }

  setNav(id: string) {
    let elem = document.getElementById(id);
    elem?.classList.add('active');
  }

  handleError(error: any, name: string) {
    console.log(error);
    if (error.status == 0) {
      this.nointernet = true;
    } else if (error.status == 460) {
      new Notify({
        status: 'error',
        text: 'Child Exists',
        effect: 'slide',
        speed: 300,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 3,
        position: 'right top',
      });
    } else if (error.status == 400) {
      let errors: any = error.error;
      errors = Object.entries(errors);
      this.errors = errors;
    } else if (error.status == 403) {
      // this.nopermission = true;
    } else if (error.status == 500) {
      new Notify({
        status: 'error',
        text: 'Internal Error',
        effect: 'slide',
        speed: 300,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 3,
        position: 'right top',
      });
      this.internel_error = true;
      var error_code = document.getElementById('error_code');
      error_code?.insertAdjacentHTML('afterbegin', error?.error);
    } else {
      Swal.fire({
        icon: 'warning',
        text:
          'Server response ' + error.status + ' - In ( ' + name + ') Request',
      });
    }
    this.loader.next(false);
  }
  errors: any[] = [];
  removeErrors() {
    this.errors = [];
  }

  alerts: any[] = [];
  addAlert(status: number = 1, text: string, zindex: number = 0) {
    let data = {
      status: status,
      text: text,
      remove: 0,
      zindex: zindex,
    };

    this.alerts.unshift(data);
    setTimeout(() => {
      let index = this.alerts.lastIndexOf(data);
      this.alerts.splice(index, 1);
    }, 5000);
  }
  removeAlert(item: any) {
    item.remove = 1;
  }

  // Reloading Current Page
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // closeAlert of custom Bootstrap Type Alert
  closeAlert(elem: any) {
    let alert = elem.target.parentElement.parentElement;
    alert.classList.add('remove');
    setTimeout(() => alert.remove(), 500);
  }

  loader_custom_size: boolean = false;
  check_loader_size() {
    let full_vh: any = window.innerHeight - 70;
    let app_data: any = document.querySelector('.body_content');
    let main_loader: any = document.querySelector('.app_loader_size');
    let app_data_height: any = app_data?.clientHeight;
    if (app_data_height > full_vh) {
      // if (main_loader) {
      // console.log('Hello');
      // main_loader.classList.add('custom_size');
      this.loader_custom_size = true;
      // } else this.loader_custom_size = false;
    } else this.loader_custom_size = false;
  }
}
