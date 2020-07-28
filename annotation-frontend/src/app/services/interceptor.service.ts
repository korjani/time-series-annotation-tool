import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  isRefreshingToken: boolean = true;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(private _auth: AuthService,
    private _token: TokenService,
    private _router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      request.url.includes('login') ||
      request.url.includes('invitation') ||
      request.url.includes('registration') || 
      request.url.includes('password_reset') || 
      request.url.includes('s3.amazonaws.com')
      ) {
      return next.handle(request);
    }
    return next.handle(this.addToken(request))
      .pipe(
        catchError((error, ca) => {
          if (error instanceof HttpErrorResponse) {
              switch ((<HttpErrorResponse>error).status) {
                  case 401:
                    // return this.handle401Error(request, next);
                    this.logoutUser();
                  default:
                    return throwError(error);
              }
          } else {
            return throwError(error);
          }
        })
      );
  }

  addToken(req: HttpRequest<any>): HttpRequest<any> {

    let customReq: any;
    let newHeader = req.headers.set('Authorization', 'Token ' + this._token.getToken());
    if (!newHeader.get('Content-Type')) {
      newHeader.set('Content-Type', 'application/json');
    }
    customReq = req.clone({
      headers: req.headers.set('Authorization', 'Token ' + this._token.getToken())
    });
    return customReq;
  }

  // handle400Error(error) {
  //   console.log("400 error");
  //   if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
  //     // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
  //     return this.logoutUser();
  //   }

  //   return EmptyObservable.create();
  // }


  // handle401Error(req: HttpRequest<any>, next: HttpHandler) {
  //   if (this.isRefreshingToken) {
  //     this.isRefreshingToken = false;

  //     // Reset here so that the following requests wait until the token
  //     // comes back from the refreshToken call.
  //     this.tokenSubject.next(null);
  //     //  const http = this.inj.get(HttpClient);


  //     return this._auth.refreshToken().switchMap((token) => {
  //       if (token) {
  //         localStorage.setItem(AppUtils.STORAGE_ACCOUNT_ACCESS_TOKEN, token["access_token"]);
  //         localStorage.setItem(AppUtils.STORAGE_ACCOUNT_REFRESH_TOKEN, token["refresh_token"]);
  //         localStorage.setItem(AppUtils.STORAGE_ACCOUNT_EXPIRES_IN, token["expires_in"]);
  //         this.tokenSubject.next(token["access_token"]);
  //         return next.handle(this.addToken(req));
  //       }

  //       console.log("refresh failed");
  //       // If we don't get a new token, we are in trouble so logout.
  //       this.logoutUser();
  //       return EmptyObservable.create();

  //     }).catch((e: any) => {
  //         console.log("error  2" + e);
  //         // If there is an exception calling 'refreshToken', bad news so logout.
  //         this.logoutUser();
  //         return EmptyObservable.create();
  //     }).finally(() => {
  //         console.log("token finally)");
  //         this.isRefreshingToken = true;
  //     });
  //   } else {
  //     return this.tokenSubject
  //       .filter(token => token != null)
  //       .take(1)
  //       .switchMap(token => {
  //         return next.handle(this.addToken(req));
  //       });
  //   }
  // }

  logoutUser() {
    this._token.clearToken();
    this._router.navigate(['/login']);
    // window.location.reload();
    //return Observable.throw("");
  }
}
