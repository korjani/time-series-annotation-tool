import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnotatorService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/annotators/';

  getAllAnnotators() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleAnnotator(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  addNewAnnotator(data) {
    return this._http.post(this.ROOT_URL, data);
  }

  deleteAnnotator(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editAnnotator(data, id) {
    return this._http.patch(this.ROOT_URL + id + '/', data);
  }
}
