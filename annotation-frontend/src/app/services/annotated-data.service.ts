import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnotatedDataService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/annotated-data/';

  getAllAnnotatedData() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleAnnotatedData(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  addNewAnnotatedData(data) {
    return this._http.post(this.ROOT_URL, data);
  }

  deleteAnnotatedData(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editAnnotatedData(data, id) {
    return this._http.put(this.ROOT_URL + id + '/', data);
  }

  downloadAnnotatedData(id) {
    return this._http.get(this.ROOT_URL + 'download/' + id + '/', { responseType: 'arraybuffer' });
  }
}
