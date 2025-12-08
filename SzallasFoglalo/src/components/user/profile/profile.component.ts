import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    name: 'John Doe',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  updateProfile() {
    if (!this.user.name) {
      alert('A felhasználónév nem lehet üres!');
      return;
    }

    if (this.user.newPassword || this.user.confirmPassword) {
      if (this.user.newPassword !== this.user.confirmPassword) {
        alert('Az új jelszó és a megerősítés nem egyezik!');
        return;
      }

      if (!this.user.currentPassword) {
        alert('Add meg a jelenlegi jelszavad a változtatáshoz!');
        return;
      }
    }

    console.log('Profil frissítve:', this.user);
    alert('Sikeres profilfrissítés!');

  }
}
