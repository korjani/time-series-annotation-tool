import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { Routes, RouterModule } from '@angular/router';
import { TableModule } from 'src/app/components/table/table.module';
import { NzIconModule, NzButtonModule, NzModalModule } from 'ng-zorro-antd';
import { AddGroupModule } from './add-group/add-group.module';

const routes: Routes = [
  { path: '', component: SettingComponent },
  { path: 'groups/:id', loadChildren: '../groups/group-details/group-details.module#GroupDetailsModule' },
];

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    AddGroupModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule
  ],
  exports: [
    SettingComponent
  ]
})
export class SettingModule { }
