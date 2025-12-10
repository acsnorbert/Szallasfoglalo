import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth'
import { environment } from '../../../environments/environment'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  currentUser: any;
  isLoading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  successMessage = '';
  errorMessage = '';
  
  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserData();
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