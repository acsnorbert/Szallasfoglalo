import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';


interface Booking {
  id: number;
  userId: number;
  accommodationId: number;
  startDate: string;
  endDate: string;
  persons: number;
  totalPrice: number;
  status: boolean;
  createdAt: string;
  // Kiegészítő mezők
  accommodationName?: string;
  userName?: string;
  userEmail?: string;
  nights?: number;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  bookingForm!: FormGroup;
  showModal = false;
  showViewModal = false;
  editMode = false;
  selectedBooking: Booking | null = null;
  
  searchTerm = '';
  statusFilter = 'all';
  accommodationFilter = 'all';
  dateFilter = '';

  accommodations: any[] = [];
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadData();
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      userId: ['', Validators.required],
      accommodationId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      persons: [1, [Validators.required, Validators.min(1)]],
      status: [true, Validators.required]
    });
  }

  async loadData(): Promise<void> {
    await this.loadAccommodations();
    await this.loadUsers();
    await this.loadBookings();
  }

  async loadAccommodations(): Promise<void> {
    const response = await this.apiService.selectAll('accommodations');
    if (response.status === 200) {
      this.accommodations = response.data;
    }
  }

  async loadUsers(): Promise<void> {
    const response = await this.apiService.selectAll('users');
    if (response.status === 200) {
      this.users = response.data;
    }
  }

  async loadBookings(): Promise<void> {
    const response = await this.apiService.selectAll('bookings');
    if (response.status === 200) {
      this.bookings = response.data.map((booking: any) => {
        const accommodation = this.accommodations.find(a => a.id === booking.accommodationId);
        const user = this.users.find(u => u.id === booking.userId);
        
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...booking,
          status: booking.status === 1,
          accommodationName: accommodation?.name || 'Ismeretlen',
          userName: user?.name || 'Ismeretlen',
          userEmail: user?.email || '',
          nights: nights
        };
      });
      
      this.filterBookings();
    }
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = booking.id.toString().includes(this.searchTerm) ||
                           (booking.userName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (booking.userEmail || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' ||
                           (this.statusFilter === 'confirmed' && booking.status) ||
                           (this.statusFilter === 'pending' && !booking.status);
      
      const matchesAccommodation = this.accommodationFilter === 'all' ||
                                   booking.accommodationId.toString() === this.accommodationFilter;
      
      let matchesDate = true;
      if (this.dateFilter) {
        const filterDate = new Date(this.dateFilter);
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        matchesDate = startDate <= filterDate && endDate >= filterDate;
      }

      return matchesSearch && matchesStatus && matchesAccommodation && matchesDate;
    });
  }

  openCreateBookingModal(): void {
    this.editMode = false;
    this.bookingForm.reset({ status: true, persons: 1 });
    this.showModal = true;
  }

  editBooking(booking: Booking): void {
    this.editMode = true;
    this.selectedBooking = booking;
    this.bookingForm.patchValue({
      ...booking,
      startDate: this.formatDateForInput(booking.startDate),
      endDate: this.formatDateForInput(booking.endDate)
    });
    this.showModal = true;
  }

  viewBooking(booking: Booking): void {
    this.selectedBooking = booking;
    this.showViewModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
    this.bookingForm.reset();
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedBooking = null;
  }

  async saveBooking(): Promise<void> {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const accommodation = this.accommodations.find(a => a.id === parseInt(formValue.accommodationId));
      const totalPrice = accommodation ? accommodation.basePrice * nights * formValue.persons : 0;

      const bookingData = {
        userId: formValue.userId,
        accommodationId: formValue.accommodationId,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        persons: formValue.persons,
        totalPrice: totalPrice,
        status: formValue.status ? 1 : 0
      };

      if (this.editMode && this.selectedBooking) {
        const response = await this.apiService.update('bookings', this.selectedBooking.id, bookingData);
        if (response.status === 200) {
          alert('Foglalás sikeresen frissítve!');
          await this.loadBookings();
        } else {
          alert(response.message || 'Hiba történt a mentés során!');
        }
      } else {
        const response = await this.apiService.insert('bookings', bookingData);
        if (response.status === 200) {
          alert('Foglalás sikeresen létrehozva!');
          await this.loadBookings();
        } else {
          alert(response.message || 'Hiba történt a létrehozás során!');
        }
      }

      this.closeModal();
    }
  }

  async deleteBooking(booking: Booking): Promise<void> {
    if (confirm(`Biztosan törölni szeretnéd a(z) #${booking.id} foglalást?`)) {
      const response = await this.apiService.delete('bookings', booking.id);
      if (response.status === 200) {
        alert('Foglalás sikeresen törölve!');
        await this.loadBookings();
      } else {
        alert(response.message || 'Hiba történt a törlés során!');
      }
    }
  }

  getStatusText(status: boolean): string {
    return status ? 'Megerősítve' : 'Függőben';
  }

  private formatDateForInput(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}