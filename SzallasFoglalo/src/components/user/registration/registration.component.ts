import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../interfaces/user';
import { ApiService } from '../../../services/api';
import { MessageService } from '../../../services/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  
  acceptTerms: boolean = false;

  newUser: User = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'user',
  };

  constructor(
    private api: ApiService,
    private message: MessageService,
    private router: Router
  ) {}

  async registration() {
    // Validációk
    if (!this.acceptTerms) {
      this.message.show('danger', 'Hiba', 'El kell fogadnod a szabályzatot!');
      return;
    }

    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.confirm) {
      this.message.show('danger', 'Hiba', 'Minden mező kitöltése kötelező!');
      return;
    }

    if (this.newUser.password !== this.newUser.confirm) {
      this.message.show('danger', 'Hiba', 'A jelszavak nem egyeznek!');
      return;
    }

    // Regisztráció
    const res = await this.api.registration('users', this.newUser);
    
    if (res.status === 500) {
      this.message.show('danger', 'Hiba', res.message);
      return;
    }

    // Email küldése sikeres regisztráció után
    const emailData = {
      template: 'registration',
      to: this.newUser.email,
      subject: 'Sikeres regisztráció - Szállásfoglaló',
      data: {
        name: this.newUser.name,
        email: this.newUser.email,
        password:this.newUser.password,
        url: 'http://localhost:4200/login',
        company: 'Szállásfoglaló'
      }
    };

    const emailRes = await this.api.sendmail(emailData);
    
    if (emailRes.status === 200) {
      console.log('Email sikeresen elküldve!');
      this.message.show('success', 'Siker', 'Sikeres regisztráció! Ellenőrizd az email fiókodat!');
    } else {
      console.error('Email küldési hiba:', emailRes.message);
      this.message.show('warning', 'Figyelem', 'Regisztráció sikeres, de az email küldése nem sikerült.');
    }

    // Átirányítás a login oldalra
    this.router.navigate(['/login']);
  }
}