import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { Routes, RouterModule } from '@angular/router';
import { TableModule } from 'src/app/components/table/table.module';
import { NzButtonModule, NzIconModule, NzModalModule } from 'ng-zorro-antd';
import { AddManagerModule } from './add-manager/add-manager.module';
import { AddAnnotatorModule } from './add-annotator/add-annotator.module';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':id', loadChildren: './user-details/user-details.module#UserDetailsModule' },
]

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    AddManagerModule,
    AddAnnotatorModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule
  ],
  exports: [
    UsersComponent
  ]
})
export class UsersModule { }
