// src/services/accessoriesService.ts
// Service for AutoSphere Accessories Hub, Compatibility Engine & Wishlist

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  AccessoryItem,
  AccessoryCategory,
  AccessoryFilterCriteria,
} from '../types/buysell.types';

export const SEED_ACCESSORIES: AccessoryItem[] = [
  // 1. INTERIOR ACCESSORIES
  {
    id: 'acc-int-01',
    name: 'AutoForm 7D Carbon All-Weather Custom Floor Mats',
    brand: 'AutoForm India',
    category: 'interior',
    shortDescription: 'Precision laser-scanned, dual-layer diamond stitched 7D mats with heel pad and detachable curly grass layer.',
    indicativePriceINR: 5499,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'specific',
    compatibleMakes: ['Mahindra', 'Tata Motors', 'Hyundai', 'Toyota', 'Maruti Suzuki', 'Kia'],
    compatibleModels: ['XUV700', 'Scorpio-N', 'Nexon', 'Creta', 'Innova Crysta', 'Seltos', 'Brezza'],
    specifications: {
      Material: 'High-Density EVA + Polyurethane Leatherette',
      Waterproof: '100% Spill & Mud Proof',
      Layers: 'Dual Layer (Base 7D + Detachable Mat)',
      Warranty: '1 Year Manufacturer Warranty',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-int-02',
    name: 'Solace Memory Foam Orthopedic Neck Rest & Lumbar Support Set',
    brand: 'Solace Auto Comfort',
    category: 'interior',
    shortDescription: 'High-density slow-rebound memory foam headrest pillow and ergonomic lower back support for long highway drives.',
    indicativePriceINR: 2199,
    image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Core: '100% Space-Grade High-Density Memory Foam',
      Cover: 'Breathable 3D Mesh Fabric (Removable & Washable)',
      Straps: 'Adjustable Dual Elastic Buckles',
      Fitment: 'Fits all car seats with adjustable headrests',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-int-03',
    name: 'HeatShield Custom Magnetic Snap-On Window Sunshades (Set of 4)',
    brand: 'HeatShield India',
    category: 'interior',
    shortDescription: 'Tailored high-strength magnetic mesh sun blinds blocking 85% UV rays while allowing window rolling.',
    indicativePriceINR: 1799,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'specific',
    compatibleMakes: ['Mahindra', 'Tata Motors', 'Hyundai', 'Maruti Suzuki', 'Honda'],
    compatibleModels: ['XUV700', 'Nexon', 'Creta', 'Swift', 'City', 'Harrier'],
    specifications: {
      Magnets: 'High-Coercivity Rare Earth Neodymium Magnets',
      Fabric: 'Tear-Resistant Micro-Perforated Polyester',
      LegalCompliance: 'See-Through (Meets MoRTH Motor Vehicle Rules)',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },

  // 2. EXTERIOR ACCESSORIES
  {
    id: 'acc-ext-01',
    name: 'ShieldPro 9H Hydrophobic Graphene Ceramic Paint Coating Kit (50ml)',
    brand: 'ShieldPro Detailing',
    category: 'exterior',
    shortDescription: 'Military-grade graphene ceramic liquid providing 3-year scratch resistance, extreme water beading, and UV protection.',
    indicativePriceINR: 3299,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Hardness: '9H+ Pencil Hardness Lab Certified',
      Durability: 'Up to 36 Months / 100 Car Washes',
      ContactAngle: '115° Super Hydrophobic Water Beading',
      Includes: '50ml Coating Bottle, Applicator Block, 4 Suede Cloths',
    },
    installationDifficulty: 'moderate',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-ext-02',
    name: 'AeroVisor Slimline Smoked Chrome-Line Door Rain Visors',
    brand: 'AeroVisor OEM',
    category: 'exterior',
    shortDescription: 'Injection-molded acrylic wind deflectors allowing window cracking in Indian monsoon rain without interior splashes.',
    indicativePriceINR: 2450,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'specific',
    compatibleMakes: ['Mahindra', 'Tata Motors', 'Hyundai', 'Toyota', 'Kia'],
    compatibleModels: ['XUV700', 'Scorpio-N', 'Nexon', 'Creta', 'Seltos', 'Innova Hycross'],
    specifications: {
      Material: 'Virgin Cast Acrylic with 3M Automotive Acrylic Plus Tape',
      Finish: 'Smoked Gloss Tint with Stainless Steel Chrome Trim',
      Pieces: 'Set of 4 Doors',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },

  // 3. CAR CLEANING AND DETAILING
  {
    id: 'acc-cln-01',
    name: 'SuperPlush 1200 GSM Edgeless Microfiber Drying Towels (Pack of 3)',
    brand: 'WaveShine Detailing',
    category: 'cleaning_detailing',
    shortDescription: 'Ultra-heavyweight 1200 GSM twisted-loop microfiber holding up to 8x its weight in water for swirl-free drying.',
    indicativePriceINR: 1199,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Density: '1200 GSM (Grams Per Square Metre)',
      Size: '40 cm x 60 cm',
      Edge: 'Hidden Silk Edge (Guaranteed Scratch-Free)',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-cln-02',
    name: 'VoltClean 120W Wireless High-Power Cyclone Car Vacuum Cleaner',
    brand: 'VoltClean Auto',
    category: 'cleaning_detailing',
    shortDescription: 'Cordless 9000 Pa high-suction vacuum with washable stainless steel HEPA filter and LED crevice nozzle.',
    indicativePriceINR: 2899,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Suction: '9,000 Pa Brushless Cyclone Motor',
      Battery: '4000 mAh Li-ion (35 min runtime, Type-C Fast Charge)',
      Filtration: 'Dual Layer Washable HEPA Filter',
      Weight: '460 grams ultra-lightweight',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },

  // 4. ELECTRONICS AND INFOTAINMENT
  {
    id: 'acc-ele-01',
    name: 'Qubo 4K Front + 1080p Rear Smart Dual Dashcam with GPS & WiFi',
    brand: 'Qubo (Hero Electronix)',
    category: 'electronics_infotainment',
    shortDescription: 'True 4K UHD dashcam with Sony IMX415 Starvis night vision, built-in GPS log, supercapacitor, and Indian heat resistance.',
    indicativePriceINR: 9990,
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Resolution: '4K Ultra HD (3840x2160p @ 30fps) Front + Full HD Rear',
      Sensor: 'Sony STARVIS IMX415 High Sensitivity Sensor',
      Storage: 'Supports up to 256GB MicroSD (Loop Recording)',
      ThermalProtection: 'Supercapacitor (-10°C to +70°C Indian heat rated)',
      App: 'Instant iOS & Android WiFi Preview & Download',
    },
    installationDifficulty: 'moderate',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-ele-02',
    name: 'VoltAir Rapid 150 PSI Cordless Digital Tyre Inflator with Auto-Cutoff',
    brand: 'VoltAir Tech',
    category: 'electronics_infotainment',
    shortDescription: 'High-speed metal motor inflator filling an R17 SUV tyre from 25 to 35 PSI in 90 seconds. Preset pressure auto-stop.',
    indicativePriceINR: 3499,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      MaxPressure: '150 PSI (Accurate Digital Display in PSI/BAR/KPA)',
      FlowRate: '35 Litres / minute all-metal dual cylinder',
      Battery: '6000 mAh Battery (also acts as Emergency USB Power Bank)',
      Light: 'High-Lumen Emergency SOS LED Torch',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },

  // 5. SAFETY AND UTILITY
  {
    id: 'acc-sft-01',
    name: 'VoltStart 1500A Peak Emergency Car Jump Starter & Power Bank',
    brand: 'VoltStart Heavy Duty',
    category: 'safety_utility',
    shortDescription: 'Instant jump-starter capable of cranking up to 8.0L petrol and 6.0L diesel engines up to 30 times on a single charge.',
    indicativePriceINR: 5999,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      PeakCurrent: '1500 Amperes Peak Output',
      Engines: 'Petrol up to 8.0L | Diesel up to 6.0L (12V Vehicles)',
      SafetyClamps: 'Smart Clamps with Reverse Polarity & Spark-Proof Protection',
      Capacity: '16,000 mAh with QuickCharge 3.0 Output',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-sft-02',
    name: 'ApexHeavy 30-Piece Tubeless Tyre Puncture Repair Kit with Plugs',
    brand: 'ApexHeavy Tools',
    category: 'safety_utility',
    shortDescription: 'Heavy-duty steel T-handle reamer and probe kit with 25 self-vulcanizing rubber strings and valve core repair tool.',
    indicativePriceINR: 899,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Handles: 'Ergonomic Cast Steel T-Handles (Non-Slip Grip)',
      Plugs: '25 Self-Vulcanizing Strips for High Heat Stability',
      Storage: 'Molded Hard Carry Case with Cutter & Pliers',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },

  // 6. EV ACCESSORIES
  {
    id: 'acc-ev-01',
    name: 'ChargeVolt 7.4 kW Type-2 Fast AC Home Wallbox EV Charger',
    brand: 'ChargeVolt Power',
    category: 'ev_accessories',
    shortDescription: '32A single-phase smart home EV wallbox with RFID authentication, WiFi/Bluetooth smartphone app, and IP65 weatherproof casing.',
    indicativePriceINR: 32500,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'specific',
    compatibleMakes: ['Tata Motors', 'Mahindra', 'MG', 'Hyundai', 'BYD', 'Kia'],
    compatibleModels: ['Nexon.ev', 'Curvv EV', 'Punch.ev', 'XUV400', 'ZS EV', 'Windsor EV', 'Ioniq 5', 'Atto 3'],
    specifications: {
      PowerOutput: '7.4 kW @ 32A Single Phase 230V',
      Connector: 'IEC 62196-2 Type-2 Gun (5-Metre TPE Cable)',
      Protection: 'Type-B RCD (AC 30mA + DC 6mA) & Over-Voltage Protection',
      AppControl: 'Scheduled Charging during low Discom tariff hours',
    },
    installationDifficulty: 'professional_required',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-ev-02',
    name: 'EcoPlug 16A 3-Pin Portable Emergency EV Charging Cable (3.3 kW)',
    brand: 'EcoPlug Systems',
    category: 'ev_accessories',
    shortDescription: 'Portable 16A power cord for emergency charging at home, hotels, or roadside restaurants with standard 16A wall sockets.',
    indicativePriceINR: 12400,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'specific',
    compatibleMakes: ['Tata Motors', 'Mahindra', 'MG', 'Hyundai', 'BYD'],
    compatibleModels: ['Nexon.ev', 'Curvv EV', 'Punch.ev', 'XUV400', 'ZS EV', 'Tiago.ev'],
    specifications: {
      PlugType: 'Standard Indian 16A 3-Pin Power Plug',
      GunType: 'Type-2 Connector (7.5-Metre Length)',
      Display: 'Integrated LCD Screen showing Live kW, Amps & Voltage',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },

  // 7. MAINTENANCE ESSENTIALS
  {
    id: 'acc-mnt-01',
    name: 'Mobil 1 Super 3000 Fully Synthetic 5W-30 Engine Oil (5 Litres)',
    brand: 'Mobil 1',
    category: 'maintenance_essentials',
    shortDescription: 'Advanced low-friction synthetic motor oil meeting API SP and ACEA C3 for modern turbocharged petrol and diesel DPF engines.',
    indicativePriceINR: 3850,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Viscosity: '5W-30 Low SAPS',
      Standards: 'API SP / SN Plus, ACEA C3',
      EngineTypes: 'Turbo-Petrol, CRDi Diesel (DPF Compatible), CNG',
      Volume: '5 Litres Pack (Made in India)',
    },
    installationDifficulty: 'moderate',
    isSampleCatalogData: true,
  },
  {
    id: 'acc-mnt-02',
    name: 'Bosch ClearAdvantage Aerodynamic Frameless Wiper Blades (Pair)',
    brand: 'Bosch Automotive',
    category: 'maintenance_essentials',
    shortDescription: 'Precision beam blade with graphite-coated natural rubber wiping edge for streak-free visibility during heavy monsoon showers.',
    indicativePriceINR: 1350,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    compatibilityType: 'universal',
    specifications: {
      Sizes: 'Custom Lengths available for all Indian car models (e.g. 24" + 18")',
      Rubber: 'Graphite-Treated Natural Rubber for Quiet Wiping',
      Aerodynamics: 'Integrated Wind Spoiler prevents high-speed blade lift',
    },
    installationDifficulty: 'easy_diy',
    isSampleCatalogData: true,
  },
];

class AccessoriesService {
  private getStorageKey(type: string): string {
    return `autosphere_accessories_${type}`;
  }

  /**
   * Retrieves accessories matching optional filters and vehicle compatibility
   */
  async getAccessories(filters?: AccessoryFilterCriteria): Promise<AccessoryItem[]> {
    let list = [...SEED_ACCESSORIES];

    // Read saved accessory IDs from localStorage
    const savedIds = this.getSavedAccessoryIds();
    list = list.map(item => ({
      ...item,
      isSaved: savedIds.includes(item.id),
    }));

    if (!filters) return list;

    return list.filter(item => {
      if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      if (filters.maxPriceINR && item.indicativePriceINR > filters.maxPriceINR) {
        return false;
      }

      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesDesc = item.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }

      if (filters.onlyCompatibleWithGarage && filters.vehicleModel) {
        const isCompat = this.checkCompatibility(item, filters.vehicleMake, filters.vehicleModel).isCompatible;
        if (!isCompat) return false;
      }

      return true;
    });
  }

  /**
   * Evaluates compatibility of an accessory with a specific vehicle
   */
  checkCompatibility(
    accessory: AccessoryItem,
    make?: string,
    model?: string
  ): {
    isCompatible: boolean;
    badgeText: string;
    badgeVariant: 'success' | 'info' | 'warning';
  } {
    if (accessory.compatibilityType === 'universal') {
      return {
        isCompatible: true,
        badgeText: 'Universal Fitment',
        badgeVariant: 'info',
      };
    }

    if (!make && !model) {
      return {
        isCompatible: false,
        badgeText: 'Check Vehicle Fitment',
        badgeVariant: 'warning',
      };
    }

    const matchedMake = make && accessory.compatibleMakes?.some(m => m.toLowerCase() === make.toLowerCase());
    const matchedModel = model && accessory.compatibleModels?.some(m => m.toLowerCase().includes(model.toLowerCase()) || model.toLowerCase().includes(m.toLowerCase()));

    if (matchedModel || (matchedMake && !accessory.compatibleModels?.length)) {
      return {
        isCompatible: true,
        badgeText: `Compatible with ${model || make}`,
        badgeVariant: 'success',
      };
    }

    return {
      isCompatible: false,
      badgeText: `Fitment Unverified for ${model || make}`,
      badgeVariant: 'warning',
    };
  }

  // --------------------------------------------------------------------------
  // WISHLIST / SAVED ACCESSORIES
  // --------------------------------------------------------------------------
  getSavedAccessoryIds(): string[] {
    try {
      const local = localStorage.getItem(this.getStorageKey('saved'));
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  toggleSaveAccessory(accessoryId: string): boolean {
    try {
      const saved = this.getSavedAccessoryIds();
      const exists = saved.includes(accessoryId);
      let updated: string[];

      if (exists) {
        updated = saved.filter(id => id !== accessoryId);
      } else {
        updated = [...saved, accessoryId];
      }

      localStorage.setItem(this.getStorageKey('saved'), JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  }
}

export const accessoriesService = new AccessoriesService();
