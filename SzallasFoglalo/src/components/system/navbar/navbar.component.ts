import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavItem } from '../../../interfaces/navItem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn = false;
  isAdmin = false;
  loggedUserName = '';
  mobileMenuOpen = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      this.isAdmin = this.auth.isAdmin();
      
      if (this.isLoggedIn) {
        const user = this.auth.loggedUser();
        this.loggedUserName = user ? user[0].name : '';
      } else {
        this.loggedUserName = '';
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  handleLogout(): void {
    this.auth.logout();
    this.closeMobileMenu();
    this.router.navigate(['/landing']);
  }

}