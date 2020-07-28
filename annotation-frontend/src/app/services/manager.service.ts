import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/managers/';

  getAllManagers(filter = null) {
    return this._http.get(this.ROOT_URL, {params: filter});
  }

  getSingleManager(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  addNewManager(data) {
    return this._http.post(this.ROOT_URL, data);
  }

  deleteManager(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editManager(data, id) {
    return this._http.patch(this.ROOT_URL + id + '/', data);
  }
}
