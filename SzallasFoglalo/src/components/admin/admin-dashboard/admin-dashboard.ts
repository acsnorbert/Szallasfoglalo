import { Component, OnInit } from '@angular/core';
import { AccommodationsComponent } from "../accommodations/accommodations.component";
import { BookingsComponent } from "../bookings/bookings.component";
import { UsersComponent } from "../users/users.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api';


@Component({
  selector: 'app-admin-dashboard',
  imports: [UsersComponent, AccommodationsComponent, CommonModule, BookingsComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  standalone: true
})
export class AdminDashboardComponent implements OnInit {
  sidebarCollapsed = false;
  activeTab: string = 'dashboard';
  
  // Statisztikák
  totalAccommodations = 0;
  activeBookings = 0;
  totalUsers = 0;
  monthlyRevenue = 0;
  
  recentBookings: any[] = [];

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      // Szállások betöltése
      const accResponse = await this.apiService.selectAll('accommodations');
      if (accResponse.status === 200) {
        this.totalAccommodations = accResponse.data.length;
      }

      // Foglalások betöltése
      const bookingsResponse = await this.apiService.selectAll('bookings');
      if (bookingsResponse.status === 200) {
        const bookings = bookingsResponse.data;
        
        // Aktív foglalások (status = 1)
        this.activeBookings = bookings.filter((b: any) => b.status === 1).length;
        
        // Havi bevétel (aktuális hónap foglalásai)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        this.monthlyRevenue = bookings
          .filter((b: any) => {
            const bookingDate = new Date(b.createdAt);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          })
          .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

        // Legutóbbi foglalások
        await this.loadRecentBookings(bookings.slice(0, 5));
      }

      // Felhasználók betöltése
      const usersResponse = await this.apiService.selectAll('users');
      if (usersResponse.status === 200) {
        this.totalUsers = usersResponse.data.length;
      }

    } catch (error) {
      console.error('Hiba a dashboard adatok betöltése során:', error);
    }
  }

  async loadRecentBookings(bookings: any[]): Promise<void> {
    const accResponse = await this.apiService.selectAll('accommodations');
    const usersResponse = await this.apiService.selectAll('users');
    
    const accommodations = accResponse.status === 200 ? accResponse.data : [];
    const users = usersResponse.status === 200 ? usersResponse.data : [];

    this.recentBookings = bookings.map((booking: any) => {
      const accommodation = accommodations.find((a: any) => a.id === booking.accommodationId);
      const user = users.find((u: any) => u.id === booking.userId);
      
      return {
        accommodation: accommodation?.name || 'Ismeretlen',
        user: user?.name || 'Ismeretlen',
        date: new Date(booking.startDate).toLocaleDateString('hu-HU'),
        status: booking.status === 1 ? 'confirmed' : 'pending',
        statusText: booking.status === 1 ? 'Megerősítve' : 'Függőben'
      };
    });
  }

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
    // TODO: Logout logika implementálása
    console.log('Kijelentkezés...');
    // localStorage.removeItem('user');
    // router.navigate(['/login']);
  }
}