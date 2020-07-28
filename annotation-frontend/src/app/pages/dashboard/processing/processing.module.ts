import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessingComponent } from './processing.component';
import { Routes, RouterModule } from '@angular/router';
import { ChartModule } from '../chart/chart.module';
import { NzButtonModule, NzIconModule } from 'ng-zorro-antd';

const routes: Routes = [
  {path: '', component: ProcessingComponent}
];

@NgModule({
  declarations: [
    ProcessingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartModule,
    NzButtonModule,
    NzIconModule
  ],
  exports: [
    ProcessingComponent
  ]
})
export class ProcessingModule { }
