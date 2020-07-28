import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }
  
  private ROOT_URL = environment.rootURL + '/api/v1/users/';

  userProfile(id) {
    return this._http.get(this.ROOT_URL + id);
  }

  editUserProfile(id, data) {
    return this._http.put(this.ROOT_URL + id, data);
  }
}
