import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  URL = 'http://192.168.152.128/api-V0/';
  private projectName = 'Web site';
  constructor() { }

  getUrl() {
    return this.URL;
  }

  getProjectName() {
    return this.projectName;
  }
}
