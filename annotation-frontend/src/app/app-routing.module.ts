import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoggedInUserGuard, InvitedUserGuard } from './services/guard.service';

const routes: Routes = [
  { path: 'login',      loadChildren: './login/login.module#LoginModule' },
  {
    path: 'register/:key',
    loadChildren: './login/register/register.module#RegisterModule',
    canActivate: [InvitedUserGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: './login/forgot-password/forgot-password.module#ForgotPasswordModule',
  },
  { path: '',      loadChildren: './pages/pages.module#PagesModule', canActivate:[LoggedInUserGuard] },
  { path: '**',      redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
