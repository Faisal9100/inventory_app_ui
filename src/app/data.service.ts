import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import Notify from 'simple-notify';
import { ApiService } from './api.service';
import { BasicService } from './basic.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private basic: BasicService, private api: ApiService) { }
  saveData: any;
  submit_loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  updateData: any;

  formFields: any = {};
  form = new FormGroup(this.formFields);

  id: any;
  tempId: any;
  getTempItem(item: any) {
    // this.api.tempId = item.id;
    this.tempId = item.id;
  }
  getId(item: any) {
    this.id = item.id;
  }

  detail_loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  currentItem: any;
  // getItem(name: any, title: any) {
  //   this.api
  //     .getItem(name, this.id, name)
  //     .then((res: any) => {
  //       this.currentItem = res;
  //       setTimeout(() => {
  //         this.detail_loader.next(false);
  //       }, 300);
  //       new Notify({
  //         status: 'success',
  //         title: title,
  //         text: title + ' data Loaded',
  //         effect: 'slide',
  //         speed: 300,
  //         showIcon: true,
  //         showCloseButton: true,
  //         autoclose: true,
  //         autotimeout: 3000,
  //         gap: 20,
  //         distance: 20,
  //         type: 3,
  //         position: 'right top',
  //       });
  //     })
  //     .catch(() => {
  //       document.getElementById('detailModal_closeButton')?.click();
  //       this.detail_loader.next(false);
  //     });
  // }

  // Update Items ------------------------------------------------------------
  updateItem: any = null;
  updateImage: any = null;
  selectUpdateItem(item: any, others: any) {
    this.updateItem = item;
    for (let formControl of others['formControls']) {
      if (formControl['type'] == 'image') {
        this.updateImage = item[formControl['name']];
        break;
      }
    }
    for (let key in item) {
      if (typeof item[key] === 'object' && item[key] !== null) {
        let formControl = others['formControls'].find((obj: { name: string; }) => obj.name == key);
        if (formControl?.multiple) this.form.get(key)?.setValue(item[key]);
        else
          for (let subKey in item[key]) {
            this.form.get(key + '__' + subKey)?.setValue(item[key][subKey]);
          }
      } else {
        this.form.get(key)?.setValue(item[key]);
      }
    }
  }

  resetUpdate() {
    if (this.updateItem) {
      for (let key in this.updateItem) {
        if (
          typeof this.updateItem[key] === 'object' &&
          this.updateItem[key] !== null
        ) {
          for (let subKey in this.updateItem[key]) {
            this.form.get(key + '__' + subKey)?.reset();
          }
        } else {
          this.form.get(key)?.reset();
        }
      }
      this.updateItem = null;
      this.updateImage = null;
    }
  }
}
