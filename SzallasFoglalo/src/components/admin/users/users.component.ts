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
  bookingCount: number;
  isActive: boolean;   
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
      role: ['user', Validators.required],
      isActive: [true]
    });
  }

  async loadUsers(): Promise<void> {
    try {
      const response = await this.apiService.selectAll('users');
      if (response.status === 200) {
        // Foglalások számának betöltése
        const bookingsResponse = await this.apiService.selectAll('bookings');
        const bookings = bookingsResponse.status === 200 ? bookingsResponse.data : [];
        
        this.users = response.data.map((user: any) => ({
          ...user,
          // Ha van isActive mező, használjuk, különben alapértelmezett true
          isActive: user.isActive !== undefined ? (user.isActive === 1) : true,
          // Foglalások száma - mindig számoljuk, lehet 0 is
          bookingCount: bookings.filter((b: any) => b.userId === user.id).length
        }));
        
        console.log('Betöltött felhasználók:', this.users);
        this.filterUsers();
      }
    } catch (error) {
      console.error('Hiba a felhasználók betöltése során:', error);
      alert('Hiba történt a felhasználók betöltése során!');
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
    
    console.log('Szűrt felhasználók:', this.filteredUsers);
  }

  viewUser(user: User): void {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    this.showEditModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.userForm.reset({ role: 'user', isActive: true });
  }

  async saveUser(): Promise<void> {
    if (this.userForm.valid && this.selectedUser) {
      const userData = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        role: this.userForm.value.role,
        isActive: this.userForm.value.isActive ? 1 : 0
      };
      
      try {
        const response = await this.apiService.update('users', this.selectedUser.id, userData);
        if (response.status === 200) {
          alert('Felhasználó sikeresen frissítve!');
          await this.loadUsers();
          this.closeEditModal();
        } else {
          alert(response.message || 'Hiba történt a mentés során!');
        }
      } catch (error) {
        console.error('Mentési hiba:', error);
        alert('Hiba történt a mentés során!');
      }
    }
  }

  async toggleUserStatus(user: User): Promise<void> {
    const action = user.isActive ? 'deaktiválni' : 'aktiválni';
    if (confirm(`Biztosan ${action} szeretnéd ${user.name} fiókját?`)) {
      const newStatus = !user.isActive;
      
      try {
        const response = await this.apiService.update('users', user.id, { 
          isActive: newStatus ? 1 : 0 
        });
        
        if (response.status === 200) {
          user.isActive = newStatus;
          alert(`Felhasználó sikeresen ${newStatus ? 'aktiválva' : 'deaktiválva'}!`);
          this.filterUsers();
        } else {
          alert(response.message || 'Hiba történt a művelet során!');
        }
      } catch (error) {
        console.error('Státusz váltási hiba:', error);
        alert('Hiba történt a művelet során!');
      }
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
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