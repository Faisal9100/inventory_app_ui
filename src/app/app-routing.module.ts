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
import { TransferComponent } from './transfer/transfer.component';
import { TypeComponent } from './type/type.component';
import { UnitsComponent } from './units/units.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AccountlayerComponent } from './accountlayer/accountlayer.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'purchase', component: AllPurchaseComponent },
  { path: 'all-purchase', component: PurchaseReturnComponent },
  { path: 'purchase-return', component: PurchaseComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'report', component: ReportComponent },
  { path: 'sale-return', component: SaleReturnComponent },
  { path: 'All-sale', component: AllSaleComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'adjustment', component: AdjustmentComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'stock-report', component: StockReportComponent },
  { path: 'cache', component: CacheComponent },
  { path: 'email-setting', component: EmailSettingComponent },
  { path: 'type', component: TypeComponent },
  { path: 'units', component: UnitsComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'accounts', component: AccountlayerComponent },
  {path:'All-purchase', component:AllPurchaseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
