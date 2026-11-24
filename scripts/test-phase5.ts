// scripts/test-phase5.ts
// Comprehensive Test Suite for AutoSphere Phase 5: Digital Vehicle Passport & Vehicle Health Tracker

// In Node.js environment, provide memory localStorage polyfill before importing service
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] || null,
    get length() {
      return store.size;
    },
  };
}

import {
  healthPassportService,
  DEFAULT_MAINTENANCE_SCHEDULE_TEMPLATES,
} from '../src/services/healthPassportService';
import {
  VehiclePassportData,
  HealthSubsystem,
  HealthStatus,
  DocumentCategory,
} from '../src/types/passport.types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

async function runPhase5Tests() {
  console.log('========================================================================');
  console.log('⚡ AutoSphere Phase 5: Digital Vehicle Passport & Vehicle Health Tests');
  console.log('========================================================================');

  const testVehicleId = 'test-veh-xuv700';

  // Seed test vehicle passport
  await healthPassportService.updatePassport(testVehicleId, {
    id: `passport-${testVehicleId}`,
    userId: 'test-user-phase5',
    make: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 L AWD',
    manufacturingYear: 2023,
    registrationYear: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    bodyType: 'suv',
    regNumber: 'KA 01 MR 7812',
    registrationState: 'Karnataka',
    registrationCity: 'Bengaluru',
    rtoCode: 'KA-01',
    purchaseDate: '2023-04-15',
    purchasePriceINR: 2450000,
    currentOdometer: 18500,
    chassisNumber: 'MA1TN8SK9P2E90123',
    engineNumber: 'mHawk22L78912',
    previousOwnersCount: 1,
    color: 'Midnight Black',
    photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341'],
    insurancePolicyNumber: 'HDFC-ERGO-GEN-789123',
    insuranceProvider: 'HDFC ERGO General Insurance',
    insuranceExpiryDate: '2027-05-20',
    pucCertificateNumber: 'PUC-KA-2024-91283',
    pucExpiryDate: '2027-02-18',
    healthScore: 92,
    isPrimary: true,
  });

  // Seed test docs for test-veh-xuv700
  await healthPassportService.saveDocument({
    id: 'doc-rc',
    vehicleId: testVehicleId,
    category: 'rc',
    title: 'Registration Certificate',
    documentNumber: 'KA01-2023-00912',
    storagePath: `vehicle-documents/${testVehicleId}/rc.pdf`,
  });
  await healthPassportService.saveDocument({
    id: 'doc-ins',
    vehicleId: testVehicleId,
    category: 'insurance',
    title: 'Comprehensive Insurance Policy',
    documentNumber: 'HDFC-ERGO-9912',
    storagePath: `vehicle-documents/${testVehicleId}/insurance.pdf`,
  });
  await healthPassportService.saveDocument({
    id: 'doc-puc',
    vehicleId: testVehicleId,
    category: 'puc',
    title: 'PUC Certificate',
    documentNumber: 'PUC-KA-9912',
    storagePath: `vehicle-documents/${testVehicleId}/puc.pdf`,
  });

  // Seed test timeline events
  const timelineKey = `autosphere_timeline_${testVehicleId}`;
  localStorage.setItem(timelineKey, JSON.stringify([
    {
      id: 'evt-1',
      vehicleId: testVehicleId,
      date: '2026-10-15',
      title: 'Periodic 20,000 km Service',
      category: 'service',
      odometerKm: 18000,
      costINR: 8500,
      description: 'Engine oil and filter change',
      provider: 'Sireesh Auto',
    },
    {
      id: 'evt-2',
      vehicleId: testVehicleId,
      date: '2026-06-10',
      title: 'PUC Emission Testing',
      category: 'puc',
      odometerKm: 14000,
      costINR: 120,
      description: 'Passed Bharat Stage VI test',
      provider: 'HPCL Fuel Station',
    },
    {
      id: 'evt-3',
      vehicleId: testVehicleId,
      date: '2026-04-10',
      title: 'Insurance Renewal',
      category: 'insurance',
      odometerKm: 12000,
      costINR: 32000,
      description: 'Zero dep policy renewed',
      provider: 'HDFC ERGO',
    },
  ]));

  // Seed test reminders
  const remindersKey = `autosphere_reminders_${testVehicleId}`;
  localStorage.setItem(remindersKey, JSON.stringify([
    {
      id: 'rem-1',
      vehicleId: testVehicleId,
      title: 'Annual Service Due',
      description: 'Engine oil change',
      reminderType: 'service',
      dueDate: '2027-04-15',
      priority: 'high',
      isCompleted: false,
    },
    {
      id: 'rem-2',
      vehicleId: testVehicleId,
      title: 'PUC Renewal',
      description: 'Emission test due',
      reminderType: 'puc',
      dueDate: '2027-02-15',
      priority: 'medium',
      isCompleted: false,
    },
    {
      id: 'rem-3',
      vehicleId: testVehicleId,
      title: 'Insurance Renewal',
      description: 'Comprehensive policy',
      reminderType: 'insurance',
      dueDate: '2027-05-20',
      priority: 'high',
      isCompleted: false,
    },
  ]));

  // ------------------------------------------------------------------------
  // MODULE 1: DIGITAL VEHICLE PASSPORT
  // ------------------------------------------------------------------------
  console.log('\n[1/7] Testing Digital Vehicle Passport Module...');
  const passport = await healthPassportService.getPassport(testVehicleId);
  
  assert(Boolean(passport), 'Successfully retrieved vehicle passport');
  assert(Boolean(passport.make && passport.model && passport.variant), 'Contains make, model and variant', `${passport.make} ${passport.model}`);
  assert(passport.manufacturingYear >= 2010 && passport.manufacturingYear <= 2026, 'Valid manufacturing year', `${passport.manufacturingYear}`);
  assert(['petrol', 'diesel', 'cng', 'electric', 'hybrid'].includes(passport.fuelType), 'Valid fuel type', passport.fuelType);
  assert(['manual', 'automatic'].includes(passport.transmission), 'Valid transmission type', passport.transmission);
  assert(Boolean(passport.regNumber && passport.regNumber.length >= 8), 'Valid Indian registration number', passport.regNumber);
  assert(Boolean(passport.registrationState && passport.registrationCity), 'Location state and city present', `${passport.registrationCity}, ${passport.registrationState}`);
  assert(Boolean(passport.rtoCode), 'RTO code is present', passport.rtoCode);
  assert(typeof passport.currentOdometer === 'number' && passport.currentOdometer > 0, 'Current odometer is a positive number', `${passport.currentOdometer} km`);
  assert(typeof passport.purchasePriceINR === 'number' && passport.purchasePriceINR > 0, 'Purchase price in INR is present', `₹${passport.purchasePriceINR}`);

  // Test Additional Info fields
  assert(Boolean(passport.chassisNumber), 'VIN / Chassis number present', passport.chassisNumber);
  assert(Boolean(passport.engineNumber), 'Engine number present', passport.engineNumber);
  assert(typeof passport.previousOwnersCount === 'number', 'Previous owners count recorded', `${passport.previousOwnersCount}`);
  assert(Boolean(passport.color), 'Vehicle color specified', passport.color);
  assert(Array.isArray(passport.photos) && passport.photos.length > 0, 'Photo gallery array populated', `${passport.photos.length} photos`);

  // Test Update Passport
  const updatedNotes = 'Tested via Phase 5 automated suite - scheduled for detailing next week.';
  const updatedPassport = await healthPassportService.updatePassport(testVehicleId, {
    notes: updatedNotes,
    color: 'Midnight Black Metallic',
    currentOdometer: 18500,
  });
  assert(updatedPassport.notes === updatedNotes, 'Passport notes updated successfully');
  assert(updatedPassport.color === 'Midnight Black Metallic', 'Passport color updated successfully');
  assert(updatedPassport.currentOdometer === 18500, 'Passport odometer updated successfully');

  // ------------------------------------------------------------------------
  // MODULE 2: OEM BENCHMARK SCHEDULES & HEALTH STATUS ENGINE
  // ------------------------------------------------------------------------
  console.log('\n[2/7] Testing OEM Benchmark Maintenance Schedules...');
  assert(DEFAULT_MAINTENANCE_SCHEDULE_TEMPLATES.length >= 6, 'Contains at least 6 standard subsystem benchmarks', `Found ${DEFAULT_MAINTENANCE_SCHEDULE_TEMPLATES.length}`);

  const requiredSubsystems: HealthSubsystem[] = ['engine', 'battery', 'tyres', 'brakes', 'transmission', 'ac'];
  for (const sub of requiredSubsystems) {
    const found = DEFAULT_MAINTENANCE_SCHEDULE_TEMPLATES.some(t => t.subsystem === sub);
    assert(found, `Template covers subsystem: ${sub.toUpperCase()}`);
  }

  console.log('\n[3/7] Testing Deterministic Health Status Engine (calculateHealthStatus)...');
  // Case A: Up to date (serviced 1 month ago, 1,000 km ago)
  const statusUpToDate = healthPassportService.calculateHealthStatus(
    '2026-10-01',
    17500,
    12,
    10000,
    18500
  );
  assert(statusUpToDate === 'up_to_date', 'Status is "up_to_date" when service is fresh and within limits', statusUpToDate);

  // Case B: Overdue by date (serviced 2 years ago)
  const statusOverdueDate = healthPassportService.calculateHealthStatus(
    '2024-01-01',
    10000,
    12,
    10000,
    14000
  );
  assert(statusOverdueDate === 'overdue', 'Status is "overdue" when target date has passed', statusOverdueDate);

  // Case C: Overdue by odometer
  const statusOverdueOdo = healthPassportService.calculateHealthStatus(
    '2026-10-01',
    10000,
    12,
    10000,
    21500 // Odometer delta is 11,500 > 10,000 km interval
  );
  assert(statusOverdueOdo === 'overdue', 'Status is "overdue" when odometer exceeds target km', statusOverdueOdo);

  // Case D: Due soon by km (within 1000 km of 10,000 km interval)
  const statusDueSoonKm = healthPassportService.calculateHealthStatus(
    '2026-10-01',
    10000,
    12,
    10000,
    19300 // delta is 9,300 km -> 700 km remaining (<= 1000 km)
  );
  assert(statusDueSoonKm === 'due_soon', 'Status is "due_soon" when within 1,000 km of service', statusDueSoonKm);

  // Case E: Information missing
  const statusMissing = healthPassportService.calculateHealthStatus(
    undefined,
    undefined,
    12,
    10000,
    18000
  );
  assert(statusMissing === 'info_missing', 'Status is "info_missing" when no service records exist', statusMissing);

  // ------------------------------------------------------------------------
  // MODULE 3: DIGITAL DOCUMENT VAULT
  // ------------------------------------------------------------------------
  console.log('\n[4/7] Testing Digital Document Vault...');
  const initialDocs = await healthPassportService.getDocuments(testVehicleId);
  assert(initialDocs.length > 0, 'Loaded initial document vault records', `${initialDocs.length} documents found`);

  const requiredDocCategories: DocumentCategory[] = ['rc', 'insurance', 'puc'];
  for (const cat of requiredDocCategories) {
    const hasCat = initialDocs.some(d => d.category === cat);
    assert(hasCat, `Vault contains required compliance document category: ${cat.toUpperCase()}`);
  }

  // Test adding a document
  const testDoc = await healthPassportService.saveDocument({
    vehicleId: testVehicleId,
    category: 'warranty',
    title: 'Extended 5-Year Shield Warranty',
    documentNumber: 'WARR-MAH-2024-5510',
    expiryDate: '2029-04-15',
    storagePath: 'vehicle-documents/test/warranty-certificate.pdf',
    notes: 'Covers powertrain and high-voltage electronics',
  });
  assert(Boolean(testDoc && testDoc.id), 'Successfully added document to vault', testDoc.id);

  const docsAfterAdd = await healthPassportService.getDocuments(testVehicleId);
  const foundAdded = docsAfterAdd.some(d => d.id === testDoc.id);
  assert(foundAdded, 'Newly saved document retrieved from vault query');

  // Test deleting the document
  await healthPassportService.deleteDocument(testVehicleId, testDoc.id);
  const docsAfterDelete = await healthPassportService.getDocuments(testVehicleId);
  assert(!docsAfterDelete.some(d => d.id === testDoc.id), 'Document removed cleanly from vault');

  // ------------------------------------------------------------------------
  // MODULE 4: CHRONOLOGICAL MAINTENANCE TIMELINE
  // ------------------------------------------------------------------------
  console.log('\n[5/7] Testing Chronological Maintenance Timeline...');
  const timeline = await healthPassportService.getTimelineEvents(testVehicleId);
  assert(timeline.length >= 3, 'Timeline contains chronological vehicle event history', `${timeline.length} events`);

  // Verify reverse chronological order (newest first)
  let isSorted = true;
  for (let i = 0; i < timeline.length - 1; i++) {
    if (new Date(timeline[i].date).getTime() < new Date(timeline[i + 1].date).getTime()) {
      isSorted = false;
      break;
    }
  }
  assert(isSorted, 'Timeline events are strictly sorted in reverse chronological order (newest first)');

  // Test category filtering
  const pucEvents = await healthPassportService.getTimelineEvents(testVehicleId, 'puc');
  assert(pucEvents.every(e => e.category === 'puc'), 'Timeline filtering by category "puc" returns only PUC events');

  // ------------------------------------------------------------------------
  // MODULE 5: SMART IN-APP REMINDERS
  // ------------------------------------------------------------------------
  console.log('\n[6/7] Testing Smart In-App Reminders Module...');
  const reminders = await healthPassportService.getReminders(testVehicleId);
  assert(reminders.length >= 3, 'Retrieved active reminders list', `${reminders.length} reminders`);

  const reminderToComplete = reminders[0];
  await healthPassportService.markReminderComplete(testVehicleId, reminderToComplete.id);
  const updatedReminders = await healthPassportService.getReminders(testVehicleId);
  const completedItem = updatedReminders.find(r => r.id === reminderToComplete.id);
  assert(Boolean(completedItem?.isCompleted), 'Successfully marked reminder as complete');

  // ------------------------------------------------------------------------
  // MODULE 6: MAINTENANCE SERVICE LOGGING & ZERO-DUPLICATION EXPENSE SYNC
  // ------------------------------------------------------------------------
  console.log('\n[7/7] Testing Service Logging & Expense Synchronization...');
  const schedules = await healthPassportService.getMaintenanceSchedules(testVehicleId, 18500);
  assert(schedules.length >= 6, 'Retrieved active maintenance schedules', `${schedules.length} subsystems tracked`);

  const engineSchedule = schedules.find(s => s.subsystem === 'engine') || schedules[0];
  const serviceCost = 7400;
  const serviceDate = '2026-11-20';
  const serviceOdo = 18500;

  // Log maintenance service event
  await healthPassportService.logMaintenanceServiceEvent({
    vehicleId: testVehicleId,
    subsystem: engineSchedule.subsystem,
    itemName: engineSchedule.itemName,
    serviceDate: serviceDate,
    odometerKm: serviceOdo,
    expenseINR: serviceCost,
    serviceProvider: 'Sireesh Auto Mahindra Authorized Centre',
    technicianNotes: 'Replaced synthetic engine oil (6L) and oil filter element.',
    createExpenseRecord: true,
  });

  const refreshedSchedules = await healthPassportService.getMaintenanceSchedules(testVehicleId, serviceOdo);
  const updatedScheduleItem = refreshedSchedules.find(s => s.subsystem === engineSchedule.subsystem && s.itemName === engineSchedule.itemName)!;
  assert(Boolean(updatedScheduleItem), 'Found updated schedule item after logging');
  assert(updatedScheduleItem.lastServiceDate === serviceDate, 'Schedule updated with last service date');
  assert(updatedScheduleItem.lastServiceKm === serviceOdo, 'Schedule updated with last service odometer');
  assert(updatedScheduleItem.status === 'up_to_date', 'Subsystem health status automatically flipped to "up_to_date"');
  assert(updatedScheduleItem.recommendedNextKm === serviceOdo + engineSchedule.intervalKm, 'Next service odometer computed deterministically');

  // Verify health summary metrics calculation
  const summary = await healthPassportService.getHealthSummary(testVehicleId, serviceOdo);
  assert(summary.overallScore >= 80 && summary.overallScore <= 100, 'Calculated overall vehicle health score', `${summary.overallScore}/100`);
  assert(summary.upToDateCount >= 1, 'Up to date subsystems count tracked', `${summary.upToDateCount}`);
  assert(typeof summary.pucStatus.expiryDate === 'string', 'PUC validity date reported');
  assert(typeof summary.insuranceStatus.expiryDate === 'string', 'Insurance validity date reported');
  assert(typeof summary.totalMaintenanceSpendINR === 'number', 'Total maintenance spend computed');
  assert(typeof summary.documentCompletenessPercent === 'number', 'Document completeness percentage calculated');

  // Summary Report
  console.log('\n========================================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL AUTO-SPHERE PHASE 5 TESTS PASSED WITH 100% SUCCESS!\n');
  }
}

runPhase5Tests().catch(err => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
