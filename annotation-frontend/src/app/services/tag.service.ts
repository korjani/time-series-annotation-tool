import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/tags/';

  getAllTags() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleTag(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  addNewTag(data) {
    return this._http.post(this.ROOT_URL, data);
  }

  deleteTag(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editTag(data, id) {
    return this._http.patch(this.ROOT_URL + id + '/', data);
  }
}
