import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../interfaces/user';
import { ApiService } from '../../../services/api';
import { MessageService } from '../../../services/message';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  user:User= {
    name: '',
    email: '',
    password: '',
    role: '',
  }

  rememberMe: boolean = false;

  constructor(
    private api: ApiService,
    private message: MessageService,
    private auth: AuthService,
    private router: Router
  ) {}

  login(){
    this.api.login('users', this.user).then(res => {
      if (res.status == 500){
        this.message.show('danger', 'Hiba', res.message);
        return;
      }

      // maradjon bejelentkezve vagy sem
      if (this.rememberMe){
        this.auth.storeUser(JSON.stringify(res.data));
      }

      this.auth.login(JSON.stringify(res.data));
      this.router.navigate(['/landing']);

    });
  }
  

  
}