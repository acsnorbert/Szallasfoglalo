import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { NavItem } from '../../../interfaces/navItem';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn = false;
  isAdmin = false;
  loggedUserName = '';

  constructor(
    private auth: AuthService,
  ){}

  navItems:NavItem[] = [];

  
  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      this.isAdmin = this.auth.isAdmin();
      if (this.isLoggedIn){
        this.loggedUserName = this.auth.loggedUser()[0].name;

          this.setupMenu(res);

      } else {
        this.loggedUserName = '';
        this.setupMenu(false);
      }

    });
  }

  setupMenu(isLoggedIn: boolean){
    this.navItems = [
      {
        name: 'Pizzalista',
        url: 'pizzalist',
      },

      ...(isLoggedIn) ? [
        {
          name: 'Kosár',
          url: 'cart',
        },

        ...(this.isAdmin) ? [
          {
            name: 'Pizzák kezelése',
            url: 'pizzas',
          },
          {
            name: 'Felhasználók kezelése',
            url: 'users',
          },
          {
            name: 'Rendelések kezelése',
            url: 'orders',
          },
          {
            name: 'Statisztika',
            url: 'stats',
          }
        ] : [
          {
            name: 'Rendeléseim',
            url: 'myorders',
          }
        ],
        {
          name: 'Profilom',
          url: 'profile',
        },
        {
          name: 'Kilépés',
          url: 'logout',
        },
      ] : [
        {
          name: 'Regisztráció',
          url: 'registration',
        },
        {
          name: 'Belépés',
          url: 'login',
        },
      ]

    ]
  }


}