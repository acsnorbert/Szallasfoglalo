import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface Booking {
  id: string;
  accommodationId: string;
  accommodationName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [
    {
      id: 'BK001',
      accommodationId: '1',
      accommodationName: 'Deluxe Suite',
      guestName: 'Kiss János',
      guestEmail: 'kiss.janos@example.com',
      guestPhone: '+36 30 123 4567',
      checkIn: new Date('2025-01-15'),
      checkOut: new Date('2025-01-18'),
      nights: 3,
      guests: 2,
      totalPrice: 270000,
      status: 'confirmed',
      notes: 'Korai bejelentkezést kért',
      createdAt: new Date('2025-01-01')
    },
    {
      id: 'BK002',
      accommodationId: '2',
      accommodationName: 'Executive Room',
      guestName: 'Nagy Anna',
      guestEmail: 'nagy.anna@example.com',
      guestPhone: '+36 20 987 6543',
      checkIn: new Date('2025-01-20'),
      checkOut: new Date('2025-01-22'),
      nights: 2,
      guests: 1,
      totalPrice: 64000,
      status: 'pending',
      createdAt: new Date('2025-01-05')
    },
    {
      id: 'BK003',
      accommodationId: '3',
      accommodationName: 'Family Suite',
      guestName: 'Kovács Péter',
      guestEmail: 'kovacs.peter@example.com',
      guestPhone: '+36 70 555 1234',
      checkIn: new Date('2025-02-01'),
      checkOut: new Date('2025-02-05'),
      nights: 4,
      guests: 4,
      totalPrice: 448000,
      status: 'confirmed',
      notes: 'Családi program',
      createdAt: new Date('2025-01-10')
    },
    {
      id: 'BK004',
      accommodationId: '1',
      accommodationName: 'Deluxe Suite',
      guestName: 'Szabó Éva',
      guestEmail: 'szabo.eva@example.com',
      guestPhone: '+36 30 999 8888',
      checkIn: new Date('2024-12-20'),
      checkOut: new Date('2024-12-23'),
      nights: 3,
      guests: 3,
      totalPrice: 405000,
      status: 'completed',
      createdAt: new Date('2024-12-01')
    }
  ];

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.filteredBookings = [...this.bookings];
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      accommodationId: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      guestPhone: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', Validators.required],
      notes: ['']
    });
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = booking.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           booking.guestName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           booking.guestEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || booking.status === this.statusFilter;
      
      const matchesAccommodation = this.accommodationFilter === 'all' ||
                                   booking.accommodationName.toLowerCase().includes(this.accommodationFilter.toLowerCase());
      
      let matchesDate = true;
      if (this.dateFilter) {
        const filterDate = new Date(this.dateFilter);
        matchesDate = booking.checkIn <= filterDate && booking.checkOut >= filterDate;
      }

      return matchesSearch && matchesStatus && matchesAccommodation && matchesDate;
    });
  }

  openCreateBookingModal(): void {
    this.editMode = false;
    this.bookingForm.reset({ status: 'pending', guests: 1 });
    this.showModal = true;
  }

  editBooking(booking: Booking): void {
    this.editMode = true;
    this.selectedBooking = booking;
    this.bookingForm.patchValue({
      ...booking,
      checkIn: this.formatDateForInput(booking.checkIn),
      checkOut: this.formatDateForInput(booking.checkOut)
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

  saveBooking(): void {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;
      const checkIn = new Date(formValue.checkIn);
      const checkOut = new Date(formValue.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      const accommodationMap: { [key: string]: string } = {
        '1': 'Deluxe Suite',
        '2': 'Executive Room',
        '3': 'Family Suite'
      };

      const basePrice = formValue.accommodationId === '1' ? 45000 : 
                       formValue.accommodationId === '2' ? 32000 : 28000;

      if (this.editMode && this.selectedBooking) {
        const index = this.bookings.findIndex(b => b.id === this.selectedBooking!.id);
        if (index !== -1) {
          this.bookings[index] = {
            ...this.bookings[index],
            ...formValue,
            accommodationName: accommodationMap[formValue.accommodationId],
            checkIn,
            checkOut,
            nights,
            totalPrice: basePrice * nights * formValue.guests
          };
        }
      } else {
        const newBooking: Booking = {
          id: 'BK' + String(this.bookings.length + 1).padStart(3, '0'),
          ...formValue,
          accommodationName: accommodationMap[formValue.accommodationId],
          checkIn,
          checkOut,
          nights,
          totalPrice: basePrice * nights * formValue.guests,
          createdAt: new Date()
        };
        this.bookings.push(newBooking);
      }

      this.filterBookings();
      this.closeModal();
    }
  }

  deleteBooking(booking: Booking): void {
    if (confirm(`Biztosan törölni szeretnéd a(z) #${booking.id} foglalást?`)) {
      this.bookings = this.bookings.filter(b => b.id !== booking.id);
      this.filterBookings();
    }
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'Függőben',
      'confirmed': 'Megerősítve',
      'cancelled': 'Törölve',
      'completed': 'Befejezett'
    };
    return statusTexts[status] || status;
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}