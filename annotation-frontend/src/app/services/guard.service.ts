import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserGuard implements CanActivate {

  constructor(public _auth: AuthService, 
              private _router: Router) {}

  canActivate() {
    const observable = new Observable<boolean>((observer) => {
        this._auth.getUserInfo().subscribe(
          response => {
            observer.next(true);   
          },
          error => {
            observer.next(false);
            this._router.navigate(['/login']);
          }
        );
    });
    return observable;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggedOutUserGuard implements CanActivate {

  constructor(public _auth: AuthService, 
              private _router: Router) {}

  canActivate() {
    const observable = new Observable<boolean>((observer) => {
        this._auth.getUserInfo().subscribe(
          response => {
            observer.next(false);
            this._router.navigate(['']);
          },
          error => {
            observer.next(true);   
          }
        );
    });
    return observable;
  }
}

@Injectable({
  providedIn: 'root'
})
export class InvitedUserGuard implements CanActivate {

  constructor(public _auth: AuthService, 
    private _router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot) {
    const observable = new Observable<boolean>((observer) => {
      const data = {
        token: _route.params['key']
      };
      this._auth.registerKeyValidation(data).subscribe(
        response => {
          observer.next(true);
        },
        error => {
          observer.next(false);
          this._router.navigate(['/login']);
        }
      );
    });
    return observable;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(public _auth: AuthService,
    private _router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot) {
    const observable = new Observable<boolean>((observer) => {
      this._auth.getUserType().subscribe(
        response => {
          if (response['user_type'] === 'Admin') {
            observer.next(true);
          } else {
            observer.next(false);
            this._router.navigate(['']);
          }
        },
        error => {
          observer.next(false);
          this._router.navigate(['']);
        }
      );
    });
    return observable;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  constructor(public _auth: AuthService,
    private _router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot) {
    const observable = new Observable<boolean>((observer) => {
      this._auth.getUserType().subscribe(
        response => {
          if (response['user_type'] === 'Manager' || response['user_type'] === 'Admin') {
            observer.next(true);
          } else {
            observer.next(false);
            this._router.navigate(['']);
          }
        },
        error => {
          observer.next(false);
          this._router.navigate(['']);
        }
      );
    });
    return observable;
  }
}
