import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  getLang(): string {
    if (!!localStorage.getItem('lang')) {
      return localStorage.getItem('lang');
    } else {
      localStorage.setItem('lang', 'en');
      return 'en';
    }
  }

  changeLang(lang: string) {
    localStorage.setItem('lang', lang);
  }
}
