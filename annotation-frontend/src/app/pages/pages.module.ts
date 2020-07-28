import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { Routes, RouterModule } from '@angular/router';
import { NzLayoutModule, NzMenuModule, NzToolTipModule, NzIconModule, NzAvatarModule, NzDropDownModule } from 'ng-zorro-antd';
import { AdminGuard, ManagerGuard } from '../services/guard.service';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule', canActivate: [ManagerGuard] },
      // { path: 'users', loadChildren: './users/users.module#UsersModule', canActivate: [AdminGuard] },
      { path: 'users', loadChildren: './users/users.module#UsersModule' },
      { path: 'groups', loadChildren: './setting/setting.module#SettingModule', canActivate: [AdminGuard] },
    ]
  }
];

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzMenuModule,
    NzToolTipModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  exports: [
    PagesComponent
  ]
})
export class PagesModule { }
