import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth'
import { environment } from '../../../environments/environment'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  editBookingForm!: FormGroup;
  
  currentUser: any;
  isLoading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  successMessage = '';
  errorMessage = '';
  
  // Bookings variables
  bookings: any[] = [];
  bookingsLoading = false;
  selectedBooking: any = null;
  showEditModal = false;
  showDeleteModal = false;
  
  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserData();
    this.loadBookings();
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, this.emailValidator]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.editBookingForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      persons: ['', [Validators.required, Validators.min(1)]]
    }, { validators: this.dateRangeValidator });
  }

  loadUserData(): void {
    this.currentUser = this.authService.loggedUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser[0].name,
        email: this.currentUser[0].email
      });
    }
  }

  // Bookings Methods
  loadBookings(): void {
    if (!this.currentUser || !this.currentUser[0]?.id) return;

    this.bookingsLoading = true;
    const userId = this.currentUser[0].id;

    // Lekérjük az összes foglalást
    this.http.get<any[]>(`${this.apiUrl}/bookings`).subscribe({
      next: (allBookings) => {
        console.log('Összes foglalás:', allBookings);
        console.log('Bejelentkezett user ID:', userId);
        
        // Szűrjük a user foglalásait és aktív státuszúakat
        const userBookings = allBookings.filter(b => {
          console.log('Foglalás userId:', b.userId, 'Típusa:', typeof b.userId);
          console.log('Összehasonlítva:', b.userId, '==', userId, '=', b.userId == userId);
          return b.userId == userId && b.status == 1;
        });
        
        if (userBookings.length === 0) {
          this.bookings = [];
          this.bookingsLoading = false;
          return;
        }

        // Minden foglaláshoz lekérjük a szállás adatait
        const accommodationRequests = userBookings.map(booking => 
          this.http.get<any>(`${this.apiUrl}/accommodations/${booking.accommodationId}`)
        );

        forkJoin(accommodationRequests).subscribe({
          next: (accommodations) => {
            // Összerakjuk a foglalást a szállás adataival
            this.bookings = userBookings.map((booking, index) => {
              const accommodation = accommodations[index][0]; // Az API tömböt ad vissza
              return {
                ...booking,
                accommodationName: accommodation.name,
                description: accommodation.description,
                address: accommodation.address,
                maxCapacity: accommodation.maxCapacity,
                basePrice: accommodation.basePrice
              };
            });

            // Lekérjük a képeket is
            this.loadBookingImages();
          },
          error: (error) => {
            console.error('Hiba a szállások betöltésekor:', error);
            this.showError('Hiba történt a szállások adatainak betöltésekor!');
            this.bookingsLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Hiba a foglalások betöltésekor:', error);
        this.showError('Hiba történt a foglalások betöltésekor!');
        this.bookingsLoading = false;
      }
    });
  }

  loadBookingImages(): void {
    const imageRequests = this.bookings.map(booking =>
      this.http.get<any[]>(`${this.apiUrl}/accommodation_images/accommodationId/eq/${booking.accommodationId}`)
    );

    forkJoin(imageRequests).subscribe({
      next: (imagesArrays) => {
        this.bookings = this.bookings.map((booking, index) => {
          const images = imagesArrays[index];
          return {
            ...booking,
            mainImage: images && images.length > 0 ? images[0].imagePath : null
          };
        });
        this.bookingsLoading = false;
      },
      error: (error) => {
        console.error('Hiba a képek betöltésekor:', error);
        // Még akkor is megjelenítjük a foglalásokat, ha a képek nem töltődnek be
        this.bookingsLoading = false;
      }
    });
  }

  openEditModal(booking: any): void {
    this.selectedBooking = booking;
    this.editBookingForm.patchValue({
      startDate: this.formatDateForInput(booking.startDate),
      endDate: this.formatDateForInput(booking.endDate),
      persons: booking.persons
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBooking = null;
    this.editBookingForm.reset();
  }

  openDeleteModal(booking: any): void {
    this.selectedBooking = booking;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedBooking = null;
  }

  updateBooking(): void {
    if (this.editBookingForm.invalid || !this.selectedBooking) {
      this.showError('Kérjük, töltsd ki helyesen az összes mezőt!');
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const bookingId = this.selectedBooking.id;
    const updateData = {
      startDate: this.editBookingForm.get('startDate')?.value,
      endDate: this.editBookingForm.get('endDate')?.value,
      persons: this.editBookingForm.get('persons')?.value,
      totalPrice: this.calculateNewPrice()
    };

    this.http.patch(`${this.apiUrl}/bookings/${bookingId}`, updateData).subscribe({
      next: (response) => {
        this.showSuccess('Foglalás sikeresen módosítva!');
        this.closeEditModal();
        this.loadBookings();
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.error?.error || 'Hiba a foglalás módosításakor!');
        this.isLoading = false;
      }
    });
  }

  deleteBooking(): void {
    if (!this.selectedBooking) return;

    this.isLoading = true;
    this.clearMessages();

    const bookingId = this.selectedBooking.id;

    // Státusz 0-ra állítása (soft delete)
    this.http.patch(`${this.apiUrl}/bookings/${bookingId}`, { status: 0 }).subscribe({
      next: (response) => {
        this.showSuccess('Foglalás sikeresen törölve!');
        this.closeDeleteModal();
        this.loadBookings();
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.error?.error || 'Hiba a foglalás törlésekor!');
        this.isLoading = false;
      }
    });
  }

  calculateNewPrice(): number {
    if (!this.editBookingForm || !this.selectedBooking) return 0;

    const startDate = new Date(this.editBookingForm.get('startDate')?.value);
    const endDate = new Date(this.editBookingForm.get('endDate')?.value);
    const persons = this.editBookingForm.get('persons')?.value;

    if (!startDate || !endDate || !persons) return 0;

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = this.selectedBooking.basePrice;

    return days * basePrice;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}.`;
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getImagePath(imageName: string): string {
    if (!imageName) return 'assets/images/placeholder.jpg';
    return `${this.apiUrl}/uploads/${imageName}`;
  }

  getPersonsErrorMessage(): string {
    const personsControl = this.editBookingForm.get('persons');
    if (personsControl?.hasError('required')) {
      return 'A személyek száma kötelező!';
    }
    if (personsControl?.hasError('min')) {
      return 'Legalább 1 személynek kell lennie!';
    }
    if (personsControl?.hasError('max')) {
      return `Maximum ${this.selectedBooking?.maxCapacity} fő foglalható!`;
    }
    return '';
  }

  // Existing methods
  emailValidator(control: any) {
    const email = control.value;
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : { invalidEmail: true };
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  dateRangeValidator(group: FormGroup) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return { endDateBeforeStart: true };
      }
    }
    
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.showError('Kérjük, töltse ki helyesen az összes mezőt!');
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const userId = this.currentUser[0].id;
    const updateData = {
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value
    };

    this.http.patch(`${this.apiUrl}/users/${userId}`, updateData).subscribe({
      next: (response) => {
        this.showSuccess('Profil adatok sikeresen frissítve!');
        this.currentUser[0].name = updateData.name;
        this.currentUser[0].email = updateData.email;
        this.updateSessionUser();
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.error?.error || 'Hiba a profil frissítésekor!');
        this.isLoading = false;
      }
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.showError('Kérjük, töltse ki helyesen az összes jelszómezőt!');
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const userId = this.currentUser[0].id;
    const passwordData = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value
    };

    this.http.patch(`${this.apiUrl}/users/${userId}`, { password: passwordData }).subscribe({
      next: (response) => {
        this.showSuccess('Jelszó sikeresen módosítva!');
        this.passwordForm.reset();
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.error?.error || 'Hiba a jelszó módosításakor!');
        this.isLoading = false;
      }
    });
  }

  updateSessionUser(): void {
    const updatedToken = JSON.stringify(this.currentUser);
    sessionStorage.setItem(environment.tokenName, updatedToken);
    localStorage.setItem(environment.tokenName, updatedToken);
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getPasswordErrorMessage(): string {
    const pwdControl = this.passwordForm.get('newPassword');
    if (pwdControl?.hasError('required')) {
      return 'Az új jelszó megadása kötelező!';
    }
    if (pwdControl?.hasError('minlength')) {
      return 'A jelszó legalább 8 karakter hosszú kell legyen!';
    }
    if (pwdControl?.hasError('pattern')) {
      return 'A jelszó tartalmazzon nagy- és kisbetűt, valamint számot!';
    }
    return '';
  }

  getEmailErrorMessage(): string {
    const emailControl = this.profileForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Az email cím megadása kötelező!';
    }
    if (emailControl?.hasError('invalidEmail')) {
      return 'Érvénytelen email formátum!';
    }
    return '';
  }

}