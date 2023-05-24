import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FormBuilder,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';
import { SettingComponent } from './setting/setting.component';
import { FaviconComponent } from './logo/favicon/favicon.component';
import { SmsSettingComponent } from './sms-setting/sms-setting.component';
import { ServerComponent } from './server/server.component';
import { ReportComponent } from './report/report.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgChartsModule } from 'ng2-charts';
import { SupplierComponent } from './supplier/supplier.component';
import {
  NgbActiveModal,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from './pagination/pagination.component';
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
    SaleReturnComponent,
    CustomerPaymentComponent,
    SettingComponent,
    FaviconComponent,
    SmsSettingComponent,
    ServerComponent,
    ReportComponent,
    SidebarComponent,
    SupplierComponent,
    PaginationComponent,
    AccountlayerComponent,
    LoginComponent,
  ],
  imports: [
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
  ],
  providers: [
    WarehouseServiceService,
    ProductService,
    UnitService,
    BrandService,
    ProductService,
    SupplierService,
    NgbActiveModal,
    // AuthQuardGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
