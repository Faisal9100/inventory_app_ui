import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
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
import { StaffComponent } from './staff/staff.component';
import { CustomerComponent } from './customer/customer.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { AdjustmentComponent } from './adjustment/adjustment.component';
import { TransferComponent } from './transfer/transfer.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { UnitsComponent } from './units/units.component';
import { ProductsComponent } from './products/products.component';
import { AllPurchaseComponent } from './all-purchase/all-purchase.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { AllSaleComponent } from './all-sale/all-sale.component';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { TypeComponent } from './type/type.component';
import { AllExpencesComponent } from './all-expences/all-expences.component';
import { SupplierPaymentComponent } from './supplier-payment/supplier-payment.component';
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { SettingComponent } from './setting/setting.component';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { FaviconComponent } from './logo/favicon/favicon.component';
import { GlobelTemplateComponent } from './globel-template/globel-template.component';
import { EmailSettingComponent } from './email-setting/email-setting.component';
import { SmsSettingComponent } from './sms-setting/sms-setting.component';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import { ApplicationComponent } from './application/application.component';
import { ServerComponent } from './server/server.component';
import { CacheComponent } from './cache/cache.component';
import { ReportComponent } from './report/report.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgChartsModule } from 'ng2-charts';
import { SupplierComponent } from './supplier/supplier.component';
import { NgbActiveModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
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
    StaffComponent,
    CustomerComponent,
    PurchaseComponent,
    AdjustmentComponent,
    TransferComponent,
    CategoriesComponent,
    BrandsComponent,
    UnitsComponent,
    ProductsComponent,
    AllPurchaseComponent,
    PurchaseReturnComponent,
    AllSaleComponent,
    SaleReturnComponent,
    TypeComponent,
    AllExpencesComponent,
    SupplierPaymentComponent,
    CustomerPaymentComponent,
    StockReportComponent,
    SettingComponent,
    SystemConfigurationComponent,
    FaviconComponent,
    GlobelTemplateComponent,
    EmailSettingComponent,
    SmsSettingComponent,
    NotificationTemplateComponent,
    ApplicationComponent,
    ServerComponent,
    CacheComponent,
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
