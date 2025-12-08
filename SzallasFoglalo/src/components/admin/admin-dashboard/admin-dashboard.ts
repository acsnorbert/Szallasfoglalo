import { Component } from '@angular/core';
import { AccommodationsComponent } from "../accommodations/accommodations.component";
import { BookingsComponent } from "../bookings/bookings.component";
import { UsersComponent } from "../users/users.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-dashboard',
  imports: [UsersComponent, AccommodationsComponent,CommonModule, BookingsComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  standalone: true
})
export class AdminDashboardComponent {

  sidebarCollapsed = false;

  activeTab: string = 'dashboard';

  recentBookings = [
    {
      accommodation: 'Panoráma Apartman',
      user: 'Kiss Péter',
      date: '2025.01.12',
      status: 'confirmed',
      statusText: 'Megerősítve'
    },
    {
      accommodation: 'Tengerparti Villa',
      user: 'Nagy Anna',
      date: '2025.01.10',
      status: 'pending',
      statusText: 'Függőben'
    },
    {
      accommodation: 'Hegyi Faház',
      user: 'Szabó Tamás',
      date: '2025.01.08',
      status: 'cancelled',
      statusText: 'Lemondva'
    }
  ];

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getPageTitle(): string {
    switch (this.activeTab) {
      case 'dashboard': return 'Vezérlőpult';
      case 'accommodations': return 'Szállások';
      case 'bookings': return 'Foglalások';
      case 'users': return 'Felhasználók';
      case 'settings': return 'Beállítások';
      default: return '';
    }
  }

  logout() {
    console.log('Kijelentkezés...');
  }
}
