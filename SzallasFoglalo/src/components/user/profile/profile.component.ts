import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';
import { ApiService } from '../../../services/api';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit, AfterViewInit {

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
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
  }

  ngAfterViewInit(): void {
    // Aszinkron betöltés - először user, utána bookings
    setTimeout(async () => {
      await this.loadUserData();
      await this.loadBookings();
    }, 0);
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

  async loadUserData(): Promise<void> {
    this.currentUser = this.authService.loggedUser();
    console.log('LoadUserData - currentUser:', this.currentUser);
    
    if (this.currentUser && this.currentUser[0]) {
      this.profileForm.patchValue({
        name: this.currentUser[0].name,
        email: this.currentUser[0].email
      });
    }
  }

  // Bookings Methods - booking.component mintájára
  async loadBookings(): Promise<void> {
    if (!this.currentUser || !this.currentUser[0]?.id) {
      console.log('Nincs bejelentkezett user');
      return;
    }

    this.bookingsLoading = true;
    const userId = this.currentUser[0].id;

    try {
      // Lekérjük az összes foglalást
      const bookingsResponse = await this.apiService.selectAll('bookings');
      
      if (!bookingsResponse || bookingsResponse.status !== 200 || !bookingsResponse.data) {
        console.error('Hiba a foglalások lekérésénél');
        this.bookings = [];
        this.bookingsLoading = false;
        return;
      }

      console.log('Összes foglalás:', bookingsResponse.data);
      console.log('Keresett userId:', userId, 'Típusa:', typeof userId);
      
      // Szűrjük a user foglalásait és aktív státuszúakat
      const userBookings = bookingsResponse.data.filter((b: any) => {
        console.log(`Foglalás ID: ${b.id}, userId: ${b.userId} (${typeof b.userId}), status: ${b.status} (${typeof b.status})`);
        console.log(`Összehasonlítás: ${b.userId} == ${userId} = ${b.userId == userId}`);
        console.log(`Státusz: ${b.status} == 1 = ${b.status == 1}`);
        return Number(b.userId) === Number(userId) && Number(b.status) === 1;
      });

      console.log('User foglalásai:', userBookings);

      if (userBookings.length === 0) {
        this.bookings = [];
        this.bookingsLoading = false;
        return;
      }

      // Lekérjük az összes szállást
      const accommodationsResponse = await this.apiService.selectAll('accommodations');
      const allAccommodations = accommodationsResponse?.data || [];

      // Lekérjük az összes képet
      const imagesResponse = await this.apiService.selectAll('accommodation_images');
      const allImages = imagesResponse?.data || [];

      // Összerakjuk a foglalásokat a szállás adataival
      this.bookings = userBookings.map((booking: any) => {
        const accommodation = allAccommodations.find((acc: any) => acc.id === booking.accommodationId);
        const images = allImages.filter((img: any) => img.accommodationId === booking.accommodationId);
        const mainImage = images.length > 0 ? images[0].imagePath : null;

        return {
          ...booking,
          accommodationName: accommodation?.name || 'Ismeretlen szállás',
          description: accommodation?.description || '',
          address: accommodation?.address || '',
          maxCapacity: accommodation?.maxCapacity || 0,
          basePrice: accommodation?.basePrice || 0,
          mainImage: mainImage
        };
      });

      console.log('Feldolgozott foglalások:', this.bookings);
      
    } catch (error) {
      console.error('Hiba a foglalások betöltésekor:', error);
      this.showError('Hiba történt a foglalások betöltésekor!');
      this.bookings = [];
    } finally {
      this.bookingsLoading = false;
    }
  }

  openEditModal(booking: any): void {
    this.selectedBooking = booking;
    this.editBookingForm.patchValue({
      startDate: this.formatDateForInput(booking.startDate),
      endDate: this.formatDateForInput(booking.endDate),
      persons: booking.persons
    });
    
    // Validátor frissítése a max capacity-vel
    this.editBookingForm.get('persons')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(booking.maxCapacity)
    ]);
    this.editBookingForm.get('persons')?.updateValueAndValidity();
    
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

  async updateBooking(): Promise<void> {
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

    try {
      const response = await this.apiService.update('bookings', bookingId, updateData);
      
      if (response && response.status === 200) {
        this.showSuccess('Foglalás sikeresen módosítva!');
        this.closeEditModal();
        await this.loadBookings();
      } else {
        this.showError('Hiba a foglalás módosításakor!');
      }
    } catch (error) {
      console.error('Hiba a módosításkor:', error);
      this.showError('Hiba a foglalás módosításakor!');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteBooking(): Promise<void> {
    if (!this.selectedBooking) return;

    this.isLoading = true;
    this.clearMessages();

    const bookingId = this.selectedBooking.id;

    try {
      // Státusz 0-ra állítása (soft delete)
      const response = await this.apiService.update('bookings', bookingId, { status: 0 });
      
      if (response && response.status === 200) {
        this.showSuccess('Foglalás sikeresen törölve!');
        this.closeDeleteModal();
        await this.loadBookings();
      } else {
        this.showError('Hiba a foglalás törlésekor!');
      }
    } catch (error) {
      console.error('Hiba a törléskor:', error);
      this.showError('Hiba a foglalás törlésekor!');
    } finally {
      this.isLoading = false;
    }
  }

  calculateNewPrice(): number {
    if (!this.editBookingForm || !this.selectedBooking) return 0;

    const startDate = new Date(this.editBookingForm.get('startDate')?.value);
    const endDate = new Date(this.editBookingForm.get('endDate')?.value);
    const persons = this.editBookingForm.get('persons')?.value;

    if (!startDate || !endDate || !persons) return 0;

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = this.selectedBooking.basePrice;

    return days * basePrice * persons;
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