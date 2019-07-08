import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {

  constructor() { }

  setRecovery() {
    localStorage.setItem('recovery', 'true');
  }

  cancelRecovery() {
    localStorage.removeItem('recovery');
  }

  checkRecovery(): boolean {
    return !!localStorage.getItem('recovery');
  }
}
