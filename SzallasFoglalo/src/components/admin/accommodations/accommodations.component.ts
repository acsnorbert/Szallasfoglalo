import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
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

@Component({
  selector: 'app-accommodations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.scss']
})
export class AccommodationsComponent implements OnInit {

  accommodations: Accommodation[] = [];
  filteredAccommodations: Accommodation[] = [];
  accommodationForm!: FormGroup;
  showModal = false;
  showImageModal = false;
  editMode = false;
  selectedAccommodation: Accommodation | null = null;
  searchTerm = '';
  statusFilter = 'all';

  // Lightbox
  showLightbox = false;
  lightboxImages: string[] = [];
  currentImageIndex = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadAccommodations();
  }

  initForm(): void {
    this.accommodationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: [''],
      maxCapacity: [1, [Validators.required, Validators.min(1)]],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  async loadAccommodations(): Promise<void> {
    const response = await this.apiService.selectAll('accommodations');
    if (response.status === 200) {
      this.accommodations = response.data.map((acc: any) => ({
        ...acc,
        isActive: acc.isActive === 1,
        images: []
      }));
      
      // Képek betöltése minden szálláshoz
      for (let acc of this.accommodations) {
        await this.loadImages(acc);
      }
      
      this.filterAccommodations();
    }
  }

  async loadImages(accommodation: Accommodation): Promise<void> {
    const response = await this.apiService.selectAll('accommodation_images');
    if (response.status === 200) {
      const images = response.data
        .filter((img: any) => img.accommodationId === accommodation.id)
        .map((img: any) => `${environment.apiUrl}/uploads/${img.imagePath}`);
      accommodation.images = images;
    }
  }

  filterAccommodations(): void {
    this.filteredAccommodations = this.accommodations.filter(acc => {
      const matchesSearch = acc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           acc.address.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' ||
                           (this.statusFilter === 'active' && acc.isActive) ||
                           (this.statusFilter === 'inactive' && !acc.isActive);
      return matchesSearch && matchesStatus;
    });
  }

  openCreateModal(): void {
    this.editMode = false;
    this.accommodationForm.reset({ isActive: true, maxCapacity: 1, basePrice: 0 });
    this.showModal = true;
  }

  editAccommodation(accommodation: Accommodation): void {
    this.editMode = true;
    this.selectedAccommodation = accommodation;
    this.accommodationForm.patchValue(accommodation);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAccommodation = null;
    this.accommodationForm.reset();
  }

  async saveAccommodation(): Promise<void> {
    if (this.accommodationForm.valid) {
      const formValue = {
        ...this.accommodationForm.value,
        description: this.accommodationForm.value.shortDescription, // Kompatibilitás miatt
        isActive: this.accommodationForm.value.isActive ? 1 : 0
      };
      
      if (this.editMode && this.selectedAccommodation) {
        const response = await this.apiService.update('accommodations', this.selectedAccommodation.id, formValue);
        if (response.status === 200) {
          alert('Szállás sikeresen frissítve!');
          await this.loadAccommodations();
        } else {
          alert(response.message || 'Hiba történt a mentés során!');
        }
      } else {
        const response = await this.apiService.insert('accommodations', formValue);
        if (response.status === 200) {
          alert('Szállás sikeresen létrehozva!');
          await this.loadAccommodations();
        } else {
          alert(response.message || 'Hiba történt a létrehozás során!');
        }
      }

      this.closeModal();
    }
  }

  async deleteAccommodation(accommodation: Accommodation): Promise<void> {
    if (confirm(`Biztosan törölni szeretnéd a(z) "${accommodation.name}" szállást?`)) {
      const response = await this.apiService.delete('accommodations', accommodation.id);
      if (response.status === 200) {
        alert('Szállás sikeresen törölve!');
        await this.loadAccommodations();
      } else {
        alert(response.message || 'Hiba történt a törlés során!');
      }
    }
  }

  manageImages(accommodation: Accommodation): void {
    this.selectedAccommodation = accommodation;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedAccommodation = null;
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && this.selectedAccommodation) {
      const files = Array.from(input.files);
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const uploadResponse = await this.apiService.upload(formData);
        if (uploadResponse.status === 200) {
          // Kép mentése az adatbázisba
          const imageData = {
            accommodationId: this.selectedAccommodation.id,
            imagePath: uploadResponse.data.filename
          };
          
          const insertResponse = await this.apiService.insert('accommodation_images', imageData);
          if (insertResponse.status === 200) {
            // Képek újratöltése
            await this.loadImages(this.selectedAccommodation);
          }
        } else {
          alert(uploadResponse.message || 'Hiba történt a kép feltöltése során!');
        }
      }
      
      // Input mező törlése a következő feltöltéshez
      input.value = '';
    }
  }

  async deleteImage(index: number): Promise<void> {
    if (this.selectedAccommodation && confirm('Biztosan törölni szeretnéd ezt a képet?')) {
      const imagePath = this.selectedAccommodation.images[index];
      const filename = imagePath.split('/').pop();
      
      if (!filename) return;
      
      // Töröljük a fájlt a szerverről
      const deleteFileResponse = await this.apiService.deleteImage(filename);
      
      if (deleteFileResponse.status === 200) {
        // Megkeressük az image_id-t az adatbázisban
        const imagesResponse = await this.apiService.selectAll('accommodation_images');
        if (imagesResponse.status === 200) {
          const imageRecord = imagesResponse.data.find((img: any) => 
            img.accommodationId === this.selectedAccommodation!.id && 
            img.imagePath === filename
          );
          
          if (imageRecord) {
            // Töröljük az adatbázisból
            await this.apiService.delete('accommodation_images', imageRecord.id);
            this.selectedAccommodation.images.splice(index, 1);
          }
        }
      } else {
        alert(deleteFileResponse.message || 'Hiba történt a kép törlése során!');
      }
    }
  }

  openLightbox(images: string[], index: number): void {
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