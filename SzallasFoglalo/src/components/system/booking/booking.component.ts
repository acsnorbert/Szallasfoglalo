import { Component, OnInit, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { MessageService } from '../../../services/message';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface Accommodation {
  id: number;
  name: string;
  address: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  maxCapacity: number;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  images: string[];
}

interface Booking {
  id?: number;
  userId: number;
  accommodationId: number;
  startDate: string;
  endDate: string;
  persons: number;
  totalPrice: number;
  status: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isBooked: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit {

  accommodations: Accommodation[] = [];
  filteredAccommodations: Accommodation[] = [];
  bookingForm!: FormGroup;
  searchForm!: FormGroup;
  selectedAccommodation: Accommodation | null = null;
  showBookingModal = false;
  currentUser: User | null = null;
  existingBookings: Booking[] = [];
  
  searchTerm = '';
  minPrice = 0;
  maxPrice = 100000;
  minCapacity = 1;

  // Loading states
  isLoading: boolean = true;
  isSavingBooking: boolean = false;
  errorMessage: string = '';

  // Lightbox
  showLightbox = false;
  lightboxImages: string[] = [];
  currentImageIndex = 0;

  // Foglalt dátumok tárolása
  bookedDates: string[] = [];

  // Egyedi naptár állapotok
  showStartCalendar = false;
  showEndCalendar = false;
  startCalendarMonth: Date = new Date();
  endCalendarMonth: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      await this.loadCurrentUser();
      await this.loadAccommodations();
      await this.loadBookings();
    }, 0);
  }

  initForms(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.bookingForm = this.fb.group({
      startDate: [today, Validators.required],
      endDate: ['', Validators.required],
      persons: [1, [Validators.required, Validators.min(1)]]
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      minPrice: [0],
      maxPrice: [100000],
      minCapacity: [1]
    });

    // Figyelés a dátum változásokra
    this.bookingForm.get('startDate')?.valueChanges.subscribe(() => {
      this.onDateChange();
    });

    this.bookingForm.get('endDate')?.valueChanges.subscribe(() => {
      this.onDateChange();
    });
  }

  async loadCurrentUser(): Promise<void> {
    try {
      const userStr = sessionStorage.getItem(environment.tokenName) || 
                      localStorage.getItem(environment.tokenName);
      
      if (userStr) {
        const userData = JSON.parse(userStr);
        
        if (Array.isArray(userData) && userData.length > 0) {
          this.currentUser = {
            id: userData[0].id,
            name: userData[0].name,
            email: userData[0].email,
            role: userData[0].role
          };
          return;
        }
        
        if (userData.id) {
          this.currentUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          };
          return;
        }
      }
      
      this.currentUser = null;
      
    } catch (error) {
      this.currentUser = null;
    }
  }

  async loadAccommodations(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      const response = await this.apiService.selectAll('accommodations');
      
      if (response && response.status === 200) {
        if (!response.data || !Array.isArray(response.data)) {
          this.messageService.show('warning', 'Figyelem', 'Nem található szállás adat');
          this.accommodations = [];
          this.filteredAccommodations = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        const activeAccommodations = response.data.filter((acc: any) => acc.isActive === 1);
        
        if (activeAccommodations.length === 0) {
          this.messageService.show('info', 'Információ', 'Jelenleg nincs elérhető szállás');
          this.accommodations = [];
          this.filteredAccommodations = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.accommodations = activeAccommodations.map((acc: any) => ({
          ...acc,
          isActive: acc.isActive === 1,
          images: []
        }));
        
        for (let acc of this.accommodations) {
          await this.loadImages(acc);
        }
        
        this.filterAccommodations();
        
      } else {
        this.messageService.show('danger', 'Hiba', response?.message || 'Nem sikerült betölteni a szállásokat');
        this.accommodations = [];
        this.filteredAccommodations = [];
      }
      
    } catch (error) {
      console.error('💥 Error loading accommodations:', error);
      this.messageService.show('danger', 'Hiba', 'Hiba történt a szállások betöltése közben');
      this.accommodations = [];
      this.filteredAccommodations = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async loadImages(accommodation: Accommodation): Promise<void> {
    try {
      const response = await this.apiService.selectAll('accommodation_images');
      
      if (response && response.status === 200 && response.data && Array.isArray(response.data)) {
        const images = response.data
          .filter((img: any) => img.accommodationId === accommodation.id)
          .map((img: any) => `${environment.apiUrl}/uploads/${img.imagePath}`);
        accommodation.images = images;
      }
    } catch (error) {
      console.error(`❌ Error loading images for accommodation ${accommodation.id}:`, error);
    }
  }

  async loadBookings(): Promise<void> {
    try {
      const response = await this.apiService.selectAll('bookings');
      
      if (response && response.status === 200 && response.data && Array.isArray(response.data)) {
        this.existingBookings = response.data.filter((b: any) => b.status === 1);
      }
    } catch (error) {
      console.error('❌ Error loading bookings:', error);
    }
  }

  // Foglalt dátumok számítása egy adott szálláshoz
  getBookedDatesForAccommodation(accommodationId: number): string[] {
    const bookedDates: string[] = [];
    
    const accommodationBookings = this.existingBookings.filter(
      b => b.accommodationId === accommodationId
    );

    accommodationBookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      // Minden nap a foglalási időszakban
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (!bookedDates.includes(dateStr)) {
          bookedDates.push(dateStr);
        }
      }
    });

    return bookedDates;
  }

  // Ellenőrzi, hogy egy adott dátum foglalt-e
  isDateBooked(date: string, accommodationId: number): boolean {
    return this.getBookedDatesForAccommodation(accommodationId).includes(date);
  }

  filterAccommodations(): void {
    this.filteredAccommodations = this.accommodations.filter(acc => {
      const matchesSearch = !this.searchTerm || 
        acc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        acc.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        acc.shortDescription.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesPrice = acc.basePrice >= this.minPrice && acc.basePrice <= this.maxPrice;
      const matchesCapacity = acc.maxCapacity >= this.minCapacity;
      
      return matchesSearch && matchesPrice && matchesCapacity;
    });
  }

  onSearchChange(): void {
    this.filterAccommodations();
  }

  openBookingModal(accommodation: Accommodation): void {
    if (!this.currentUser) {
      this.messageService.show('warning', 'Bejelentkezés szükséges', 'Kérlek jelentkezz be a foglaláshoz!');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.selectedAccommodation = accommodation;
    
    // Foglalt dátumok betöltése ehhez a szálláshoz
    this.bookedDates = this.getBookedDatesForAccommodation(accommodation.id);
    
    this.bookingForm.patchValue({
      persons: 1,
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0]
    });
    
    // Naptár hónapok inicializálása
    this.startCalendarMonth = new Date();
    this.endCalendarMonth = new Date();
    
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedAccommodation = null;
    this.bookingForm.reset();
    this.bookedDates = [];
    this.showStartCalendar = false;
    this.showEndCalendar = false;
  }

  // ===== EGYEDI NAPTÁR METÓDUSOK =====

  toggleCalendar(type: 'start' | 'end'): void {
    if (type === 'start') {
      this.showStartCalendar = !this.showStartCalendar;
      this.showEndCalendar = false;
      
      // Ha van kiválasztott dátum, annak hónapját mutatjuk
      if (this.bookingForm.value.startDate) {
        this.startCalendarMonth = new Date(this.bookingForm.value.startDate);
      } else {
        this.startCalendarMonth = new Date();
      }
    } else {
      this.showEndCalendar = !this.showEndCalendar;
      this.showStartCalendar = false;
      
      if (this.bookingForm.value.endDate) {
        this.endCalendarMonth = new Date(this.bookingForm.value.endDate);
      } else if (this.bookingForm.value.startDate) {
        // Ha van kezdő dátum, annak hónapját mutatjuk
        this.endCalendarMonth = new Date(this.bookingForm.value.startDate);
      } else {
        this.endCalendarMonth = new Date();
      }
    }
  }

  getCalendarDays(type: 'start' | 'end'): CalendarDay[] {
    const month = type === 'start' ? this.startCalendarMonth : this.endCalendarMonth;
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    // Hétfővel kezdjük (0 = vasárnap, 1 = hétfő)
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Előző hónap napjai
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push(this.createCalendarDay(date, false, type, today));
    }
    
    // Aktuális hónap napjai
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      days.push(this.createCalendarDay(date, true, type, today));
    }
    
    // Következő hónap napjai (hogy kitöltsük a rácsot)
    const remainingDays = 42 - days.length; // 6 sor × 7 nap
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, monthIndex + 1, day);
      days.push(this.createCalendarDay(date, false, type, today));
    }
    
    return days;
  }

  createCalendarDay(date: Date, isCurrentMonth: boolean, type: 'start' | 'end', today: Date): CalendarDay {
    const dateStr = this.dateToString(date);
    const selectedDate = type === 'start' 
      ? this.bookingForm.value.startDate 
      : this.bookingForm.value.endDate;
    
    const isToday = date.getTime() === today.getTime();
    const isSelected = dateStr === selectedDate;
    const isBooked = this.selectedAccommodation 
      ? this.isDateBooked(dateStr, this.selectedAccommodation.id)
      : false;
    
    // Múltbéli dátumok letiltása
    let isDisabled = date < today;
    
    // Távozás esetén a kezdő dátum előtti napok letiltása
    if (type === 'end' && this.bookingForm.value.startDate) {
      const startDate = new Date(this.bookingForm.value.startDate);
      isDisabled = isDisabled || date <= startDate;
    }
    
    return {
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday,
      isSelected,
      isBooked,
      isDisabled
    };
  }

  selectDate(type: 'start' | 'end', day: CalendarDay): void {
    if (day.isDisabled || day.isBooked) {
      if (day.isBooked) {
        this.messageService.show('warning', 'Foglalt dátum', 'Ez a dátum már foglalt!');
      }
      return;
    }
    
    const dateStr = this.dateToString(day.date);
    
    if (type === 'start') {
      this.bookingForm.patchValue({ startDate: dateStr });
      this.showStartCalendar = false;
      
      // Ha a végdátum korábbi mint az új kezdő dátum, állítsuk át
      if (this.bookingForm.value.endDate) {
        const endDate = new Date(this.bookingForm.value.endDate);
        if (day.date >= endDate) {
          const nextDay = new Date(day.date);
          nextDay.setDate(nextDay.getDate() + 1);
          this.bookingForm.patchValue({ 
            endDate: this.dateToString(nextDay)
          });
        }
      }
    } else {
      this.bookingForm.patchValue({ endDate: dateStr });
      this.showEndCalendar = false;
    }
    
    this.onDateChange();
  }

  previousMonth(type: 'start' | 'end'): void {
    if (type === 'start') {
      this.startCalendarMonth = new Date(
        this.startCalendarMonth.getFullYear(),
        this.startCalendarMonth.getMonth() - 1,
        1
      );
    } else {
      this.endCalendarMonth = new Date(
        this.endCalendarMonth.getFullYear(),
        this.endCalendarMonth.getMonth() - 1,
        1
      );
    }
  }

  nextMonth(type: 'start' | 'end'): void {
    if (type === 'start') {
      this.startCalendarMonth = new Date(
        this.startCalendarMonth.getFullYear(),
        this.startCalendarMonth.getMonth() + 1,
        1
      );
    } else {
      this.endCalendarMonth = new Date(
        this.endCalendarMonth.getFullYear(),
        this.endCalendarMonth.getMonth() + 1,
        1
      );
    }
  }

  getMonthYearDisplay(type: 'start' | 'end'): string {
    const month = type === 'start' ? this.startCalendarMonth : this.endCalendarMonth;
    const monthNames = [
      'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
      'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ];
    return `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
  }

  formatDisplayDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  }

  dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Klikk kezelés a naptáron kívül - bezárja a naptárat
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.custom-date-picker');
    
    if (!clickedInside) {
      this.showStartCalendar = false;
      this.showEndCalendar = false;
    }
  }

  // ===== FOGLALÁS METÓDUSOK =====

  calculateNights(): number {
    const start = new Date(this.bookingForm.value.startDate);
    const end = new Date(this.bookingForm.value.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  calculateTotalPrice(): number {
    if (!this.selectedAccommodation) return 0;
    const nights = this.calculateNights();
    const persons = this.bookingForm.value.persons || 0;
    return nights * persons * this.selectedAccommodation.basePrice;
  }

  isDateRangeAvailable(): boolean {
    if (!this.selectedAccommodation) return true;
    
    const startDate = new Date(this.bookingForm.value.startDate);
    const endDate = new Date(this.bookingForm.value.endDate);
    
    const conflicts = this.existingBookings.filter(booking => {
      if (booking.accommodationId !== this.selectedAccommodation!.id) return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      return (startDate < bookingEnd && endDate > bookingStart);
    });
    
    return conflicts.length === 0;
  }

  async saveBooking(): Promise<void> {
    if (!this.bookingForm.valid || !this.selectedAccommodation || !this.currentUser) {
      this.messageService.show('warning', 'Hiányzó adatok', 'Kérlek töltsd ki az összes kötelező mezőt!');
      return;
    }

    const startDate = new Date(this.bookingForm.value.startDate);
    const endDate = new Date(this.bookingForm.value.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      this.messageService.show('warning', 'Érvénytelen dátum', 'A kezdő dátum nem lehet a múltban!');
      return;
    }

    if (endDate <= startDate) {
      this.messageService.show('warning', 'Érvénytelen dátum', 'A befejező dátumnak későbbinek kell lennie a kezdő dátumnál!');
      return;
    }

    if (this.bookingForm.value.persons > this.selectedAccommodation.maxCapacity) {
      this.messageService.show('warning', 'Túl sok személy', `Maximum ${this.selectedAccommodation.maxCapacity} fő foglalható!`);
      return;
    }

    if (!this.isDateRangeAvailable()) {
      this.messageService.show('warning', 'Foglalt időszak', 'Ez az időszak már foglalt ennél a szállásnál!');
      return;
    }

    const totalPrice = this.calculateTotalPrice();
    const nights = this.calculateNights();

    const bookingData: Booking = {
      userId: this.currentUser.id,
      accommodationId: this.selectedAccommodation.id,
      startDate: this.bookingForm.value.startDate,
      endDate: this.bookingForm.value.endDate,
      persons: this.bookingForm.value.persons,
      totalPrice: totalPrice,
      status: 1
    };

    this.isSavingBooking = true;

    try {
      // Mentés az adatbázisba
      const response = await this.apiService.insert('bookings', bookingData);
      
      if (response && response.status === 200) {
        
        // Email küldése
        try {
          const emailData = {
            template: 'booking-confirmation',
            to: this.currentUser.email,
            subject: 'Foglalás megerősítése - Szállásfoglaló',
            data: {
              userName: this.currentUser.name,
              accommodationName: this.selectedAccommodation.name,
              accommodationAddress: this.selectedAccommodation.address,
              startDate: this.formatDate(this.bookingForm.value.startDate),
              endDate: this.formatDate(this.bookingForm.value.endDate),
              nights: nights,
              persons: this.bookingForm.value.persons,
              totalPrice: totalPrice.toLocaleString('hu-HU')
            }
          };

          const emailResponse = await this.apiService.sendmail(emailData);
          
          if (emailResponse && emailResponse.status === 200) {
            console.log('Email sikeresen elküldve');
          } else {
            console.warn('Email küldés sikertelen, de a foglalás mentve');
          }
        } catch (emailError) {
          console.error('Email küldési hiba:', emailError);
          // Ne szakítsuk meg a folyamatot, ha az email nem megy el
        }

        this.messageService.show(
          'success',
          'Sikeres szállásfoglalás!',
          'Foglalását megtekintheti a profiljában. Megerősítő emailt küldtünk!'
        );

        await this.loadBookings();
        this.closeBookingModal();
        
      } else {
        this.messageService.show('danger', 'Hiba', response?.message || 'Hiba történt a foglalás során!');
      }
    } catch (error) {
      this.messageService.show('danger', 'Hiba', 'Hiba történt a foglalás létrehozása során!');
      console.error('💥 Booking error:', error);
    } finally {
      this.isSavingBooking = false;
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  }

  // ===== LIGHTBOX METÓDUSOK =====

  openLightbox(images: string[], index: number): void {
    if (images.length === 0) return;
    this.lightboxImages = images;
    this.currentImageIndex = index;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
    this.lightboxImages = [];
    this.currentImageIndex = 0;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.lightboxImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.lightboxImages.length - 1 
      : this.currentImageIndex - 1;
  }

  // ===== SEGÉD METÓDUSOK =====

  getMinStartDate(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    const startDate = this.bookingForm.value.startDate;
    if (!startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() + 1);
      return today.toISOString().split('T')[0];
    }
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  }

  onDateChange(): void {
    const startDate = this.bookingForm.value.startDate;
    const endDate = this.bookingForm.value.endDate;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        this.bookingForm.patchValue({
          endDate: nextDay.toISOString().split('T')[0]
        });
      }
    }
    
    this.cdr.detectChanges();
  }

  // Foglalt dátumok listájának megjelenítése
  getBookedDatesDisplay(): string {
    if (this.bookedDates.length === 0) return 'Nincsenek foglalt dátumok';
    
    const sorted = this.bookedDates.sort();
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const current = new Date(sorted[i]);
      const previous = new Date(sorted[i - 1]);
      
      if ((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24) === 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? start : `${start} - ${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? start : `${start} - ${end}`);
    
    return ranges.join(', ');
  }
}