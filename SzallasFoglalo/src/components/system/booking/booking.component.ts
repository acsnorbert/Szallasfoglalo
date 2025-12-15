import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { MessageService } from '../../../services/message';
import { environment } from '../../../environments/environment';

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
  errorMessage: string = '';

  // Lightbox
  showLightbox = false;
  lightboxImages: string[] = [];
  currentImageIndex = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
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
  }

  async loadCurrentUser(): Promise<void> {
    try {
      
      // Feltételezzük, hogy van egy sessionStorage vagy localStorage-ban tárolt user
      const userStr = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        return;
      }
      
      // Ha nincs bejelentkezve, próbáljuk meg lekérni az első user-t (demo célra)
      const response = await this.apiService.selectAll('users');
      if (response && response.status === 200 && response.data && response.data.length > 0) {
        // Demo: első nem-admin user
        const demoUser = response.data.find((u: any) => u.role === 'user');
        if (demoUser) {
          this.currentUser = {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role
          };

        }
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
    }
  }

  async loadAccommodations(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      
      const response = await this.apiService.selectAll('accommodations');
      
      
      if (response && response.status === 200) {
        if (!response.data || !Array.isArray(response.data)) {
          console.warn('⚠️ Invalid accommodations data');
          this.errorMessage = 'Érvénytelen szállás adatok';
          this.accommodations = [];
          this.filteredAccommodations = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        const activeAccommodations = response.data.filter((acc: any) => acc.isActive === 1);
        
        this.accommodations = activeAccommodations.map((acc: any) => ({
          ...acc,
          isActive: acc.isActive === 1,
          images: []
        }));
        
        // Képek betöltése minden szálláshoz
        for (let acc of this.accommodations) {
          await this.loadImages(acc);
        }
        
        this.filterAccommodations();
        
        
      } else {
        console.error('❌ Failed to load accommodations:', response);
        this.errorMessage = response?.message || 'Nem sikerült betölteni a szállásokat';
        this.accommodations = [];
        this.filteredAccommodations = [];
      }
      
    } catch (error) {
      console.error('💥 Error loading accommodations:', error);
      this.errorMessage = 'Hiba történt a szállások betöltése közben';
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
      this.messageService.show('warning', 'Hiba', 'Kérlek jelentkezz be a foglaláshoz!');
      return;
    }

    this.selectedAccommodation = accommodation;
    this.bookingForm.patchValue({
      persons: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedAccommodation = null;
    this.bookingForm.reset();
  }

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
    
    // Ellenőrizzük, hogy van-e ütközés a meglévő foglalásokkal
    const conflicts = this.existingBookings.filter(booking => {
      if (booking.accommodationId !== this.selectedAccommodation!.id) return false;
      
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      // Ütközés ellenőrzés
      return (startDate < bookingEnd && endDate > bookingStart);
    });
    
    return conflicts.length === 0;
  }

  async saveBooking(): Promise<void> {
    
    if (!this.bookingForm.valid || !this.selectedAccommodation || !this.currentUser) {
      this.messageService.show('warning', 'Hiba', 'Kérlek töltsd ki az összes kötelező mezőt!');
      return;
    }

    const startDate = new Date(this.bookingForm.value.startDate);
    const endDate = new Date(this.bookingForm.value.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validációk
    if (startDate < today) {
      this.messageService.show('warning', 'Hiba', 'A kezdő dátum nem lehet a múltban!');
      return;
    }

    if (endDate <= startDate) {
      this.messageService.show('warning', 'Hiba', 'A befejező dátumnak későbbinek kell lennie a kezdő dátumnál!');
      return;
    }

    if (this.bookingForm.value.persons > this.selectedAccommodation.maxCapacity) {
      this.messageService.show('warning', 'Hiba', `Maximum ${this.selectedAccommodation.maxCapacity} fő foglalható!`);
      return;
    }

    if (!this.isDateRangeAvailable()) {
      this.messageService.show('warning', 'Hiba', 'Ez az időszak már foglalt ennél a szállásnál!');
      return;
    }

    const totalPrice = this.calculateTotalPrice();

    const bookingData: Booking = {
      userId: this.currentUser.id,
      accommodationId: this.selectedAccommodation.id,
      startDate: this.bookingForm.value.startDate,
      endDate: this.bookingForm.value.endDate,
      persons: this.bookingForm.value.persons,
      totalPrice: totalPrice,
      status: 1 // Aktív/Megerősített
    };

    try {
      const response = await this.apiService.insert('bookings', bookingData);
      
      
      if (response && response.status === 200) {
        this.messageService.show('success', 'Siker', `Foglalás sikeresen létrehozva! Összesen: ${totalPrice.toLocaleString('hu-HU')} Ft`);
        await this.loadBookings();
        this.closeBookingModal();
      } else {
        this.messageService.show('warning', 'Hiba', response?.message || 'Hiba történt a foglalás során!');
      }
    } catch (error) {
      this.messageService.show('warning', 'Hiba', 'Hiba történt a foglalás létrehozása során!');
      console.error('💥 Booking error:', error);
    }
  }

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
}