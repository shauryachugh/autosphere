export type AccessoryCategory =
  | 'interior'
  | 'exterior'
  | 'cleaning_detailing'
  | 'electronics_infotainment'
  | 'safety_utility'
  | 'ev_accessories'
  | 'maintenance_essentials';

export interface AccessoryItem {
  id: string;
  name: string;
  brand: string;
  category: AccessoryCategory;
  shortDescription: string;
  indicativePriceINR: number;
  image: string;
  photos?: string[];
  compatibilityType: 'universal' | 'specific';
  compatibleMakes?: string[];
  compatibleModels?: string[];
  compatibleVariants?: string[];
  specifications: Record<string, string>;
  installationDifficulty: 'easy_diy' | 'moderate' | 'professional_required';
  isSampleCatalogData: boolean;
  isSaved?: boolean;
}

export interface AccessoryFilterCriteria {
  searchQuery?: string;
  category?: string;
  maxPriceINR?: number;
  vehicleModel?: string;
  vehicleMake?: string;
  onlyCompatibleWithGarage?: boolean;
}
