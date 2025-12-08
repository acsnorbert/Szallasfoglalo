import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  newUser = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    address: ''
  };

  acceptTerms: boolean = false;

  registration() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.confirm) {
      alert('Kérlek, töltsd ki a kötelező mezőket!');
      return;
    }

    if (this.newUser.password !== this.newUser.confirm) {
      alert('A jelszavak nem egyeznek!');
      return;
    }

    if (!this.acceptTerms) {
      alert('El kell fogadnod a regisztrációs szabályzatot!');
      return;
    }

    console.log('Regisztráció:', this.newUser);
    alert(`Sikeres regisztráció: ${this.newUser.name}`);
  }
}
