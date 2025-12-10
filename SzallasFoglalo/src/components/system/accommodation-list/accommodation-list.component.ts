import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { environment } from '../../../environments/environment';

interface Accommodation {
  id: number;
  name: string;
  address: string;
  shortDescription: string;
  longDescription: string;
  maxCapacity: number;
  basePrice: number;
  isActive: boolean;
  images: string[];
  rooms?: any[];
}

interface FilterOptions {
  location: string;
  capacity: number;
  sortBy: 'default' | 'price' | 'name' | 'capacity';
}

@Component({
  selector: 'app-accommodation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accommodation-list.component.html',
  styleUrl: './accommodation-list.component.scss'
})
export class AccommodationListComponent implements OnInit {

  accommodations: any[] = [];
  filteredAccommodations: any[] = [];
  
  filters: FilterOptions = {
    location: '',
    capacity: 0,
    sortBy: 'default'
  };

  activeSortBtn: string = 'default';

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadAccommodations();
  }

  async loadAccommodations(): Promise<void> {
    const response = await this.apiService.selectAll('accommodations');
    
    if (response.status === 200) {
      this.accommodations = await Promise.all(
        response.data
          .filter((acc: any) => acc.isActive === 1)
          .map(async (acc: any) => {
            const images = await this.loadImages(acc.id);
            return {
              id: acc.id,
              title: acc.name,
              description: acc.shortDescription,
              location: acc.address,
              capacity: acc.maxCapacity,
              price: acc.basePrice,
              image: images.length > 0 ? images[0] : null,
              images: images,
              available: true,
              bedType: 'Vegyes',
              rating: 5
            };
          })
      );

      this.filteredAccommodations = [...this.accommodations];
    }
  }

  async loadImages(accommodationId: number): Promise<string[]> {
    const response = await this.apiService.selectAll('accommodation_images');
    
    if (response.status === 200) {
      return response.data
        .filter((img: any) => img.accommodationId === accommodationId)
        .map((img: any) => `${environment.apiUrl}/uploads/${img.imagePath}`);
    }
    
    return [];
  }

  applyFilters(): void {
    this.filteredAccommodations = this.accommodations.filter(acc => {
      // Hely szerinti szűrés
      const locationMatch = acc.location.toLowerCase().includes(this.filters.location.toLowerCase());
      
      // Férőhely szerinti szűrés
      const capacityMatch = this.filters.capacity === 0 || acc.capacity >= this.filters.capacity;
      
      return locationMatch && capacityMatch;
    });

    // Rendezés alkalmazása
    this.sortAccommodations();
  }

  sortAccommodations(): void {
    switch (this.filters.sortBy) {
      case 'price':
        this.filteredAccommodations.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        this.filteredAccommodations.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'capacity':
        this.filteredAccommodations.sort((a, b) => b.capacity - a.capacity);
        break;
      case 'default':
      default:
        // Eredeti sorrend
        this.filteredAccommodations = [...this.accommodations.filter(acc => {
          const locationMatch = acc.location.toLowerCase().includes(this.filters.location.toLowerCase());
          const capacityMatch = this.filters.capacity === 0 || acc.capacity >= this.filters.capacity;
          return locationMatch && capacityMatch;
        })];
        break;
    }
  }

  setSortBy(sortType: 'price' | 'name' | 'capacity' | 'default'): void {
    this.filters.sortBy = sortType;
    this.activeSortBtn = sortType;
    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = {
      location: '',
      capacity: 0,
      sortBy: 'default'
    };
    this.activeSortBtn = 'default';
    this.filteredAccommodations = [...this.accommodations];
  }
}