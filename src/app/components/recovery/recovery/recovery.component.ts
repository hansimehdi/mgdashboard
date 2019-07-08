import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RecoveryService } from '../../../services/recovery/recovery.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  constructor(
    private recovery: RecoveryService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  cancelRecovery() {
    this.recovery.cancelRecovery();
    this.router.navigate(['login']);
  }
}
