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
import { SidebarComponent } from './sidebar/sidebar.component';
// import { MainGuard } from './main.guard';
import { VoucherComponent } from './voucher/voucher.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthguardGuard } from './authguard.guard';
const routes: Routes = [
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthguardGuard]  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent,canActivate:[AuthguardGuard] },
  { path: 'categories', component: CategoriesComponent ,canActivate:[AuthguardGuard] },
  { path: 'brands', component: BrandsComponent ,canActivate:[AuthguardGuard] },
  { path: 'purchase', component: AllPurchaseComponent,canActivate:[AuthguardGuard]  },
  { path: 'categories', component: CategoriesComponent ,canActivate:[AuthguardGuard] },
  { path: 'report', component: ReportComponent ,canActivate:[AuthguardGuard] },
  { path: 'All-sale', component: AllSaleComponent,canActivate:[AuthguardGuard]  },
  { path: 'warehouse', component: WarehouseComponent ,canActivate:[AuthguardGuard] },
  { path: 'units', component: UnitsComponent ,canActivate:[AuthguardGuard] },
  { path: 'customer', component: CustomerComponent,canActivate:[AuthguardGuard]  },
  { path: 'supplier', component: SupplierComponent,canActivate:[AuthguardGuard]  },
  { path: 'accounts', component: AccountlayerComponent ,canActivate:[AuthguardGuard] },
  { path: 'voucher', component: VoucherComponent ,canActivate:[AuthguardGuard] },
  { path: 'All-purchase', component: AllPurchaseComponent,canActivate:[AuthguardGuard]  },
  { path: 'Sale', component: AllSaleComponent ,canActivate:[AuthguardGuard] },
  { path: 'transaction', component: TransactionsComponent,canActivate:[AuthguardGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
