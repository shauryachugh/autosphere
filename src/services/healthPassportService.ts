import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  VehiclePassportData,
  MaintenanceScheduleItem,
  HealthSubsystem,
  HealthStatus,
  DigitalDocument,
  MaintenanceTimelineEvent,
  VehicleReminder,
  HealthDashboardSummary,
  DocumentCategory,
} from '../types/passport.types';

// Standard OEM benchmark maintenance schedules for Indian passenger vehicles
export const DEFAULT_MAINTENANCE_SCHEDULE_TEMPLATES = [
  // 1. ENGINE
  {
    subsystem: 'engine' as HealthSubsystem,
    itemName: 'Engine Oil & Oil Filter Replacement',
    intervalMonths: 12,
    intervalKm: 10000,
    technicianNotes: 'Use API SN/SP or ACEA C3 fully synthetic oil. Replace sump washer & O-ring.',
  },
  {
    subsystem: 'engine' as HealthSubsystem,
    itemName: 'Engine Air Filter & Cabin AC Filter',
    intervalMonths: 12,
    intervalKm: 15000,
    technicianNotes: 'Clean every 5,000 km in dusty Indian urban driving; replace annually.',
  },
  {
    subsystem: 'engine' as HealthSubsystem,
    itemName: 'Coolant & Radiator Flushes',
    intervalMonths: 24,
    intervalKm: 40000,
    technicianNotes: 'Inspect ethylene glycol concentration ratio (50:50). Check radiator cap pressure.',
  },

  // 2. BATTERY
  {
    subsystem: 'battery' as HealthSubsystem,
    itemName: '12V Auxiliary Battery Inspection & Voltage Test',
    intervalMonths: 6,
    intervalKm: 10000,
    technicianNotes: 'Check terminal corrosion, apply petroleum jelly, verify CCA output (>12.6V resting).',
  },

  // 3. TYRES
  {
    subsystem: 'tyres' as HealthSubsystem,
    itemName: 'Tyre Rotation, Wheel Alignment & Balancing',
    intervalMonths: 6,
    intervalKm: 7500,
    technicianNotes: 'Cross-rotate radial tyres. Inspect tread depth (>2.5 mm safe limit) and sidewall bulges.',
  },

  // 4. BRAKES
  {
    subsystem: 'brakes' as HealthSubsystem,
    itemName: 'Front Brake Pads & Rotor Disc Inspection',
    intervalMonths: 12,
    intervalKm: 20000,
    technicianNotes: 'Measure friction material thickness (>3.0 mm). Inspect caliper slider pins.',
  },
  {
    subsystem: 'brakes' as HealthSubsystem,
    itemName: 'DOT-4 Brake Fluid Flush & Bleed',
    intervalMonths: 24,
    intervalKm: 30000,
    technicianNotes: 'Moisture absorption degrades boiling point. Complete system hydraulic bleed.',
  },

  // 5. TRANSMISSION & DRIVETRAIN
  {
    subsystem: 'transmission' as HealthSubsystem,
    itemName: 'Transmission Fluid & Differential Oil Service',
    intervalMonths: 36,
    intervalKm: 50000,
    technicianNotes: 'Inspect ATF / MTF oil clarity and clutch pedal free play.',
  },

  // 6. AC & CLIMATE
  {
    subsystem: 'ac' as HealthSubsystem,
    itemName: 'Air Conditioning Refrigerant (R134a/R1234yf) & Blower Sanitize',
    intervalMonths: 12,
    intervalKm: 15000,
    technicianNotes: 'Clean evaporator core fins, verify compressor cut-in pressure & vent temp (4-8°C).',
  },
];

class HealthPassportService {
  // Local storage cache keys for seamless guest/demo mode
  private getStorageKey(type: string, vehicleId: string) {
    return `autosphere_${type}_${vehicleId}`;
  }

  // --------------------------------------------------------------------------
  // MODULE 1: DIGITAL VEHICLE PASSPORT
  // --------------------------------------------------------------------------
  async getPassport(vehicleId: string): Promise<VehiclePassportData> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();

        if (data && !error) {
          return {
            id: data.id,
            userId: data.user_id,
            make: data.make,
            model: data.model,
            variant: data.variant,
            manufacturingYear: data.manufacturing_year,
            registrationYear: data.registration_year,
            fuelType: data.fuel_type as any,
            transmission: data.transmission as any,
            bodyType: data.body_type as any,
            regNumber: data.registration_number,
            registrationState: data.registration_state,
            registrationCity: data.registration_city,
            rtoCode: data.rto_code || `${data.registration_number.slice(0, 5).trim()}`,
            purchaseDate: data.purchase_date,
            purchasePriceINR: data.purchase_price ? Number(data.purchase_price) : undefined,
            currentOdometer: data.current_odometer || 10000,
            chassisNumber: data.vin || undefined,
            engineNumber: data.engine_number || 'EN7849129A',
            previousOwnersCount: data.previous_owners_count || 1,
            color: data.color || 'Pearl White',
            photos: data.photos || [data.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'],
            notes: data.notes || '',
            insurancePolicyNumber: data.insurance_policy_number,
            insuranceProvider: data.insurance_provider,
            insuranceExpiryDate: data.insurance_expiry_date,
            pucCertificateNumber: 'PUC-KA01-2024-8910',
            pucExpiryDate: data.puc_expiry_date,
            healthScore: data.health_score || 92,
            connectedCarPlatform: data.connected_car_platform,
            isPrimary: data.is_primary,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Failed to load passport from Supabase, using local fallback:', err);
      }
    }

    // LocalStorage Fallback
    const local = localStorage.getItem(this.getStorageKey('passport', vehicleId));
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    // Default Seed Passport
    return {
      id: vehicleId,
      userId: 'user-demo',
      make: 'Mahindra',
      model: 'Scorpio-N',
      variant: 'Z8L 4x4 Diesel AT',
      manufacturingYear: 2023,
      registrationYear: 2023,
      fuelType: 'diesel',
      transmission: 'automatic',
      bodyType: 'suv',
      regNumber: 'KA 01 MR 7812',
      registrationState: 'Karnataka',
      registrationCity: 'Bengaluru',
      rtoCode: 'KA-01 (Koramangala RTO)',
      purchaseDate: '2023-04-15',
      purchasePriceINR: 2450000,
      currentOdometer: 18500,
      chassisNumber: 'MA1TN8SK9P2E90123',
      engineNumber: 'mHawk22D984102',
      previousOwnersCount: 1,
      color: 'Napoli Black',
      photos: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',
      ],
      notes: 'Maintained exclusively at Chrome Motors Authorized Workshop. Ceramic coating applied June 2024.',
      insurancePolicyNumber: 'HDFC-ERGO-MOT-2024-9182',
      insuranceProvider: 'HDFC ERGO General Insurance',
      insuranceExpiryDate: '2025-04-14',
      pucCertificateNumber: 'PUC-KA01-2024-8910',
      pucExpiryDate: '2025-03-20',
      healthScore: 94,
      connectedCarPlatform: 'AdrenoX',
      isPrimary: true,
      createdAt: new Date().toISOString(),
    };
  }

  async updatePassport(vehicleId: string, updates: Partial<VehiclePassportData>): Promise<VehiclePassportData> {
    const existing = await this.getPassport(vehicleId);
    const merged: VehiclePassportData = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('vehicles')
          .update({
            make: merged.make,
            model: merged.model,
            variant: merged.variant,
            manufacturing_year: merged.manufacturingYear,
            registration_year: merged.registrationYear,
            fuel_type: merged.fuelType,
            transmission: merged.transmission,
            body_type: merged.bodyType,
            registration_number: merged.regNumber,
            registration_state: merged.registrationState,
            registration_city: merged.registrationCity,
            rto_code: merged.rtoCode,
            current_odometer: merged.currentOdometer,
            purchase_price: merged.purchasePriceINR,
            purchase_date: merged.purchaseDate,
            vin: merged.chassisNumber,
            engine_number: merged.engineNumber,
            previous_owners_count: merged.previousOwnersCount,
            color: merged.color,
            notes: merged.notes,
            photos: merged.photos,
            insurance_policy_number: merged.insurancePolicyNumber,
            insurance_provider: merged.insuranceProvider,
            insurance_expiry_date: merged.insuranceExpiryDate,
            puc_expiry_date: merged.pucExpiryDate,
          })
          .eq('id', vehicleId);
      } catch (err) {
        console.warn('Failed to update passport in Supabase:', err);
      }
    }

    localStorage.setItem(this.getStorageKey('passport', vehicleId), JSON.stringify(merged));
    return merged;
  }

  // --------------------------------------------------------------------------
  // MODULE 2: VEHICLE HEALTH TRACKER
  // --------------------------------------------------------------------------
  calculateHealthStatus(
    lastDate?: string,
    lastKm?: number,
    intervalMonths = 12,
    intervalKm = 10000,
    currentOdo = 18500
  ): HealthStatus {
    if (!lastDate && !lastKm) return 'info_missing';

    const now = new Date();
    let isDateOverdue = false;
    let isDateDueSoon = false;

    if (lastDate) {
      const last = new Date(lastDate);
      const nextDue = new Date(last);
      nextDue.setMonth(nextDue.getMonth() + intervalMonths);

      const daysRemaining = Math.round((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysRemaining < 0) isDateOverdue = true;
      else if (daysRemaining <= 30) isDateDueSoon = true;
    }

    let isKmOverdue = false;
    let isKmDueSoon = false;

    if (lastKm !== undefined) {
      const nextDueKm = lastKm + intervalKm;
      const kmRemaining = nextDueKm - currentOdo;
      if (kmRemaining < 0) isKmOverdue = true;
      else if (kmRemaining <= 1000) isKmDueSoon = true;
    }

    if (isDateOverdue || isKmOverdue) return 'overdue';
    if (isDateDueSoon || isKmDueSoon) return 'due_soon';
    return 'up_to_date';
  }

  async getMaintenanceSchedules(vehicleId: string, currentOdo = 18500): Promise<MaintenanceScheduleItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('maintenance_schedules')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('subsystem');

        if (data && data.length > 0 && !error) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            vehicleId: d.vehicle_id,
            subsystem: d.subsystem,
            itemName: d.item_name,
            lastServiceDate: d.last_service_date,
            lastServiceKm: d.last_service_km,
            intervalMonths: d.interval_months,
            intervalKm: d.interval_km,
            recommendedNextDate: d.next_due_date,
            recommendedNextKm: d.next_due_km,
            status: this.calculateHealthStatus(d.last_service_date, d.last_service_km, d.interval_months, d.interval_km, currentOdo),
            actualExpenseINR: Number(d.last_expense_inr || 0),
            serviceProvider: d.service_provider,
            technicianNotes: d.technician_notes,
            isCustom: d.is_custom,
          }));
        }
      } catch (err) {
        console.warn('Failed to load maintenance schedules from Supabase:', err);
      }
    }

    // LocalStorage Fallback
    const local = localStorage.getItem(this.getStorageKey('maint_schedules', vehicleId));
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return parsed.map((item: MaintenanceScheduleItem) => ({
          ...item,
          status: this.calculateHealthStatus(item.lastServiceDate, item.lastServiceKm, item.intervalMonths, item.intervalKm, currentOdo),
        }));
      } catch {}
    }

    // Initial Seed from templates
    const initialItems: MaintenanceScheduleItem[] = DEFAULT_MAINTENANCE_SCHEDULE_TEMPLATES.map((tmpl, idx) => {
      // Simulate realistic last service 6-8 months ago
      const lastDate = '2024-04-10';
      const lastKm = 10000;
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + tmpl.intervalMonths);

      return {
        id: `sched-${vehicleId}-${idx}`,
        vehicleId,
        subsystem: tmpl.subsystem,
        itemName: tmpl.itemName,
        lastServiceDate: lastDate,
        lastServiceKm: lastKm,
        intervalMonths: tmpl.intervalMonths,
        intervalKm: tmpl.intervalKm,
        recommendedNextDate: nextDate.toISOString().split('T')[0],
        recommendedNextKm: lastKm + tmpl.intervalKm,
        status: this.calculateHealthStatus(lastDate, lastKm, tmpl.intervalMonths, tmpl.intervalKm, currentOdo),
        actualExpenseINR: tmpl.subsystem === 'engine' ? 4500 : 1200,
        serviceProvider: 'Chrome Motors Authorized Workshop',
        technicianNotes: tmpl.technicianNotes,
        isCustom: false,
      };
    });

    localStorage.setItem(this.getStorageKey('maint_schedules', vehicleId), JSON.stringify(initialItems));
    return initialItems;
  }

  async saveMaintenanceScheduleItem(item: MaintenanceScheduleItem): Promise<MaintenanceScheduleItem> {
    const list = await this.getMaintenanceSchedules(item.vehicleId);
    const index = list.findIndex(i => i.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('maintenance_schedules').upsert({
          id: item.id.startsWith('sched-') ? undefined : item.id,
          vehicle_id: item.vehicleId,
          subsystem: item.subsystem,
          item_name: item.itemName,
          last_service_date: item.lastServiceDate,
          last_service_km: item.lastServiceKm,
          interval_months: item.intervalMonths,
          interval_km: item.intervalKm,
          next_due_date: item.recommendedNextDate,
          next_due_km: item.recommendedNextKm,
          status: item.status,
          last_expense_inr: item.actualExpenseINR || 0,
          service_provider: item.serviceProvider,
          technician_notes: item.technicianNotes,
          is_custom: item.isCustom,
        });
      } catch (err) {
        console.warn('Failed to upsert schedule in Supabase:', err);
      }
    }

    localStorage.setItem(this.getStorageKey('maint_schedules', item.vehicleId), JSON.stringify(list));
    return item;
  }

  // --------------------------------------------------------------------------
  // MODULE 3 & 6: LOG MAINTENANCE SERVICE & AUTO-SYNC EXPENSE
  // --------------------------------------------------------------------------
  async logMaintenanceServiceEvent(params: {
    vehicleId: string;
    subsystem: HealthSubsystem;
    itemName: string;
    serviceDate: string;
    odometerKm: number;
    expenseINR: number;
    serviceProvider: string;
    technicianNotes?: string;
    createExpenseRecord?: boolean;
  }): Promise<void> {
    const {
      vehicleId,
      subsystem,
      itemName,
      serviceDate,
      odometerKm,
      expenseINR,
      serviceProvider,
      technicianNotes,
      createExpenseRecord = true,
    } = params;

    // 1. Update the Maintenance Schedule Item
    const schedules = await this.getMaintenanceSchedules(vehicleId, odometerKm);
    let matched = schedules.find(s => s.subsystem === subsystem && s.itemName === itemName);
    if (!matched) {
      matched = {
        id: `sched-${vehicleId}-${Date.now()}`,
        vehicleId,
        subsystem,
        itemName,
        intervalMonths: 12,
        intervalKm: 10000,
        status: 'up_to_date',
        isCustom: true,
      };
      schedules.push(matched);
    }

    matched.lastServiceDate = serviceDate;
    matched.lastServiceKm = odometerKm;
    matched.actualExpenseINR = expenseINR;
    matched.serviceProvider = serviceProvider;
    matched.technicianNotes = technicianNotes;

    const nextDate = new Date(serviceDate);
    nextDate.setMonth(nextDate.getMonth() + matched.intervalMonths);
    matched.recommendedNextDate = nextDate.toISOString().split('T')[0];
    matched.recommendedNextKm = odometerKm + matched.intervalKm;
    matched.status = 'up_to_date';

    await this.saveMaintenanceScheduleItem(matched);

    // 2. Insert into Supabase maintenance_records & vehicle_expenses (avoiding duplicates)
    if (isSupabaseConfigured) {
      try {
        const { data: maintRecord } = await supabase
          .from('maintenance_records')
          .insert({
            vehicle_id: vehicleId,
            service_type: itemName,
            service_date: serviceDate,
            odometer_km: odometerKm,
            total_cost_inr: expenseINR,
            service_center_name: serviceProvider,
            notes: technicianNotes || '',
          })
          .select('id')
          .single();

        if (createExpenseRecord && expenseINR > 0) {
          await supabase.from('vehicle_expenses').insert({
            vehicle_id: vehicleId,
            category: 'service',
            amount_inr: expenseINR,
            expense_date: serviceDate,
            odometer_km: odometerKm,
            vendor: serviceProvider,
            notes: `${itemName} - ${technicianNotes || 'Periodic maintenance logged'}`,
            payment_method: 'UPI',
          });
        }
      } catch (err) {
        console.warn('Failed to sync maintenance record to Supabase:', err);
      }
    }

    // Also append to local timeline cache
    const timeline = await this.getTimelineEvents(vehicleId);
    timeline.unshift({
      id: `maint-${Date.now()}`,
      vehicleId,
      date: serviceDate,
      odometerKm,
      category: 'service',
      title: itemName,
      description: technicianNotes || `Serviced at ${serviceProvider}`,
      amountINR: expenseINR,
      serviceProvider,
    });
    localStorage.setItem(this.getStorageKey('timeline', vehicleId), JSON.stringify(timeline));
  }

  // --------------------------------------------------------------------------
  // MODULE 3: DIGITAL DOCUMENT VAULT (Supabase Storage + Metadata)
  // --------------------------------------------------------------------------
  async getDocuments(vehicleId: string): Promise<DigitalDocument[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('vehicle_documents')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('category');

        if (data && data.length > 0 && !error) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            vehicleId: d.vehicle_id,
            title: d.title,
            category: d.category as DocumentCategory,
            documentNumber: d.document_number,
            issueDate: d.issue_date,
            expiryDate: d.expiry_date,
            fileUrl: d.file_url,
            storagePath: d.storage_path,
            fileSizeBytes: Number(d.file_size_bytes || 0),
            mimeType: d.mime_type,
            status: d.status,
            notes: d.notes,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Failed to load documents from Supabase:', err);
      }
    }

    // LocalStorage Fallback
    const local = localStorage.getItem(this.getStorageKey('documents', vehicleId));
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    // Default Seed Documents
    const seedDocs: DigitalDocument[] = [
      {
        id: `doc-${vehicleId}-rc`,
        userId: 'user-demo',
        vehicleId,
        title: 'Registration Certificate (Smart Card RC)',
        category: 'rc',
        documentNumber: 'KA01MR7812',
        issueDate: '2023-04-18',
        expiryDate: '2038-04-17',
        storagePath: `vehicle-documents/${vehicleId}/rc_smartcard.pdf`,
        fileSizeBytes: 1840000,
        mimeType: 'application/pdf',
        status: 'valid',
        notes: 'Parivahan verified digital RC',
        createdAt: '2023-04-18T10:00:00Z',
      },
      {
        id: `doc-${vehicleId}-ins`,
        userId: 'user-demo',
        vehicleId,
        title: 'Comprehensive Insurance Policy (Zero Dep)',
        category: 'insurance',
        documentNumber: 'HDFC-ERGO-MOT-2024-9182',
        issueDate: '2024-04-15',
        expiryDate: '2025-04-14',
        storagePath: `vehicle-documents/${vehicleId}/insurance_2024_2025.pdf`,
        fileSizeBytes: 2450000,
        mimeType: 'application/pdf',
        status: 'valid',
        notes: 'IDV ₹21,50,000 with Nil-Depreciation and Engine Protector',
        createdAt: '2024-04-15T12:00:00Z',
      },
      {
        id: `doc-${vehicleId}-puc`,
        userId: 'user-demo',
        vehicleId,
        title: 'Pollution Under Control (PUC) Certificate',
        category: 'puc',
        documentNumber: 'PUC-KA01-2024-8910',
        issueDate: '2024-09-21',
        expiryDate: '2025-03-20',
        storagePath: `vehicle-documents/${vehicleId}/puc_sep2024.pdf`,
        fileSizeBytes: 980000,
        mimeType: 'application/pdf',
        status: 'valid',
        notes: 'BS-VI Diesel Smoke Density: 0.28 / m (Pass)',
        createdAt: '2024-09-21T15:30:00Z',
      },
      {
        id: `doc-${vehicleId}-invoice`,
        userId: 'user-demo',
        vehicleId,
        title: 'Vehicle Purchase Tax Invoice',
        category: 'purchase_invoice',
        documentNumber: 'INV-CHROME-2023-419',
        issueDate: '2023-04-15',
        storagePath: `vehicle-documents/${vehicleId}/purchase_invoice.pdf`,
        fileSizeBytes: 3120000,
        mimeType: 'application/pdf',
        status: 'valid',
        notes: 'Original GST tax invoice with dealer delivery receipt',
        createdAt: '2023-04-15T09:00:00Z',
      },
    ];

    localStorage.setItem(this.getStorageKey('documents', vehicleId), JSON.stringify(seedDocs));
    return seedDocs;
  }

  async saveDocument(doc: Partial<DigitalDocument> & { vehicleId: string; category: DocumentCategory; title: string }): Promise<DigitalDocument> {
    const fullDoc: DigitalDocument = {
      id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: doc.userId || 'user-demo',
      vehicleId: doc.vehicleId,
      category: doc.category,
      title: doc.title,
      documentNumber: doc.documentNumber,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      fileUrl: doc.fileUrl,
      storagePath: doc.storagePath,
      fileSizeBytes: doc.fileSizeBytes || 1024000,
      mimeType: doc.mimeType || 'application/pdf',
      status: doc.status || 'valid',
      notes: doc.notes,
      createdAt: doc.createdAt || new Date().toISOString(),
    };

    const docs = await this.getDocuments(fullDoc.vehicleId);
    const index = docs.findIndex(d => d.id === fullDoc.id);
    if (index >= 0) {
      docs[index] = fullDoc;
    } else {
      docs.unshift(fullDoc);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('vehicle_documents').upsert({
          id: fullDoc.id.startsWith('doc-') ? undefined : fullDoc.id,
          vehicle_id: fullDoc.vehicleId,
          title: fullDoc.title,
          category: fullDoc.category,
          document_number: fullDoc.documentNumber,
          issue_date: fullDoc.issueDate,
          expiry_date: fullDoc.expiryDate,
          file_url: fullDoc.fileUrl,
          storage_path: fullDoc.storagePath,
          file_size_bytes: fullDoc.fileSizeBytes,
          mime_type: fullDoc.mimeType,
          status: fullDoc.status,
          notes: fullDoc.notes,
        });
      } catch (err) {
        console.warn('Failed to upsert document in Supabase:', err);
      }
    }

    localStorage.setItem(this.getStorageKey('documents', fullDoc.vehicleId), JSON.stringify(docs));
    return fullDoc;
  }

  async deleteDocument(vehicleId: string, docId: string): Promise<void> {
    const docs = await this.getDocuments(vehicleId);
    const filtered = docs.filter(d => d.id !== docId);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('vehicle_documents').delete().eq('id', docId);
      } catch (err) {
        console.warn('Failed to delete document from Supabase:', err);
      }
    }

    localStorage.setItem(this.getStorageKey('documents', vehicleId), JSON.stringify(filtered));
  }

  // --------------------------------------------------------------------------
  // MODULE 4: CHRONOLOGICAL MAINTENANCE TIMELINE
  // --------------------------------------------------------------------------
  async getTimelineEvents(vehicleId: string, filterCategory?: string): Promise<MaintenanceTimelineEvent[]> {
    // Check cached timeline
    const local = localStorage.getItem(this.getStorageKey('timeline', vehicleId));
    let events: MaintenanceTimelineEvent[] = [];

    if (local) {
      try {
        events = JSON.parse(local);
      } catch {}
    }

    if (events.length === 0) {
      // Seed rich chronological timeline
      events = [
        {
          id: 'ev-1',
          vehicleId,
          date: '2024-09-21',
          odometerKm: 17200,
          category: 'puc',
          title: 'PUC Emission Test Passed',
          description: '6-Month Emission Certificate issued at Koramangala Emission Testing Centre.',
          amountINR: 150,
          isComplianceRelated: true,
        },
        {
          id: 'ev-2',
          vehicleId,
          date: '2024-04-15',
          odometerKm: 13500,
          category: 'insurance',
          title: 'Insurance Renewal (Zero Dep Comprehensive)',
          description: 'Policy HDFC-ERGO-MOT-2024-9182 renewed with Nil Depreciation & Engine Protector.',
          amountINR: 52400,
          serviceProvider: 'HDFC ERGO General Insurance',
          isComplianceRelated: true,
        },
        {
          id: 'ev-3',
          vehicleId,
          date: '2024-04-10',
          odometerKm: 10000,
          category: 'service',
          title: '10,000 km Scheduled Second Periodic Service',
          description: 'Engine oil (6L synthetic), oil filter, AC pollen filter, wheel rotation, brake pad inspection.',
          amountINR: 8450,
          serviceProvider: 'Chrome Motors Mahindra Authorized',
        },
        {
          id: 'ev-4',
          vehicleId,
          date: '2023-10-12',
          odometerKm: 5000,
          category: 'part_replacement',
          title: 'Cabin Air Purifier Filter Replacement',
          description: 'Replaced activated carbon HEPA filter for clean cabin AQI.',
          amountINR: 1850,
          serviceProvider: 'Chrome Motors',
        },
        {
          id: 'ev-5',
          vehicleId,
          date: '2023-05-18',
          odometerKm: 1000,
          category: 'service',
          title: '1,000 km First Free Inspection Service',
          description: 'Fluid levels top-up, underbody torque check, ECU diagnostic health scan.',
          amountINR: 0,
          serviceProvider: 'Chrome Motors Mahindra Authorized',
        },
      ];
      localStorage.setItem(this.getStorageKey('timeline', vehicleId), JSON.stringify(events));
    }

    if (filterCategory && filterCategory !== 'all') {
      return events.filter(e => e.category === filterCategory);
    }
    return events;
  }

  // --------------------------------------------------------------------------
  // MODULE 5: SMART IN-APP REMINDERS
  // --------------------------------------------------------------------------
  async getReminders(vehicleId?: string): Promise<VehicleReminder[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('vehicle_reminders').select('*').eq('is_dismissed', false);
        if (vehicleId) query = query.eq('vehicle_id', vehicleId);
        const { data, error } = await query.order('due_date');

        if (data && data.length > 0 && !error) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            vehicleId: d.vehicle_id,
            reminderType: d.reminder_type,
            title: d.title,
            description: d.description,
            dueDate: d.due_date,
            dueKm: d.due_km,
            priority: d.priority,
            isCompleted: d.is_completed,
            completedAt: d.completed_at,
            isDismissed: d.is_dismissed,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Failed to load reminders from Supabase:', err);
      }
    }

    const key = vehicleId ? this.getStorageKey('reminders', vehicleId) : 'autosphere_reminders_all';
    const local = localStorage.getItem(key);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    const defaultReminders: VehicleReminder[] = [
      {
        id: 'rem-1',
        userId: 'user-demo',
        vehicleId: vehicleId || 'default-veh',
        reminderType: 'puc',
        title: 'PUC Emission Certificate Expiry Soon',
        description: 'Your 6-month PUC expires on 20 March 2025. Visit any nearby RTO testing centre to avoid ₹10,000 challan.',
        dueDate: '2025-03-20',
        priority: 'high',
        isCompleted: false,
        isDismissed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rem-2',
        userId: 'user-demo',
        vehicleId: vehicleId || 'default-veh',
        reminderType: 'service',
        title: '20,000 km Major Periodic Service Due',
        description: 'Engine oil, oil filter, brake fluid flush, and brake pad inspection scheduled for 20,000 km.',
        dueDate: '2025-04-10',
        dueKm: 20000,
        priority: 'high',
        isCompleted: false,
        isDismissed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rem-3',
        userId: 'user-demo',
        vehicleId: vehicleId || 'default-veh',
        reminderType: 'insurance',
        title: 'Zero-Dep Insurance Policy Renewal',
        description: 'HDFC ERGO Policy HDFC-ERGO-MOT-2024-9182 expires 14 April 2025. Renew early to retain 20% No-Claim Bonus (NCB).',
        dueDate: '2025-04-14',
        priority: 'medium',
        isCompleted: false,
        isDismissed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rem-4',
        userId: 'user-demo',
        vehicleId: vehicleId || 'default-veh',
        reminderType: 'tyres',
        title: 'Tyre Rotation & Wheel Balancing (7,500 km cycle)',
        description: 'Rotate front and rear tyres to prevent uneven shoulder wear.',
        dueDate: '2025-05-01',
        dueKm: 22000,
        priority: 'low',
        isCompleted: false,
        isDismissed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(key, JSON.stringify(defaultReminders));
    return defaultReminders;
  }

  async markReminderComplete(vehicleId: string, reminderId: string): Promise<void> {
    const reminders = await this.getReminders(vehicleId);
    const target = reminders.find(r => r.id === reminderId);
    if (target) {
      target.isCompleted = true;
      target.completedAt = new Date().toISOString();
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('vehicle_reminders')
          .update({ is_completed: true, completed_at: new Date().toISOString() })
          .eq('id', reminderId);
      } catch (err) {
        console.warn('Failed to mark reminder complete in Supabase:', err);
      }
    }

    localStorage.setItem(this.getStorageKey('reminders', vehicleId), JSON.stringify(reminders));
  }

  async dismissReminder(vehicleId: string, reminderId: string): Promise<void> {
    const reminders = await this.getReminders(vehicleId);
    const filtered = reminders.filter(r => r.id !== reminderId);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('vehicle_reminders').update({ is_dismissed: true }).eq('id', reminderId);
      } catch (err) {
        console.warn('Failed to dismiss reminder in Supabase:', err);
      }
    }

    localStorage.setItem(this.getStorageKey('reminders', vehicleId), JSON.stringify(filtered));
  }

  // --------------------------------------------------------------------------
  // MODULE 7: VEHICLE HEALTH DASHBOARD SUMMARY
  // --------------------------------------------------------------------------
  async getHealthSummary(vehicleId: string, currentOdo = 18500): Promise<HealthDashboardSummary> {
    const [passport, schedules, docs] = await Promise.all([
      this.getPassport(vehicleId),
      this.getMaintenanceSchedules(vehicleId, currentOdo),
      this.getDocuments(vehicleId),
    ]);

    let upToDateCount = 0;
    let dueSoonCount = 0;
    let overdueCount = 0;
    let infoMissingCount = 0;
    let totalMaintenanceSpend = 0;

    schedules.forEach(item => {
      totalMaintenanceSpend += item.actualExpenseINR || 0;
      if (item.status === 'up_to_date') upToDateCount++;
      else if (item.status === 'due_soon') dueSoonCount++;
      else if (item.status === 'overdue') overdueCount++;
      else infoMissingCount++;
    });

    const now = new Date();

    // Insurance status calculation
    let insDaysRemaining: number | undefined = undefined;
    let insStatus: any = 'valid';
    if (passport.insuranceExpiryDate) {
      const exp = new Date(passport.insuranceExpiryDate);
      insDaysRemaining = Math.round((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (insDaysRemaining < 0) insStatus = 'expired';
      else if (insDaysRemaining <= 30) insStatus = 'expiring_soon';
    }

    // PUC status calculation
    let pucDaysRemaining: number | undefined = undefined;
    let pucStatus: any = 'valid';
    if (passport.pucExpiryDate) {
      const exp = new Date(passport.pucExpiryDate);
      pucDaysRemaining = Math.round((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (pucDaysRemaining < 0) pucStatus = 'expired';
      else if (pucDaysRemaining <= 15) pucStatus = 'expiring_soon';
    }

    // Document completeness: RC, Insurance, PUC, Purchase Invoice
    const hasRC = docs.some(d => d.category === 'rc');
    const hasIns = docs.some(d => d.category === 'insurance');
    const hasPUC = docs.some(d => d.category === 'puc');
    const hasInvoice = docs.some(d => d.category === 'purchase_invoice' || d.category === 'service_invoice');
    const completenessCount = [hasRC, hasIns, hasPUC, hasInvoice].filter(Boolean).length;
    const documentCompletenessPercent = Math.round((completenessCount / 4) * 100);

    return {
      vehicleId,
      overallScore: passport.healthScore || 92,
      upToDateCount,
      dueSoonCount,
      overdueCount,
      infoMissingCount,
      totalMaintenanceSpendINR: totalMaintenanceSpend,
      lastServiceInfo: {
        date: '2024-04-10',
        km: 10000,
        provider: 'Chrome Motors Mahindra Authorized',
        amountINR: 8450,
      },
      upcomingServiceInfo: {
        dueDate: '2025-04-10',
        dueKm: 20000,
        daysRemaining: 135,
        kmRemaining: 1500,
      },
      insuranceStatus: {
        policyNumber: passport.insurancePolicyNumber,
        provider: passport.insuranceProvider,
        expiryDate: passport.insuranceExpiryDate,
        daysRemaining: insDaysRemaining,
        status: insStatus,
      },
      pucStatus: {
        certificateNumber: passport.pucCertificateNumber,
        expiryDate: passport.pucExpiryDate,
        daysRemaining: pucDaysRemaining,
        status: pucStatus,
      },
      documentCompletenessPercent,
    };
  }
}

export const healthPassportService = new HealthPassportService();
