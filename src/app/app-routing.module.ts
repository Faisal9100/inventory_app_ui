import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPurchaseComponent } from './all-purchase/all-purchase.component';
import { AllSaleComponent } from './all-sale/all-sale.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ReportComponent } from './report/report.component';
import { SupplierComponent } from './supplier/supplier.component';
import { UnitsComponent } from './units/units.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AccountlayerComponent } from './accountlayer/accountlayer.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/authQuard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainGuard } from './main.guard';
import { VoucherComponent } from './voucher/voucher.component';
import { TransactionsComponent } from './transactions/transactions.component';
const routes: Routes = [
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'purchase', component: AllPurchaseComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'report', component: ReportComponent },
  { path: 'All-sale', component: AllSaleComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'units', component: UnitsComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'accounts', component: AccountlayerComponent },
  { path: 'voucher', component: VoucherComponent },
  { path: 'All-purchase', component: AllPurchaseComponent },
  { path: 'Sale', component: AllSaleComponent },
  { path: 'transaction', component: TransactionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
