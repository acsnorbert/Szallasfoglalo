import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
export class AccommodationListComponent implements OnInit, AfterViewInit {

  accommodations: any[] = [];
  filteredAccommodations: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  filters: FilterOptions = {
    location: '',
    capacity: 0,
    sortBy: 'default'
  };

  activeSortBtn: string = 'default';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadAccommodations();
    }, 0);
  }

  async loadAccommodations(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      
      const response = await this.apiService.selectAll('accommodations');
      

      
      if (response && response.status === 200) {
        
        if (!response.data) {
          console.warn('⚠️ Response data is null/undefined');
          this.errorMessage = 'Nincs adat a szervertől';
          this.accommodations = [];
          this.filteredAccommodations = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        if (!Array.isArray(response.data)) {
          console.warn('⚠️ Response data is not an array:', typeof response.data);
          this.errorMessage = 'Érvénytelen adatformátum';
          this.accommodations = [];
          this.filteredAccommodations = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }



        const activeAccommodations = response.data.filter((acc: any) => acc.isActive === 1);
        

        if (activeAccommodations.length === 0) {
          console.warn('⚠️ No active accommodations found');
          this.accommodations = [];
          this.filteredAccommodations = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        // Képek betöltése
        this.accommodations = await Promise.all(
          activeAccommodations.map(async (acc: any) => {
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
        

        
      } else {
        console.error('❌ API error response:', response);
        this.errorMessage = response?.message || 'Nem sikerült betölteni a szállásokat';
        this.accommodations = [];
        this.filteredAccommodations = [];
      }
      
    } catch (error) {
      console.error('💥 Exception in loadAccommodations:', error);
      this.errorMessage = 'Hiba történt a betöltés közben';
      this.accommodations = [];
      this.filteredAccommodations = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      
    }
  }

  async loadImages(accommodationId: number): Promise<string[]> {
    try {
      const response = await this.apiService.selectAll('accommodation_images');
      
      if (response && response.status === 200 && response.data && Array.isArray(response.data)) {
        const filtered = response.data
          .filter((img: any) => img.accommodationId === accommodationId)
          .map((img: any) => `${environment.apiUrl}/uploads/${img.imagePath}`);
        
        return filtered;
      }
    } catch (error) {
      console.error(`❌ Error loading images for accommodation ${accommodationId}:`, error);
    }
    
    return [];
  }

  applyFilters(): void {
    
    this.filteredAccommodations = this.accommodations.filter(acc => {
      const locationMatch = !this.filters.location || 
        acc.location.toLowerCase().includes(this.filters.location.toLowerCase());
      
      const capacityMatch = this.filters.capacity === 0 || 
        acc.capacity >= this.filters.capacity;
      
      return locationMatch && capacityMatch;
    });

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
        this.filteredAccommodations = [...this.accommodations.filter(acc => {
          const locationMatch = !this.filters.location || 
            acc.location.toLowerCase().includes(this.filters.location.toLowerCase());
          const capacityMatch = this.filters.capacity === 0 || 
            acc.capacity >= this.filters.capacity;
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