import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LocalhostApiService } from '../localhost-api.service';
import { HttpClient } from '@angular/common/http';
// import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css'],
})
export class PasswordChangeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public api: LocalhostApiService,
    public http: HttpClient,
    private formBuilder: FormBuilder
  ) {}
  formData: any = FormGroup;
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]],
    });
  }

  changePassword() {
    if (this.formData.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the required fields.',
      });
      return;
    }

    const newPassword = this.formData.get('newPassword').value;
    const confirmPassword = this.formData.get('confirmPassword').value;
    const oldPassword = this.formData.get('oldPassword').value;

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New password and confirm password must match.',
      });
      return;
    }

    const requestBody = {
      new_password: newPassword,
      current_password: oldPassword,
    };

    this.http
      .post(
        this.api.localhost + '/auth/users/set_password/',
        requestBody
      )
      .subscribe(
        (response) => {
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Password changed successfully.',
          });
          this.formData.reset();
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to change password.',
          });
        }
      );
  }
}
