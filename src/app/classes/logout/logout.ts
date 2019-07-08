import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
export class Logout {
    constructor(private loginManager: LoginService, public router: Router) {
    }
    public do() {
        this.loginManager.logout().subscribe(
            data => {
                if (data === null || data === 'OK') {
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                }
            },
            error => {
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
            }
        );
    }
}
