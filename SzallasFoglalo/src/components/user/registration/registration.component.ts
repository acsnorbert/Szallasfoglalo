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
  imports: [CommonModule, ReactiveFormsModule, RouterLink,FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent{
  
  acceptTerms: boolean = false;

  newUser: User = {
    name: '',
    email: '',
    password: '',
    role: 'user',
  };

  constructor(
    private api: ApiService,
    private message: MessageService,
    private router: Router) {}


    registration() {
      if (!this.acceptTerms) {
        this.message.show('danger', 'Hiba', 'El kell fogadnod a szabályzatot!');
        return;
      }
  
      this.api.registration('users', this.newUser).then(res => {
        if (res.status == 500){
          this.message.show('danger', 'Hiba', res.message);
          return;
        }
  
        let data = {
          "template": "registration",
          "to": this.newUser.email,
          "subject": "Sikeres regisztráció",
          "data": {
              "username": this.newUser.name,
              "email": this.newUser.email,
              "password": this.newUser.password,
              "url": "http://localhost:4200"
          }
      }
  
        /*this.api.sendmail(data);*/
  
        this.message.show('success', 'Ok', res.message);
        this.router.navigate(['/login']);
      })
    }
  
}