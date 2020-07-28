import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NzMenuModule, NzButtonModule, NzIconModule, NzToolTipModule, NzCardModule, NzGridModule } from 'ng-zorro-antd';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: ':id', loadChildren: './processing/processing.module#ProcessingModule' }
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzGridModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
