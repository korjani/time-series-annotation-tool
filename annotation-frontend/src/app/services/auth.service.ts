import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/rest-auth/';
  private USER_ROOT_URL = environment.rootURL + '/api/v1/';
  private RESET_PASS_ROOT_URL = environment.rootURL + '/password_reset/';

  loginUser(data) {
    return this._http.post(this.ROOT_URL + 'login/', data);
  }
  
  userInvitation(data) {
    return this._http.post(this.USER_ROOT_URL + 'invite-user/', data);
  }
  
  registerUser(data) {
    return this._http.post(this.USER_ROOT_URL + 'registration/', data);
  }
  
  registerKeyValidation(data) {
    return this._http.post(this.USER_ROOT_URL + 'check-invitation/', data);
  }
  
  getUserType() {
    return this._http.get(this.USER_ROOT_URL + 'user-type/');
  }

  logoutUser() {
    return this._http.post(this.ROOT_URL + 'logout/', {});
  }

  changePassword(data) {
    return this._http.post(this.USER_ROOT_URL + 'change-password/', data);
  }

  resetPasswordByEmail(data) {
    return this._http.post(this.RESET_PASS_ROOT_URL, data);
  }

  resetPassword(data) {
    return this._http.post(this.RESET_PASS_ROOT_URL + 'confirm/', data);
  }

  confirmResetPasswordToken(data) {
    return this._http.post(this.RESET_PASS_ROOT_URL + 'validate_token/', data);
  }

  getUserInfo() {
    return this._http.get(this.ROOT_URL + 'user/');
  }
}
