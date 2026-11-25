import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Manufacturer,
  CarModel,
  CarVariant,
  EnrichedCarVariant,
  IndianState,
  IndianCity,
  StateRtoRule,
  FuelPricing,
  EvChargingTariff,
} from '../types/automotive.types';
import { INDIAN_MANUFACTURERS } from '../data/manufacturersData';
import { INDIAN_CAR_MODELS } from '../data/modelsData';
import { INDIAN_CAR_VARIANTS } from '../data/variantsData';
import { ALL_INDIAN_STATES, ALL_INDIAN_CITIES } from '../data/locationsData';
import { STATE_RTO_RULES } from '../data/stateRtoRulesData';
import { STATE_FUEL_PRICES, STATE_EV_TARIFFS } from '../data/fuelTariffsData';

class AutomotiveService {
  // 1. Manufacturers
  async getManufacturers(): Promise<Manufacturer[]> {
    if (!isSupabaseConfigured) {
      return INDIAN_MANUFACTURERS;
    }
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error || !data || data.length === 0) return INDIAN_MANUFACTURERS;

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        country: d.country,
        yearEstablishedIndia: d.year_established_india,
        headquartersIndia: d.headquarters_india,
        logoUrl: d.logo_url,
        websiteUrl: d.website_url,
        supportPhone: d.support_phone,
        marketSharePercent: d.market_share_percent,
        isActive: d.is_active,
      }));
    } catch {
      return INDIAN_MANUFACTURERS;
    }
  }

  // 2. Car Models
  async getModels(manufacturerId?: string): Promise<CarModel[]> {
    if (!isSupabaseConfigured) {
      if (!manufacturerId) return INDIAN_CAR_MODELS;
      return INDIAN_CAR_MODELS.filter(m => m.manufacturerId === manufacturerId);
    }
    try {
      let query = supabase.from('car_models').select('*').eq('is_active', true);
      if (manufacturerId) {
        query = query.eq('manufacturer_id', manufacturerId);
      }
      const { data, error } = await query.order('name');
      if (error || !data || data.length === 0) {
        return manufacturerId
          ? INDIAN_CAR_MODELS.filter(m => m.manufacturerId === manufacturerId)
          : INDIAN_CAR_MODELS;
      }

      return data.map((d: any) => ({
        id: d.id,
        manufacturerId: d.manufacturer_id,
        name: d.name,
        slug: d.slug,
        category: d.category,
        launchYear: d.launch_year,
        marketStatus: d.market_status,
        availableFuelTypes: d.available_fuel_types,
        availableTransmissions: d.available_transmissions,
        imageUrl: d.image_url,
        description: d.description,
        safetyRating: d.safety_rating,
        isActive: d.is_active,
      }));
    } catch {
      return manufacturerId
        ? INDIAN_CAR_MODELS.filter(m => m.manufacturerId === manufacturerId)
        : INDIAN_CAR_MODELS;
    }
  }

  // 3. Car Variants
  async getVariants(modelId?: string): Promise<CarVariant[]> {
    if (!isSupabaseConfigured) {
      if (!modelId) return INDIAN_CAR_VARIANTS;
      return INDIAN_CAR_VARIANTS.filter(v => v.modelId === modelId);
    }
    try {
      let query = supabase.from('car_variants').select('*').eq('is_active', true);
      if (modelId) {
        query = query.eq('model_id', modelId);
      }
      const { data, error } = await query.order('ex_showroom_price');
      if (error || !data || data.length === 0) {
        return modelId
          ? INDIAN_CAR_VARIANTS.filter(v => v.modelId === modelId)
          : INDIAN_CAR_VARIANTS;
      }

      return data.map((d: any) => ({
        id: d.id,
        modelId: d.model_id,
        name: d.name,
        fuelType: d.fuel_type,
        transmission: d.transmission,
        engineCapacityCc: d.engine_capacity_cc,
        batteryCapacityKwh: d.battery_capacity_kwh,
        powerBhp: Number(d.power_bhp),
        torqueNm: Number(d.torque_nm),
        mileageOrRange: Number(d.mileage_or_range),
        mileageUnit: d.mileage_unit,
        seatingCapacity: d.seating_capacity,
        exShowroomPriceINR: Number(d.ex_showroom_price),
        annualMaintenanceEstimateINR: Number(d.annual_maintenance_estimate),
        annualInsuranceEstimateINR: Number(d.annual_insurance_estimate),
        groundClearanceMm: d.ground_clearance_mm,
        bootCapacityLitres: d.boot_capacity_litres,
        fuelTankCapacityLitres: d.fuel_tank_capacity_litres,
        isActive: d.is_active,
      }));
    } catch {
      return modelId
        ? INDIAN_CAR_VARIANTS.filter(v => v.modelId === modelId)
        : INDIAN_CAR_VARIANTS;
    }
  }

  // Get full enriched variant (including Model & Manufacturer details)
  async getEnrichedVariants(): Promise<EnrichedCarVariant[]> {
    const [manufacturers, models, variants] = await Promise.all([
      this.getManufacturers(),
      this.getModels(),
      this.getVariants(),
    ]);

    const mfrMap = new Map(manufacturers.map(m => [m.id, m]));
    const modelMap = new Map(models.map(m => [m.id, m]));

    return variants.map(variant => {
      const model = modelMap.get(variant.modelId) || {
        id: variant.modelId,
        manufacturerId: 'unknown',
        name: 'Automotive Model',
        slug: 'automotive-model',
        category: 'suv',
        launchYear: 2024,
        marketStatus: 'active',
        availableFuelTypes: [variant.fuelType],
        availableTransmissions: [variant.transmission],
        imageUrl: '',
        description: 'Indian passenger automobile specification.',
        isActive: true,
      };

      const manufacturer = mfrMap.get(model.manufacturerId) || {
        id: model.manufacturerId,
        name: 'Indian OEM',
        slug: 'oem',
        country: 'India',
        yearEstablishedIndia: 2000,
        headquartersIndia: 'India',
        isActive: true,
      };

      return {
        ...variant,
        model,
        manufacturer,
      };
    });
  }

  // 4. Locations
  async getStates(): Promise<IndianState[]> {
    if (!isSupabaseConfigured) return ALL_INDIAN_STATES;
    try {
      const { data, error } = await supabase.from('indian_states').select('*').eq('is_active', true).order('name');
      if (error || !data || data.length === 0) return ALL_INDIAN_STATES;
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        capital: d.capital,
        rtoCodePrefix: d.rto_code_prefix,
        gstStateCode: d.gst_state_code,
        isActive: d.is_active,
      }));
    } catch {
      return ALL_INDIAN_STATES;
    }
  }

  async getCities(stateId?: string): Promise<IndianCity[]> {
    if (!isSupabaseConfigured) {
      if (!stateId) return ALL_INDIAN_CITIES;
      return ALL_INDIAN_CITIES.filter(c => c.stateId.toUpperCase() === stateId.toUpperCase());
    }
    try {
      let query = supabase.from('indian_cities').select('*').eq('is_active', true);
      if (stateId) query = query.eq('state_id', stateId.toUpperCase());
      const { data, error } = await query.order('name');
      if (error || !data || data.length === 0) {
        return stateId
          ? ALL_INDIAN_CITIES.filter(c => c.stateId.toUpperCase() === stateId.toUpperCase())
          : ALL_INDIAN_CITIES;
      }
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        stateId: d.state_id,
        tier: d.tier,
        rtoCodes: d.rto_codes,
        isMetro: d.is_metro,
        municipalParkingTaxINR: Number(d.municipal_parking_tax),
        localCessPercent: Number(d.local_cess_percent),
        isActive: d.is_active,
      }));
    } catch {
      return stateId
        ? ALL_INDIAN_CITIES.filter(c => c.stateId.toUpperCase() === stateId.toUpperCase())
        : ALL_INDIAN_CITIES;
    }
  }

  // 5. State RTO Rules
  async getStateRtoRules(stateId?: string): Promise<StateRtoRule[]> {
    if (!isSupabaseConfigured) {
      if (!stateId) return STATE_RTO_RULES;
      return STATE_RTO_RULES.filter(r => r.stateId.toUpperCase() === stateId.toUpperCase());
    }
    try {
      let query = supabase.from('state_rto_rules').select('*');
      if (stateId) query = query.eq('state_id', stateId.toUpperCase());
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return stateId
          ? STATE_RTO_RULES.filter(r => r.stateId.toUpperCase() === stateId.toUpperCase())
          : STATE_RTO_RULES;
      }
      return data.map((d: any) => ({
        id: d.id,
        stateId: d.state_id,
        fuelType: d.fuel_type,
        priceMinINR: Number(d.price_min),
        priceMaxINR: Number(d.price_max),
        taxPercent: Number(d.tax_percent),
        fixedCessINR: Number(d.fixed_cess),
        greenCessINR: Number(d.green_cess),
        specialNotes: d.special_notes,
        effectiveYear: d.effective_year,
      }));
    } catch {
      return stateId
        ? STATE_RTO_RULES.filter(r => r.stateId.toUpperCase() === stateId.toUpperCase())
        : STATE_RTO_RULES;
    }
  }

  // 6. Fuel and EV Tariffs
  async getFuelPrices(): Promise<FuelPricing[]> {
    return STATE_FUEL_PRICES;
  }

  async getEvTariffs(): Promise<EvChargingTariff[]> {
    return STATE_EV_TARIFFS;
  }
}

export const automotiveService = new AutomotiveService();
