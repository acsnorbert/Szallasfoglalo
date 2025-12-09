import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  bookingCount?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  userForm!: FormGroup;
  showViewModal = false;
  showEditModal = false;
  selectedUser: User | null = null;
  
  searchTerm = '';
  roleFilter = 'all';
  statusFilter = 'all';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });
  }

  async loadUsers(): Promise<void> {
    const response = await this.apiService.selectAll('users');
    if (response.status === 200) {
      // Foglalások számának betöltése
      const bookingsResponse = await this.apiService.selectAll('bookings');
      const bookings = bookingsResponse.status === 200 ? bookingsResponse.data : [];
      
      this.users = response.data.map((user: any) => ({
        ...user,
        isActive: true, // Alapértelmezett érték, ha nincs az adatbázisban
        bookingCount: bookings.filter((b: any) => b.userId === user.id).length
      }));
      
      this.filterUsers();
    }
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
      
      const matchesStatus = this.statusFilter === 'all' ||
                           (this.statusFilter === 'active' && user.isActive) ||
                           (this.statusFilter === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  viewUser(user: User): void {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.showEditModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  async saveUser(): Promise<void> {
    if (this.userForm.valid && this.selectedUser) {
      const userData = this.userForm.value;
      
      const response = await this.apiService.update('users', this.selectedUser.id, userData);
      if (response.status === 200) {
        alert('Felhasználó sikeresen frissítve!');
        await this.loadUsers();
      } else {
        alert(response.message || 'Hiba történt a mentés során!');
      }
      
      this.closeEditModal();
    }
  }

  async toggleUserStatus(user: User): Promise<void> {
    const action = user.isActive ? 'deaktiválni' : 'aktiválni';
    if (confirm(`Biztosan ${action} szeretnéd ${user.name} fiókját?`)) {
      user.isActive = !user.isActive;
      
      // Ha van status mező az adatbázisban
      const response = await this.apiService.update('users', user.id, { 
        status: user.isActive ? 1 : 0 
      });
      
      if (response.status === 200) {
        alert(`Felhasználó sikeresen ${user.isActive ? 'aktiválva' : 'deaktiválva'}!`);
        this.filterUsers();
      } else {
        user.isActive = !user.isActive; // Visszaállítjuk
        alert(response.message || 'Hiba történt a művelet során!');
      }
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getRoleText(role: string): string {
    return role === 'admin' ? 'Admin' : 'User';
  }
}