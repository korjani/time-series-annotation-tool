import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { NzTableModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    RouterModule,
  ],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
