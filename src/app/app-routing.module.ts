import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjustmentComponent } from './adjustment/adjustment.component';
import { AllPurchaseComponent } from './all-purchase/all-purchase.component';
import { AllSaleComponent } from './all-sale/all-sale.component';
import { BrandsComponent } from './brands/brands.component';
import { CacheComponent } from './cache/cache.component';
import { CategoriesComponent } from './categories/categories.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailSettingComponent } from './email-setting/email-setting.component';
import { ProductsComponent } from './products/products.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ReportComponent } from './report/report.component';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { StaffComponent } from './staff/staff.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { SupplierComponent } from './supplier/supplier.component';
// import { TransferComponent } from './transfer/transfer.component';
// import { TypeComponent } from './type/type.component';
import { UnitsComponent } from './units/units.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AccountlayerComponent } from './accountlayer/accountlayer.component';
import { LoginComponent } from './login/login.component';
// import { AuthQuardGuard } from './auth-quard.guard';
import { AuthGuard } from './login/authQuard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainGuard } from './main.guard';
const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [MainGuard], },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent , canActivate: [MainGuard],},
  { path: 'categories', component: CategoriesComponent, canActivate: [MainGuard], },
  { path: 'brands', component: BrandsComponent , canActivate: [MainGuard],},
  { path: 'purchase', component: AllPurchaseComponent, canActivate: [MainGuard], },
  { path: 'all-purchase', component: PurchaseReturnComponent, canActivate: [MainGuard], },
  { path: 'purchase-return', component: PurchaseComponent, canActivate: [MainGuard], },
  { path: 'categories', component: CategoriesComponent , canActivate: [MainGuard],},
  { path: 'report', component: ReportComponent , canActivate: [MainGuard],},
  { path: 'sale-return', component: SaleReturnComponent , canActivate: [MainGuard],},
  { path: 'All-sale', component: AllSaleComponent , canActivate: [MainGuard],},
  { path: 'staff', component: StaffComponent, canActivate: [MainGuard], },
  { path: 'warehouse', component: WarehouseComponent , canActivate: [MainGuard],},
  { path: 'adjustment', component: AdjustmentComponent, canActivate: [MainGuard], },
  // { path: 'transfer', component: TransferComponent },
  { path: 'stock-report', component: StockReportComponent },
  { path: 'cache', component: CacheComponent },
  { path: 'email-setting', component: EmailSettingComponent },
  // { path: 'type', component: TypeComponent },
  { path: 'units', component: UnitsComponent, canActivate: [MainGuard], },
  { path: 'customer', component: CustomerComponent , canActivate: [MainGuard],},
  { path: 'supplier', component: SupplierComponent , canActivate: [MainGuard],},
  { path: 'accounts', component: AccountlayerComponent, canActivate: [MainGuard], },
  {path:'All-purchase', component:AllPurchaseComponent, canActivate: [MainGuard],}, 
  {path:'Sale', component:AllSaleComponent, canActivate: [MainGuard],}, 
      
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
