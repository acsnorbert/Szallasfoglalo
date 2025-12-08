import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  registeredAt: Date;
  bookingCount: number;
  isActive: boolean;
  notes?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [
    {
      id: '1',
      name: 'Kiss János',
      email: 'kiss.janos@example.com',
      phone: '+36 30 123 4567',
      role: 'user',
      registeredAt: new Date('2024-06-15'),
      bookingCount: 5,
      isActive: true,
      notes: 'VIP vendég'
    },
    {
      id: '2',
      name: 'Nagy Anna',
      email: 'nagy.anna@example.com',
      phone: '+36 20 987 6543',
      role: 'user',
      registeredAt: new Date('2024-08-22'),
      bookingCount: 2,
      isActive: true
    },
    {
      id: '3',
      name: 'Kovács Péter',
      email: 'kovacs.peter@example.com',
      phone: '+36 70 555 1234',
      role: 'admin',
      registeredAt: new Date('2024-01-10'),
      bookingCount: 0,
      isActive: true,
      notes: 'Admin jogosultság'
    },
    {
      id: '4',
      name: 'Szabó Éva',
      email: 'szabo.eva@example.com',
      phone: '+36 30 999 8888',
      role: 'user',
      registeredAt: new Date('2024-11-05'),
      bookingCount: 8,
      isActive: false,
      notes: 'Kért deaktiválást'
    },
    {
      id: '5',
      name: 'Tóth Gábor',
      email: 'toth.gabor@example.com',
      phone: '+36 20 111 2222',
      role: 'user',
      registeredAt: new Date('2024-09-18'),
      bookingCount: 3,
      isActive: true
    }
  ];

  filteredUsers: User[] = [];
  userForm!: FormGroup;
  showViewModal = false;
  showEditModal = false;
  selectedUser: User | null = null;
  
  searchTerm = '';
  roleFilter = 'all';
  statusFilter = 'all';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.filteredUsers = [...this.users];
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['user', Validators.required],
      isActive: [true],
      notes: ['']
    });
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

  saveUser(): void {
    if (this.userForm.valid && this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          ...this.userForm.value
        };
      }
      this.filterUsers();
      this.closeEditModal();
    }
  }

  toggleUserStatus(user: User): void {
    const action = user.isActive ? 'deaktiválni' : 'aktiválni';
    if (confirm(`Biztosan ${action} szeretnéd ${user.name} fiókját?`)) {
      user.isActive = !user.isActive;
      this.filterUsers();
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