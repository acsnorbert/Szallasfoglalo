import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { AccommodationsComponent } from "../accommodations/accommodations.component";
import { BookingsComponent } from "../bookings/bookings.component";
import { UsersComponent } from "../users/users.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api';
import { Router } from '@angular/router';
import { ChartComponent } from '../chart/chart'; 
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [UsersComponent, AccommodationsComponent, CommonModule, BookingsComponent, ChartComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

public salesChartData: ChartConfiguration['data'] = {
    labels: ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 70],
        label: 'Eladások',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public userChartData: ChartConfiguration['data'] = {
    labels: ['Aktív', 'Inaktív', 'Új'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ]
      }
    ]
  };

  public revenueChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún'],
    datasets: [
      {
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        label: 'Bevétel (Ft)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  
  sidebarCollapsed = false;
  activeTab: string = 'dashboard';
  
  // Statisztikák
  totalAccommodations = 0;
  activeBookings = 0;
  totalUsers = 0;
  monthlyRevenue = 0;
  
  recentBookings: any[] = [];
  
  // Flag az első betöltéshez
  private isInitialLoad = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  


  async ngOnInit(): Promise<void> {
    // Dashboard adatok betöltése azonnal
    await this.loadDashboardData();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    // Biztosítjuk, hogy a dashboard látható legyen
    this.isInitialLoad = false;
    this.cdr.detectChanges();
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
      
      // Változások detektálása
      this.cdr.detectChanges();
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
    this.cdr.detectChanges();
    if (tab === 'dashboard') {
      this.loadDashboardData();
    }
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
    console.log('Kijelentkezés sikeres');
    this.router.navigate(['/']);
  }
}