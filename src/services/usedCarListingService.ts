// src/services/usedCarListingService.ts
// Service for Used Car Listings, Filter Engine & Safe Buyer-Seller Enquiries

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  UsedCarListing,
  ListingFilterCriteria,
  UsedCarEnquiry,
  ListingStatus,
} from '../types/buysell.types';
import { usedCarPriceService } from './usedCarPriceService';

// Realistic sample listings covering Indian passenger vehicle segments
export const SEED_USED_CAR_LISTINGS: UsedCarListing[] = [
  {
    id: 'listing-xuv700-01',
    userId: 'user-seller-01',
    title: '2023 Mahindra XUV700 AX7L Diesel AT AWD (Sunroof & ADAS)',
    make: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 Luxury Pack AWD',
    manufacturingYear: 2023,
    registrationYear: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    odometerKm: 28400,
    city: 'Bengaluru',
    state: 'Karnataka',
    rtoCode: 'KA-03',
    regNumberMasked: 'KA 03 ** 8920',
    ownershipCount: 1,
    vehicleCondition: 'excellent',
    askingPriceINR: 2190000,
    suggestedPriceINR: 2230000,
    description: 'Single-owner, chauffeur-driven AX7L in Midnight Black. Complete service history maintained exclusively at Sireesh Auto. Nil-Depreciation comprehensive insurance active till August 2027. PPF protection applied on front fascia and ORVMs.',
    features: ['Panoramic Sunroof', 'Level 2 ADAS', 'Wireless Apple CarPlay & Android Auto', 'Sony 3D 12-Speaker Audio', 'Ventilated Seats', 'Electronic Parking Brake', '360-Degree Camera'],
    photos: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    isVerified: true,
    serviceHistoryAvailable: true,
    insuranceValidity: '2027-08-15',
    pucValidity: '2026-10-10',
    sellerName: 'Vikram S.',
    sellerType: 'AutoSphere Verified Direct',
    createdAt: '2026-11-10T09:30:00Z',
    updatedAt: '2026-11-20T14:15:00Z',
  },
  {
    id: 'listing-creta-02',
    userId: 'user-seller-02',
    title: '2022 Hyundai Creta SX (O) 1.5 Turbo Petrol 7-DCT',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) Turbo DCT',
    manufacturingYear: 2022,
    registrationYear: 2022,
    fuelType: 'petrol',
    transmission: 'automatic',
    odometerKm: 34200,
    city: 'Mumbai',
    state: 'Maharashtra',
    rtoCode: 'MH-02',
    regNumberMasked: 'MH 02 ** 4412',
    ownershipCount: 1,
    vehicleCondition: 'very_good',
    askingPriceINR: 1475000,
    suggestedPriceINR: 1490000,
    description: 'Well-maintained Creta Turbo in Polar White with Black roof. Driven mostly on Mumbai-Pune Expressway. 4 new Michelin Primacy 4ST tyres installed 4,000 km ago. Zero accidental record, all original paint panels.',
    features: ['Panoramic Sunroof', 'Bose Premium 8-Speaker Audio', 'Paddle Shifters', 'Air Purifier AQI Display', 'Auto Hold & EPB', 'Leatherette Upholstery'],
    photos: [
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    isVerified: true,
    serviceHistoryAvailable: true,
    insuranceValidity: '2027-03-22',
    pucValidity: '2026-09-18',
    sellerName: 'Aditya K.',
    sellerType: 'Certified Individual Owner',
    createdAt: '2026-11-14T11:00:00Z',
    updatedAt: '2026-11-14T11:00:00Z',
  },
  {
    id: 'listing-swift-03',
    userId: 'user-seller-03',
    title: '2024 Maruti Suzuki Swift ZXi 1.2L DualJet MT (24 km/l)',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXi Manual',
    manufacturingYear: 2024,
    registrationYear: 2024,
    fuelType: 'petrol',
    transmission: 'manual',
    odometerKm: 14500,
    city: 'Delhi',
    state: 'Delhi',
    rtoCode: 'DL-04',
    regNumberMasked: 'DL 04 ** 1928',
    ownershipCount: 1,
    vehicleCondition: 'excellent',
    askingPriceINR: 760000,
    suggestedPriceINR: 775000,
    description: 'Practically brand new Swift ZXi. Superb 24+ km/l real-world city efficiency. Relocating abroad, looking for a quick, genuine direct-to-consumer transfer. First free service and second service completed on time.',
    features: ['SmartPlay Pro+ 9-inch Touchscreen', 'Wireless Charger', 'Rear AC Vents', '6 Airbags Standard', 'Push Button Start/Stop'],
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    isVerified: true,
    serviceHistoryAvailable: true,
    insuranceValidity: '2027-06-30',
    pucValidity: '2026-12-05',
    sellerName: 'Rohit M.',
    sellerType: 'AutoSphere Verified Direct',
    createdAt: '2026-11-18T16:20:00Z',
    updatedAt: '2026-11-18T16:20:00Z',
  },
  {
    id: 'listing-nexonev-04',
    userId: 'user-seller-04',
    title: '2023 Tata Nexon.ev Max XZ+ Lux 40.5 kWh (320 km Range)',
    make: 'Tata Motors',
    model: 'Nexon.ev',
    variant: 'Max XZ+ Lux',
    manufacturingYear: 2023,
    registrationYear: 2023,
    fuelType: 'electric',
    transmission: 'automatic',
    odometerKm: 26800,
    city: 'Pune',
    state: 'Maharashtra',
    rtoCode: 'MH-12',
    regNumberMasked: 'MH 12 ** 7789',
    ownershipCount: 1,
    vehicleCondition: 'excellent',
    askingPriceINR: 1395000,
    suggestedPriceINR: 1420000,
    description: 'Intensa-Teal Nexon.ev Max. Battery health tested at 98.2% State of Health (SOH) by Tata Motors authorized workshop. Includes 7.2 kW home fast charger and portable emergency cable. 8-year OEM battery warranty active till 2031.',
    features: ['40.5 kWh LFP Battery', 'Ventilated Front Seats', 'Auto Dimming IRVM', 'Multi-Mode Regenerative Braking', 'All 4 Disc Brakes', 'Electronic Parking Brake'],
    photos: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    isVerified: true,
    serviceHistoryAvailable: true,
    insuranceValidity: '2027-05-18',
    pucValidity: 'Exempted (Electric)',
    sellerName: 'Siddharth P.',
    sellerType: 'AutoSphere Verified Direct',
    createdAt: '2026-11-19T08:45:00Z',
    updatedAt: '2026-11-19T08:45:00Z',
  },
  {
    id: 'listing-innova-05',
    userId: 'user-seller-05',
    title: '2021 Toyota Innova Crysta 2.4 VX 7-Seater Diesel MT',
    make: 'Toyota',
    model: 'Innova Crysta',
    variant: '2.4 VX 7-Str',
    manufacturingYear: 2021,
    registrationYear: 2021,
    fuelType: 'diesel',
    transmission: 'manual',
    odometerKm: 62000,
    city: 'Hyderabad',
    state: 'Telangana',
    rtoCode: 'TS-09',
    regNumberMasked: 'TS 09 ** 3311',
    ownershipCount: 1,
    vehicleCondition: 'very_good',
    askingPriceINR: 1980000,
    suggestedPriceINR: 2020000,
    description: 'Legendary bulletproof 2.4L GD diesel engine. Unmatched highway reliability and long-distance comfort. Full maintenance record at Harsha Toyota Hyderabad. All 4 brake pads and coolant replaced recently.',
    features: ['7-Seater Captain Seats', 'LED Projector Headlamps', 'Touchscreen with Android Auto', 'Hill Start Assist', 'Automatic Climate Control'],
    photos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    isVerified: true,
    serviceHistoryAvailable: true,
    insuranceValidity: '2027-01-10',
    pucValidity: '2026-08-20',
    sellerName: 'Rajesh V.',
    sellerType: 'Certified Individual Owner',
    createdAt: '2026-11-12T10:15:00Z',
    updatedAt: '2026-11-12T10:15:00Z',
  },
  {
    id: 'listing-city-06',
    userId: 'user-seller-06',
    title: '2020 Honda City 1.5 i-VTEC ZX CVT Sunroof',
    make: 'Honda',
    model: 'City',
    variant: 'ZX CVT',
    manufacturingYear: 2020,
    registrationYear: 2020,
    fuelType: 'petrol',
    transmission: 'automatic',
    odometerKm: 48500,
    city: 'Chennai',
    state: 'Tamil Nadu',
    rtoCode: 'TN-07',
    regNumberMasked: 'TN 07 ** 6543',
    ownershipCount: 2,
    vehicleCondition: 'good',
    askingPriceINR: 980000,
    suggestedPriceINR: 995000,
    description: 'Golden Brown Honda City top-end ZX. Butter smooth 1.5L naturally aspirated VTEC engine. Ideal executive city sedan. Clean interiors, non-smoker car.',
    features: ['Electric Sunroof', 'Full LED Headlamps', 'LaneWatch Blindspot Camera', '6 Airbags', 'Leather Upholstery', 'Paddle Shifters'],
    photos: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'active',
    isVerified: false,
    serviceHistoryAvailable: true,
    insuranceValidity: '2026-12-14',
    pucValidity: '2026-07-28',
    sellerName: 'Karthik N.',
    sellerType: 'Certified Individual Owner',
    createdAt: '2026-11-05T13:40:00Z',
    updatedAt: '2026-11-05T13:40:00Z',
  },
];

class UsedCarListingService {
  private getStorageKey(type: string, id = 'all'): string {
    return `autosphere_${type}_${id}`;
  }

  /**
   * Retrieves used car listings with multi-factor filters
   */
  async getListings(filters?: ListingFilterCriteria): Promise<UsedCarListing[]> {
    let listings = [...SEED_USED_CAR_LISTINGS];

    // Read stored user-created listings from localStorage
    try {
      const local = localStorage.getItem(this.getStorageKey('user_listings'));
      if (local) {
        const userListings: UsedCarListing[] = JSON.parse(local);
        listings = [...userListings, ...listings];
      }
    } catch {}

    // Supabase query if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('used_car_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          const dbListings: UsedCarListing[] = data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            title: d.title,
            make: d.make,
            model: d.model,
            variant: d.variant || '',
            manufacturingYear: d.manufacturing_year,
            registrationYear: d.registration_year,
            fuelType: d.fuel_type,
            transmission: d.transmission,
            odometerKm: d.odometer_km,
            city: d.city,
            state: d.state,
            rtoCode: d.rto_code,
            regNumberMasked: d.reg_number_masked,
            ownershipCount: d.ownership_count,
            vehicleCondition: d.vehicle_condition,
            askingPriceINR: Number(d.asking_price_inr),
            suggestedPriceINR: d.suggested_price_inr ? Number(d.suggested_price_inr) : undefined,
            description: d.description || '',
            features: d.features || [],
            photos: d.photos && d.photos.length > 0 ? d.photos : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
            status: d.status,
            isVerified: d.is_verified,
            serviceHistoryAvailable: d.service_history_available,
            insuranceValidity: d.insurance_validity,
            pucValidity: d.puc_validity,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));

          listings = [...dbListings, ...listings.filter(l => !dbListings.some(db => db.id === l.id))];
        }
      } catch (err) {
        console.warn('Could not query Supabase used_car_listings:', err);
      }
    }

    // Attach algorithmic fair-price estimate to each listing
    listings = listings.map(listing => {
      if (!listing.priceEstimate) {
        listing.priceEstimate = usedCarPriceService.estimatePrice({
          make: listing.make,
          model: listing.model,
          variant: listing.variant,
          year: listing.manufacturingYear,
          fuelType: listing.fuelType,
          transmission: listing.transmission,
          odometerKm: listing.odometerKm,
          ownershipCount: listing.ownershipCount,
          condition: listing.vehicleCondition,
          city: listing.city,
          askingPriceINR: listing.askingPriceINR,
        });
      }
      return listing;
    });

    // Apply Filter Criteria
    if (!filters) return listings;

    return listings.filter(item => {
      if (item.status !== 'active') return false;

      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMake = item.make.toLowerCase().includes(q);
        const matchesModel = item.model.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMake && !matchesModel && !matchesCity) return false;
      }

      if (filters.make && filters.make !== 'all' && item.make.toLowerCase() !== filters.make.toLowerCase()) {
        return false;
      }

      if (filters.fuelType && filters.fuelType !== 'all' && item.fuelType !== filters.fuelType) {
        return false;
      }

      if (filters.transmission && filters.transmission !== 'all' && item.transmission !== filters.transmission) {
        return false;
      }

      if (filters.city && filters.city !== 'all' && item.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      if (filters.minPriceINR !== undefined && item.askingPriceINR < filters.minPriceINR) {
        return false;
      }

      if (filters.maxPriceINR !== undefined && item.askingPriceINR > filters.maxPriceINR) {
        return false;
      }

      if (filters.minYear !== undefined && item.manufacturingYear < filters.minYear) {
        return false;
      }

      if (filters.maxOdometerKm !== undefined && item.odometerKm > filters.maxOdometerKm) {
        return false;
      }

      if (filters.condition && filters.condition !== 'all' && item.vehicleCondition !== filters.condition) {
        return false;
      }

      if (filters.verifiedOnly && !item.isVerified) {
        return false;
      }

      return true;
    });
  }

  /**
   * Retrieves listings created by a specific authenticated user
   */
  async getMyListings(userId: string): Promise<UsedCarListing[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('used_car_listings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (data && !error) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            title: d.title,
            make: d.make,
            model: d.model,
            variant: d.variant || '',
            manufacturingYear: d.manufacturing_year,
            registrationYear: d.registration_year,
            fuelType: d.fuel_type,
            transmission: d.transmission,
            odometerKm: d.odometer_km,
            city: d.city,
            state: d.state,
            rtoCode: d.rto_code,
            regNumberMasked: d.reg_number_masked,
            ownershipCount: d.ownership_count,
            vehicleCondition: d.vehicle_condition,
            askingPriceINR: Number(d.asking_price_inr),
            suggestedPriceINR: d.suggested_price_inr ? Number(d.suggested_price_inr) : undefined,
            description: d.description || '',
            features: d.features || [],
            photos: d.photos || [],
            status: d.status,
            isVerified: d.is_verified,
            serviceHistoryAvailable: d.service_history_available,
            insuranceValidity: d.insurance_validity,
            pucValidity: d.puc_validity,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Could not query my listings from Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('user_listings'));
      if (local) {
        const list: UsedCarListing[] = JSON.parse(local);
        return list.filter(l => l.userId === userId);
      }
    } catch {}

    return [];
  }

  /**
   * Creates a new user listing with automated fair-price intelligence
   */
  async createListing(
    listingData: Omit<UsedCarListing, 'id' | 'createdAt' | 'updatedAt' | 'priceEstimate'>
  ): Promise<UsedCarListing> {
    const id = `listing-usr-${Date.now()}`;
    const now = new Date().toISOString();

    const priceEstimate = usedCarPriceService.estimatePrice({
      make: listingData.make,
      model: listingData.model,
      variant: listingData.variant,
      year: listingData.manufacturingYear,
      fuelType: listingData.fuelType,
      transmission: listingData.transmission,
      odometerKm: listingData.odometerKm,
      ownershipCount: listingData.ownershipCount,
      condition: listingData.vehicleCondition,
      city: listingData.city,
      askingPriceINR: listingData.askingPriceINR,
    });

    const newListing: UsedCarListing = {
      ...listingData,
      id,
      suggestedPriceINR: priceEstimate.recommendedAskingPriceINR,
      priceEstimate,
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('used_car_listings').insert({
          user_id: listingData.userId,
          title: listingData.title,
          make: listingData.make,
          model: listingData.model,
          variant: listingData.variant,
          manufacturing_year: listingData.manufacturingYear,
          registration_year: listingData.registrationYear,
          fuel_type: listingData.fuelType,
          transmission: listingData.transmission,
          odometer_km: listingData.odometerKm,
          city: listingData.city,
          state: listingData.state,
          rto_code: listingData.rtoCode,
          reg_number_masked: listingData.regNumberMasked,
          ownership_count: listingData.ownershipCount,
          vehicle_condition: listingData.vehicleCondition,
          asking_price_inr: listingData.askingPriceINR,
          suggested_price_inr: priceEstimate.recommendedAskingPriceINR,
          price_confidence: priceEstimate.confidenceLevel,
          description: listingData.description,
          features: listingData.features,
          photos: listingData.photos,
          status: listingData.status,
          is_verified: listingData.isVerified,
          service_history_available: listingData.serviceHistoryAvailable,
          insurance_validity: listingData.insuranceValidity,
          puc_validity: listingData.pucValidity,
        }).select().single();

        if (data && !error) {
          newListing.id = data.id;
        }
      } catch (err) {
        console.warn('Could not insert listing into Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('user_listings'));
      const list: UsedCarListing[] = local ? JSON.parse(local) : [];
      list.unshift(newListing);
      localStorage.setItem(this.getStorageKey('user_listings'), JSON.stringify(list));
    } catch {}

    return newListing;
  }

  /**
   * Updates an existing listing status (active, paused, sold)
   */
  async updateListingStatus(listingId: string, status: ListingStatus): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('used_car_listings')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', listingId);
      } catch (err) {
        console.warn('Failed to update listing status in Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('user_listings'));
      if (local) {
        const list: UsedCarListing[] = JSON.parse(local);
        const item = list.find(l => l.id === listingId);
        if (item) {
          item.status = status;
          item.updatedAt = new Date().toISOString();
          localStorage.setItem(this.getStorageKey('user_listings'), JSON.stringify(list));
        }
      }
    } catch {}
  }

  /**
   * Deletes a user listing
   */
  async deleteListing(listingId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('used_car_listings').delete().eq('id', listingId);
      } catch (err) {
        console.warn('Failed to delete listing in Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('user_listings'));
      if (local) {
        const list: UsedCarListing[] = JSON.parse(local);
        const filtered = list.filter(l => l.id !== listingId);
        localStorage.setItem(this.getStorageKey('user_listings'), JSON.stringify(filtered));
      }
    } catch {}
  }

  // --------------------------------------------------------------------------
  // SAFE BUYER-SELLER ENQUIRY SYSTEM
  // --------------------------------------------------------------------------
  async sendEnquiry(params: {
    listingId: string;
    listingTitle: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    message: string;
    offeredPriceINR?: number;
  }): Promise<UsedCarEnquiry> {
    const enquiry: UsedCarEnquiry = {
      id: `enq-${Date.now()}`,
      listingId: params.listingId,
      listingTitle: params.listingTitle,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      sellerId: params.sellerId,
      message: params.message,
      offeredPriceINR: params.offeredPriceINR,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('used_car_enquiries').insert({
          listing_id: params.listingId,
          buyer_id: params.buyerId,
          buyer_name: params.buyerName,
          seller_id: params.sellerId,
          message: params.message,
          offered_price_inr: params.offeredPriceINR,
          status: 'pending',
        }).select().single();

        if (data && !error) {
          enquiry.id = data.id;
        }
      } catch (err) {
        console.warn('Could not insert enquiry into Supabase:', err);
      }
    }

    try {
      const key = this.getStorageKey('enquiries');
      const local = localStorage.getItem(key);
      const list: UsedCarEnquiry[] = local ? JSON.parse(local) : [];
      list.unshift(enquiry);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}

    return enquiry;
  }

  async getMyReceivedEnquiries(sellerId: string): Promise<UsedCarEnquiry[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('used_car_enquiries')
          .select('*, used_car_listings(title, asking_price_inr, photos)')
          .eq('seller_id', sellerId)
          .order('created_at', { ascending: false });

        if (data && !error) {
          return data.map((d: any) => ({
            id: d.id,
            listingId: d.listing_id,
            listingTitle: d.used_car_listings?.title || 'Vehicle Listing',
            askingPriceINR: d.used_car_listings?.asking_price_inr,
            buyerId: d.buyer_id,
            buyerName: d.buyer_name,
            sellerId: d.seller_id,
            message: d.message,
            offeredPriceINR: d.offered_price_inr ? Number(d.offered_price_inr) : undefined,
            status: d.status,
            sellerResponse: d.seller_response,
            respondedAt: d.responded_at,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Could not query received enquiries from Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('enquiries'));
      if (local) {
        const list: UsedCarEnquiry[] = JSON.parse(local);
        return list.filter(e => e.sellerId === sellerId);
      }
    } catch {}

    // Fallback sample received enquiries for demonstration
    return [
      {
        id: 'enq-demo-01',
        listingId: 'listing-xuv700-01',
        listingTitle: '2023 Mahindra XUV700 AX7L Diesel AT AWD',
        askingPriceINR: 2190000,
        buyerId: 'buyer-demo-01',
        buyerName: 'Kunal R. (Bengaluru)',
        sellerId,
        message: 'Hello, is the PPF warranty transferable? Would you consider ₹21,25,000 for an immediate direct transfer with zero bank loan?',
        offeredPriceINR: 2125000,
        status: 'pending',
        createdAt: '2026-11-21T10:15:00Z',
      },
    ];
  }

  async getMySentEnquiries(buyerId: string): Promise<UsedCarEnquiry[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('used_car_enquiries')
          .select('*, used_car_listings(title, asking_price_inr)')
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false });

        if (data && !error) {
          return data.map((d: any) => ({
            id: d.id,
            listingId: d.listing_id,
            listingTitle: d.used_car_listings?.title,
            askingPriceINR: d.used_car_listings?.asking_price_inr,
            buyerId: d.buyer_id,
            buyerName: d.buyer_name,
            sellerId: d.seller_id,
            message: d.message,
            offeredPriceINR: d.offered_price_inr ? Number(d.offered_price_inr) : undefined,
            status: d.status,
            sellerResponse: d.seller_response,
            respondedAt: d.responded_at,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Could not query sent enquiries from Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('enquiries'));
      if (local) {
        const list: UsedCarEnquiry[] = JSON.parse(local);
        return list.filter(e => e.buyerId === buyerId);
      }
    } catch {}

    return [];
  }

  async respondToEnquiry(enquiryId: string, responseText: string): Promise<void> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('used_car_enquiries')
          .update({
            status: 'responded',
            seller_response: responseText,
            responded_at: now,
          })
          .eq('id', enquiryId);
      } catch (err) {
        console.warn('Failed to respond to enquiry in Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('enquiries'));
      if (local) {
        const list: UsedCarEnquiry[] = JSON.parse(local);
        const item = list.find(e => e.id === enquiryId);
        if (item) {
          item.status = 'responded';
          item.sellerResponse = responseText;
          item.respondedAt = now;
          localStorage.setItem(this.getStorageKey('enquiries'), JSON.stringify(list));
        }
      }
    } catch {}
  }

  async resolveEnquiry(enquiryId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('used_car_enquiries')
          .update({ status: 'resolved' })
          .eq('id', enquiryId);
      } catch (err) {
        console.warn('Failed to resolve enquiry in Supabase:', err);
      }
    }

    try {
      const local = localStorage.getItem(this.getStorageKey('enquiries'));
      if (local) {
        const list: UsedCarEnquiry[] = JSON.parse(local);
        const item = list.find(e => e.id === enquiryId);
        if (item) {
          item.status = 'resolved';
          localStorage.setItem(this.getStorageKey('enquiries'), JSON.stringify(list));
        }
      }
    } catch {}
  }
}

export const usedCarListingService = new UsedCarListingService();
