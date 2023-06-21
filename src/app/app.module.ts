import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FormBuilder,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { CustomerComponent } from './customer/customer.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { UnitsComponent } from './units/units.component';
import { ProductsComponent } from './products/products.component';
import { AllPurchaseComponent } from './all-purchase/all-purchase.component';
import { AllSaleComponent } from './all-sale/all-sale.component';
import { SettingComponent } from './setting/setting.component';
import { NgChartsModule } from 'ng2-charts';
import { SupplierComponent } from './supplier/supplier.component';
import {
  NgbActiveModal,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { WarehouseServiceService } from './warehouse-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductService } from './product.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UnitService } from './unit.service';
import { BrandService } from './brand.service';
import { AccountlayerComponent } from './accountlayer/accountlayer.component';
import { SupplierService } from './supplier.service';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoginComponent } from './login/login.component';
import { VoucherComponent } from './voucher/voucher.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthguardGuard } from './authguard.guard';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { StaffComponent } from './staff/staff.component';
import { PermissionComponent } from './permission/permission.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TransferComponent } from './transfer/transfer.component';
import { NgxPrintModule } from 'ngx-print';
// import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
// import { AuthQuardGuard } from './auth-quard.guard';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WarehouseComponent,
    CustomerComponent,
    CategoriesComponent,
    BrandsComponent,
    UnitsComponent,
    ProductsComponent,
    AllPurchaseComponent,
    AllSaleComponent,
    SettingComponent,
    SupplierComponent,
    AccountlayerComponent,
    LoginComponent,
    VoucherComponent,
    TransactionsComponent,
    PasswordChangeComponent,
    StaffComponent,
    PermissionComponent,
    PaginationComponent,
    TransferComponent,
  ],
  imports: [
    NgChartsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatNativeDateModule,
    NgChartsModule,
    NgbModule,
    NgxPaginationModule,
    MatSelectModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule,
    NgxPrintModule,
  ],
  providers: [
    WarehouseServiceService,
    ProductService,
    UnitService,
    BrandService,
    ProductService,
    SupplierService,
    NgbActiveModal,
    AuthguardGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
