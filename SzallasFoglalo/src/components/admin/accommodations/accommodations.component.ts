import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface Accommodation {
  id: string;
  name: string;
  address: string;
  shortDescription: string;
  longDescription: string;
  maxCapacity: number;
  basePrice: number;
  images: string[];
  isActive: boolean;
}

@Component({
  selector: 'app-accommodations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.scss']
})
export class AccommodationsComponent implements OnInit {

  accommodations: Accommodation[] = [
    {
      id: '1',
      name: 'Deluxe Suite',
      address: 'Budapest, Andrássy út 45.',
      shortDescription: 'Tágas apartman panorámás kilátással és modern berendezéssel',
      longDescription: 'Luxus kategóriás lakosztály a város szívében, minden kényelemmel felszerelve.',
      maxCapacity: 4,
      basePrice: 45000,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800'
      ],
      isActive: true
    },
    {
      id: '2',
      name: 'Executive Room',
      address: 'Budapest, Váci utca 12.',
      shortDescription: 'Elegáns szoba üzleti utazóknak, minden kényelemmel',
      longDescription: 'Kiváló választás az üzleti utazók számára, modern felszereléssel.',
      maxCapacity: 2,
      basePrice: 32000,
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800'
      ],
      isActive: true
    },
    {
      id: '3',
      name: 'Family Suite',
      address: 'Budapest, Dohány utca 8.',
      shortDescription: 'Ideális családoknak, akár 6 fő részére kényelmesen',
      longDescription: 'Nagy családi apartman minden szükséges kényelemmel és felszereléssel.',
      maxCapacity: 6,
      basePrice: 28000,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800'
      ],
      isActive: false
    }
  ];

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.filteredAccommodations = [...this.accommodations];
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
    this.accommodationForm.reset({ isActive: true });
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

  saveAccommodation(): void {
    if (this.accommodationForm.valid) {
      const formValue = this.accommodationForm.value;
      
      if (this.editMode && this.selectedAccommodation) {
        const index = this.accommodations.findIndex(a => a.id === this.selectedAccommodation!.id);
        if (index !== -1) {
          this.accommodations[index] = {
            ...this.accommodations[index],
            ...formValue
          };
        }
      } else {
        const newAccommodation: Accommodation = {
          id: Date.now().toString(),
          ...formValue,
          images: []
        };
        this.accommodations.push(newAccommodation);
      }

      this.filterAccommodations();
      this.closeModal();
    }
  }

  deleteAccommodation(accommodation: Accommodation): void {
    if (confirm(`Biztosan törölni szeretnéd a(z) "${accommodation.name}" szállást?`)) {
      this.accommodations = this.accommodations.filter(a => a.id !== accommodation.id);
      this.filterAccommodations();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && this.selectedAccommodation) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result && this.selectedAccommodation) {
            this.selectedAccommodation.images.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  deleteImage(index: number): void {
    if (this.selectedAccommodation && confirm('Biztosan törölni szeretnéd ezt a képet?')) {
      this.selectedAccommodation.images.splice(index, 1);
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