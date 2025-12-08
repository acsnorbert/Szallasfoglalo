import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  rememberMe: boolean = false;

  constructor() {}

  login() {

    if (!this.user.email || !this.user.password) {
      alert('Kérlek, töltsd ki az összes mezőt!');
      return;
    }

    console.log('Belépés:', this.user, 'Emlékezés:', this.rememberMe);
    alert(`Sikeres belépés: ${this.user.email}`);
    
  }
}
