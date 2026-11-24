export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          city: string | null
          state: string | null
          avatar_url: string | null
          fastag_wallet_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          phone?: string | null
          city?: string | null
          state?: string | null
          avatar_url?: string | null
          fastag_wallet_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          city?: string | null
          state?: string | null
          avatar_url?: string | null
          fastag_wallet_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          variant: string
          manufacturing_year: number
          registration_year: number
          registration_number: string
          vin: string | null
          fuel_type: string
          transmission: string
          body_type: string
          current_odometer: number
          purchase_price: number | null
          purchase_date: string | null
          registration_state: string
          registration_city: string
          engine_cc: number | null
          battery_capacity_kwh: number | null
          power_bhp: number | null
          torque_nm: number | null
          current_fuel_percent: number | null
          battery_health_percent: number | null
          estimated_range_km: number | null
          avg_efficiency: string | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          insurance_expiry_date: string | null
          puc_expiry_date: string | null
          last_service_date: string | null
          last_service_km: number | null
          next_service_due_date: string | null
          next_service_due_km: number | null
          health_score: number
          is_primary: boolean
          image_url: string | null
          connected_car_platform: string | null
          connected_status: string | null
          tyre_pressure_front_left: number | null
          tyre_pressure_front_right: number | null
          tyre_pressure_rear_left: number | null
          tyre_pressure_rear_right: number | null
          tyre_pressure_spare: number | null
          engine_number?: string | null
          rto_code?: string | null
          previous_owners_count?: number
          color?: string
          notes?: string
          photos?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          make: string
          model: string
          variant: string
          manufacturing_year: number
          registration_year: number
          registration_number: string
          vin?: string | null
          fuel_type: string
          transmission: string
          body_type?: string
          current_odometer?: number
          purchase_price?: number | null
          purchase_date?: string | null
          registration_state: string
          registration_city: string
          engine_cc?: number | null
          battery_capacity_kwh?: number | null
          power_bhp?: number | null
          torque_nm?: number | null
          current_fuel_percent?: number | null
          battery_health_percent?: number | null
          estimated_range_km?: number | null
          avg_efficiency?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          insurance_expiry_date?: string | null
          puc_expiry_date?: string | null
          last_service_date?: string | null
          last_service_km?: number | null
          next_service_due_date?: string | null
          next_service_due_km?: number | null
          health_score?: number
          is_primary?: boolean
          image_url?: string | null
          connected_car_platform?: string | null
          connected_status?: string | null
          tyre_pressure_front_left?: number | null
          tyre_pressure_front_right?: number | null
          tyre_pressure_rear_left?: number | null
          tyre_pressure_rear_right?: number | null
          tyre_pressure_spare?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          make?: string
          model?: string
          variant?: string
          manufacturing_year?: number
          registration_year?: number
          registration_number?: string
          vin?: string | null
          fuel_type?: string
          transmission?: string
          body_type?: string
          current_odometer?: number
          purchase_price?: number | null
          purchase_date?: string | null
          registration_state?: string
          registration_city?: string
          engine_cc?: number | null
          battery_capacity_kwh?: number | null
          power_bhp?: number | null
          torque_nm?: number | null
          current_fuel_percent?: number | null
          battery_health_percent?: number | null
          estimated_range_km?: number | null
          avg_efficiency?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          insurance_expiry_date?: string | null
          puc_expiry_date?: string | null
          last_service_date?: string | null
          last_service_km?: number | null
          next_service_due_date?: string | null
          next_service_due_km?: number | null
          health_score?: number
          is_primary?: boolean
          image_url?: string | null
          connected_car_platform?: string | null
          connected_status?: string | null
          tyre_pressure_front_left?: number | null
          tyre_pressure_front_right?: number | null
          tyre_pressure_rear_left?: number | null
          tyre_pressure_rear_right?: number | null
          tyre_pressure_spare?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_expenses: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          category: string
          amount_inr: number
          expense_date: string
          odometer_km: number | null
          vendor: string
          notes: string | null
          payment_method: string
          receipt_attached: boolean
          fuel_litres_or_units: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          category: string
          amount_inr: number
          expense_date?: string
          odometer_km?: number | null
          vendor?: string
          notes?: string | null
          payment_method?: string
          receipt_attached?: boolean
          fuel_litres_or_units?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          category?: string
          amount_inr?: number
          expense_date?: string
          odometer_km?: number | null
          vendor?: string
          notes?: string | null
          payment_method?: string
          receipt_attached?: boolean
          fuel_litres_or_units?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_records: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          service_type: string
          service_center: string
          service_date: string
          odometer_km: number
          cost_inr: number
          notes: string | null
          invoice_number: string | null
          next_service_due_date: string | null
          next_service_due_km: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          service_type: string
          service_center: string
          service_date?: string
          odometer_km: number
          cost_inr: number
          notes?: string | null
          invoice_number?: string | null
          next_service_due_date?: string | null
          next_service_due_km?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          service_type?: string
          service_center?: string
          service_date?: string
          odometer_km?: number
          cost_inr?: number
          notes?: string | null
          invoice_number?: string | null
          next_service_due_date?: string | null
          next_service_due_km?: number | null
          status?: string
          created_at?: string
        }
      }
      insurance_records: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          provider: string
          policy_number: string
          policy_type: string
          premium_inr: number
          issue_date: string
          expiry_date: string
          idv_inr: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          provider: string
          policy_number: string
          policy_type?: string
          premium_inr: number
          issue_date: string
          expiry_date: string
          idv_inr?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          provider?: string
          policy_number?: string
          policy_type?: string
          premium_inr?: number
          issue_date?: string
          expiry_date?: string
          idv_inr?: number | null
          status?: string
          created_at?: string
        }
      }
      fuel_records: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          fuel_type: string
          litres_or_kwh: number
          price_per_unit_inr: number
          total_cost_inr: number
          odometer_km: number
          fuel_station: string
          is_full_tank: boolean
          logged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          fuel_type: string
          litres_or_kwh: number
          price_per_unit_inr: number
          total_cost_inr: number
          odometer_km: number
          fuel_station?: string
          is_full_tank?: boolean
          logged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          fuel_type?: string
          litres_or_kwh?: number
          price_per_unit_inr?: number
          total_cost_inr?: number
          odometer_km?: number
          fuel_station?: string
          is_full_tank?: boolean
          logged_at?: string
        }
      }
      saved_recommendations: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string | null
          recommended_car_id: string
          make: string
          model: string
          variant: string
          fuel_type: string
          projected_annual_savings_inr: number
          upgrade_score: number
          notes: string | null
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id?: string | null
          recommended_car_id: string
          make: string
          model: string
          variant: string
          fuel_type: string
          projected_annual_savings_inr?: number
          upgrade_score?: number
          notes?: string | null
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string | null
          recommended_car_id?: string
          make?: string
          model?: string
          variant?: string
          fuel_type?: string
          projected_annual_savings_inr?: number
          upgrade_score?: number
          notes?: string | null
          saved_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          default_fuel_type: string
          monthly_average_km: number
          connected_car_sync_enabled: boolean
          alert_service_reminders: boolean
          alert_puc_expiry: boolean
          alert_insurance_renewal: boolean
          alert_fastag_low_balance: boolean
          alert_speed_warnings: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_fuel_type?: string
          monthly_average_km?: number
          connected_car_sync_enabled?: boolean
          alert_service_reminders?: boolean
          alert_puc_expiry?: boolean
          alert_insurance_renewal?: boolean
          alert_fastag_low_balance?: boolean
          alert_speed_warnings?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_fuel_type?: string
          monthly_average_km?: number
          connected_car_sync_enabled?: boolean
          alert_service_reminders?: boolean
          alert_puc_expiry?: boolean
          alert_insurance_renewal?: boolean
          alert_fastag_low_balance?: boolean
          alert_speed_warnings?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      car_catalogue: {
        Row: {
          id: string
          make: string
          model: string
          variant: string
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
          transmission: 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed'
          body_type: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover'
          ex_showroom_price: number
          estimated_on_road_price: number
          mileage_or_range: number
          mileage_unit: string
          power_bhp: number
          torque_nm: number
          safety_rating: string
          annual_maintenance_estimate: number
          annual_insurance_estimate: number
          resale_percentage_3yr: number
          resale_percentage_5yr: number
          image_url: string | null
          highlights: string[]
          why_recommended: string
          pros: string[]
          cons: string[]
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          variant: string
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
          transmission: 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed'
          body_type: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover'
          ex_showroom_price: number
          estimated_on_road_price: number
          mileage_or_range: number
          mileage_unit?: string
          power_bhp?: number
          torque_nm?: number
          safety_rating?: string
          annual_maintenance_estimate?: number
          annual_insurance_estimate?: number
          resale_percentage_3yr?: number
          resale_percentage_5yr?: number
          image_url?: string | null
          highlights?: string[]
          why_recommended?: string
          pros?: string[]
          cons?: string[]
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          variant?: string
          fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
          transmission?: 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed'
          body_type?: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover'
          ex_showroom_price?: number
          estimated_on_road_price?: number
          mileage_or_range?: number
          mileage_unit?: string
          power_bhp?: number
          torque_nm?: number
          safety_rating?: string
          annual_maintenance_estimate?: number
          annual_insurance_estimate?: number
          resale_percentage_3yr?: number
          resale_percentage_5yr?: number
          image_url?: string | null
          highlights?: string[]
          why_recommended?: string
          pros?: string[]
          cons?: string[]
          is_active?: boolean
          created_at?: string
        }
      }
      recommendation_analyses: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string | null
          title: string
          current_vehicle_data: Json
          replacement_criteria: Json
          current_car_tco: Json
          recommended_cars: Json
          compared_car_ids: string[]
          verdict: 'KEEP_CURRENT' | 'CONSIDER_UPGRADING' | 'REPLACEMENT_FINANCIALLY_BENEFICIAL'
          verdict_details: Json
          five_year_net_difference: number
          is_saved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id?: string | null
          title?: string
          current_vehicle_data: Json
          replacement_criteria: Json
          current_car_tco: Json
          recommended_cars: Json
          compared_car_ids?: string[]
          verdict: 'KEEP_CURRENT' | 'CONSIDER_UPGRADING' | 'REPLACEMENT_FINANCIALLY_BENEFICIAL'
          verdict_details: Json
          five_year_net_difference?: number
          is_saved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string | null
          title?: string
          current_vehicle_data?: Json
          replacement_criteria?: Json
          current_car_tco?: Json
          recommended_cars?: Json
          compared_car_ids?: string[]
          verdict?: 'KEEP_CURRENT' | 'CONSIDER_UPGRADING' | 'REPLACEMENT_FINANCIALLY_BENEFICIAL'
          verdict_details?: Json
          five_year_net_difference?: number
          is_saved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      manufacturers: {
        Row: {
          id: string
          name: string
          slug: string
          country: string
          year_established_india: number | null
          headquarters_india: string | null
          logo_url: string | null
          website_url: string | null
          support_phone: string | null
          market_share_percent: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          country?: string
          year_established_india?: number | null
          headquarters_india?: string | null
          logo_url?: string | null
          website_url?: string | null
          support_phone?: string | null
          market_share_percent?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          country?: string
          year_established_india?: number | null
          headquarters_india?: string | null
          logo_url?: string | null
          website_url?: string | null
          support_phone?: string | null
          market_share_percent?: number
          is_active?: boolean
          created_at?: string
        }
      }
      car_models: {
        Row: {
          id: string
          manufacturer_id: string
          name: string
          slug: string
          category: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover'
          launch_year: number
          market_status: 'active' | 'discontinued' | 'upcoming'
          available_fuel_types: string[]
          available_transmissions: string[]
          image_url: string | null
          description: string | null
          safety_rating: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          manufacturer_id: string
          name: string
          slug: string
          category: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover'
          launch_year: number
          market_status: 'active' | 'discontinued' | 'upcoming'
          available_fuel_types?: string[]
          available_transmissions?: string[]
          image_url?: string | null
          description?: string | null
          safety_rating?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          manufacturer_id?: string
          name?: string
          slug?: string
          category?: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover'
          launch_year?: number
          market_status?: 'active' | 'discontinued' | 'upcoming'
          available_fuel_types?: string[]
          available_transmissions?: string[]
          image_url?: string | null
          description?: string | null
          safety_rating?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      car_variants: {
        Row: {
          id: string
          model_id: string
          name: string
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
          transmission: 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed'
          engine_capacity_cc: number | null
          battery_capacity_kwh: number | null
          power_bhp: number
          torque_nm: number
          mileage_or_range: number
          mileage_unit: 'km/l' | 'km/charge' | 'km/kg'
          seating_capacity: number
          ex_showroom_price: number
          annual_maintenance_estimate: number
          annual_insurance_estimate: number
          ground_clearance_mm: number | null
          boot_capacity_litres: number | null
          fuel_tank_capacity_litres: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          model_id: string
          name: string
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
          transmission: 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed'
          engine_capacity_cc?: number | null
          battery_capacity_kwh?: number | null
          power_bhp: number
          torque_nm: number
          mileage_or_range: number
          mileage_unit: 'km/l' | 'km/charge' | 'km/kg'
          seating_capacity?: number
          ex_showroom_price: number
          annual_maintenance_estimate?: number
          annual_insurance_estimate?: number
          ground_clearance_mm?: number | null
          boot_capacity_litres?: number | null
          fuel_tank_capacity_litres?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          name?: string
          fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'
          transmission?: 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed'
          engine_capacity_cc?: number | null
          battery_capacity_kwh?: number | null
          power_bhp?: number
          torque_nm?: number
          mileage_or_range?: number
          mileage_unit?: 'km/l' | 'km/charge' | 'km/kg'
          seating_capacity?: number
          ex_showroom_price?: number
          annual_maintenance_estimate?: number
          annual_insurance_estimate?: number
          ground_clearance_mm?: number | null
          boot_capacity_litres?: number | null
          fuel_tank_capacity_litres?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      indian_states: {
        Row: {
          id: string
          name: string
          type: 'state' | 'union_territory'
          capital: string
          rto_code_prefix: string
          gst_state_code: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          type: 'state' | 'union_territory'
          capital: string
          rto_code_prefix: string
          gst_state_code?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          type?: 'state' | 'union_territory'
          capital?: string
          rto_code_prefix?: string
          gst_state_code?: string | null
          is_active?: boolean
        }
      }
      indian_cities: {
        Row: {
          id: string
          name: string
          state_id: string
          tier: number
          rto_codes: string[]
          is_metro: boolean
          municipal_parking_tax: number
          local_cess_percent: number
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          state_id: string
          tier: number
          rto_codes?: string[]
          is_metro?: boolean
          municipal_parking_tax?: number
          local_cess_percent?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          state_id?: string
          tier?: number
          rto_codes?: string[]
          is_metro?: boolean
          municipal_parking_tax?: number
          local_cess_percent?: number
          is_active?: boolean
        }
      }
      state_rto_rules: {
        Row: {
          id: string
          state_id: string
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'all'
          price_min: number
          price_max: number
          tax_percent: number
          fixed_cess: number
          green_cess: number
          special_notes: string | null
          effective_year: number
        }
        Insert: {
          id?: string
          state_id: string
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'all'
          price_min?: number
          price_max?: number
          tax_percent: number
          fixed_cess?: number
          green_cess?: number
          special_notes?: string | null
          effective_year?: number
        }
        Update: {
          id?: string
          state_id?: string
          fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'all'
          price_min?: number
          price_max?: number
          tax_percent?: number
          fixed_cess?: number
          green_cess?: number
          special_notes?: string | null
          effective_year?: number
        }
      }
      fuel_pricing_records: {
        Row: {
          id: string
          state_id: string
          city_id: string | null
          petrol_price_per_litre: number
          diesel_price_per_litre: number
          cng_price_per_kg: number
          updated_at: string
        }
        Insert: {
          id?: string
          state_id: string
          city_id?: string | null
          petrol_price_per_litre: number
          diesel_price_per_litre: number
          cng_price_per_kg: number
          updated_at?: string
        }
        Update: {
          id?: string
          state_id?: string
          city_id?: string | null
          petrol_price_per_litre?: number
          diesel_price_per_litre?: number
          cng_price_per_kg?: number
          updated_at?: string
        }
      }
      ev_charging_tariffs: {
        Row: {
          id: string
          state_id: string
          discom_name: string
          domestic_ac_rate_per_kwh: number
          public_dc_fast_rate_per_kwh: number
          commercial_fleet_rate_per_kwh: number
          updated_at: string
        }
        Insert: {
          id?: string
          state_id: string
          discom_name: string
          domestic_ac_rate_per_kwh: number
          public_dc_fast_rate_per_kwh: number
          commercial_fleet_rate_per_kwh: number
          updated_at?: string
        }
        Update: {
          id?: string
          state_id?: string
          discom_name?: string
          domestic_ac_rate_per_kwh?: number
          public_dc_fast_rate_per_kwh?: number
          commercial_fleet_rate_per_kwh?: number
          updated_at?: string
        }
      }
      vehicle_documents: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          title: string
          category: 'rc' | 'insurance' | 'puc' | 'purchase_invoice' | 'service_invoice' | 'warranty' | 'other'
          document_number: string | null
          issue_date: string | null
          expiry_date: string | null
          file_url: string | null
          storage_path: string | null
          file_size_bytes: number
          mime_type: string
          status: 'valid' | 'expiring_soon' | 'expired' | 'under_review'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          title: string
          category: 'rc' | 'insurance' | 'puc' | 'purchase_invoice' | 'service_invoice' | 'warranty' | 'other'
          document_number?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          file_url?: string | null
          storage_path?: string | null
          file_size_bytes?: number
          mime_type?: string
          status?: 'valid' | 'expiring_soon' | 'expired' | 'under_review'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          title?: string
          category?: 'rc' | 'insurance' | 'puc' | 'purchase_invoice' | 'service_invoice' | 'warranty' | 'other'
          document_number?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          file_url?: string | null
          storage_path?: string | null
          file_size_bytes?: number
          mime_type?: string
          status?: 'valid' | 'expiring_soon' | 'expired' | 'under_review'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_schedules: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          subsystem: 'engine' | 'battery' | 'tyres' | 'brakes' | 'transmission' | 'ac' | 'other'
          item_name: string
          last_service_date: string | null
          last_service_km: number | null
          interval_months: number
          interval_km: number
          next_due_date: string | null
          next_due_km: number | null
          status: 'up_to_date' | 'due_soon' | 'overdue' | 'info_missing'
          last_expense_inr: number
          service_provider: string | null
          technician_notes: string | null
          is_custom: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          subsystem: 'engine' | 'battery' | 'tyres' | 'brakes' | 'transmission' | 'ac' | 'other'
          item_name: string
          last_service_date?: string | null
          last_service_km?: number | null
          interval_months?: number
          interval_km?: number
          next_due_date?: string | null
          next_due_km?: number | null
          status?: 'up_to_date' | 'due_soon' | 'overdue' | 'info_missing'
          last_expense_inr?: number
          service_provider?: string | null
          technician_notes?: string | null
          is_custom?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          subsystem?: 'engine' | 'battery' | 'tyres' | 'brakes' | 'transmission' | 'ac' | 'other'
          item_name?: string
          last_service_date?: string | null
          last_service_km?: number | null
          interval_months?: number
          interval_km?: number
          next_due_date?: string | null
          next_due_km?: number | null
          status?: 'up_to_date' | 'due_soon' | 'overdue' | 'info_missing'
          last_expense_inr?: number
          service_provider?: string | null
          technician_notes?: string | null
          is_custom?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_reminders: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          reminder_type: 'insurance' | 'puc' | 'service' | 'oil' | 'battery' | 'tyres' | 'brakes' | 'custom'
          title: string
          description: string | null
          due_date: string
          due_km: number | null
          priority: 'high' | 'medium' | 'low'
          is_completed: boolean
          completed_at: string | null
          is_dismissed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          reminder_type: 'insurance' | 'puc' | 'service' | 'oil' | 'battery' | 'tyres' | 'brakes' | 'custom'
          title: string
          description?: string | null
          due_date: string
          due_km?: number | null
          priority?: 'high' | 'medium' | 'low'
          is_completed?: boolean
          completed_at?: string | null
          is_dismissed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          reminder_type?: 'insurance' | 'puc' | 'service' | 'oil' | 'battery' | 'tyres' | 'brakes' | 'custom'
          title?: string
          description?: string | null
          due_date?: string
          due_km?: number | null
          priority?: 'high' | 'medium' | 'low'
          is_completed?: boolean
          completed_at?: string | null
          is_dismissed?: boolean
          created_at?: string
        }
      }
      vehicle_photos: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          photo_url: string
          storage_path: string | null
          caption: string | null
          angle: 'front' | 'rear' | 'side' | 'interior' | 'engine' | 'odometer' | 'document' | 'other' | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          photo_url: string
          storage_path?: string | null
          caption?: string | null
          angle?: 'front' | 'rear' | 'side' | 'interior' | 'engine' | 'odometer' | 'document' | 'other' | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          photo_url?: string
          storage_path?: string | null
          caption?: string | null
          angle?: 'front' | 'rear' | 'side' | 'interior' | 'engine' | 'odometer' | 'document' | 'other' | null
          created_at?: string
        }
      }
    }
  }
}
