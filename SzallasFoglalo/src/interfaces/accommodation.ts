export interface Accommodation {
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