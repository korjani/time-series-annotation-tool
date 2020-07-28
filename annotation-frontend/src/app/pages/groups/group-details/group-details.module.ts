import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupDetailsComponent } from './group-details.component';
import { Routes, RouterModule } from '@angular/router';
import { TableModule } from 'src/app/components/table/table.module';
import { NzButtonModule, NzIconModule, NzModalModule } from 'ng-zorro-antd';
import { AddUserModule } from '../../projects/add-user/add-user.module';

const routes: Routes = [
  { path: '', component: GroupDetailsComponent }
];

@NgModule({
  declarations: [
    GroupDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    AddUserModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule
  ],
  exports: [
    GroupDetailsComponent
  ]
})
export class GroupDetailsModule { }
