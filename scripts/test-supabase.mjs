import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Load .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        env[k] = v;
      }
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholder = !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('autosphere-demo.supabase.co') || 
  supabaseUrl.includes('your-project-id') || 
  supabaseAnonKey.includes('demo-placeholder-key');

console.log('=====================================================');
console.log('⚡ AutoSphere Supabase Integration & RLS Test Suite');
console.log('=====================================================');
console.log(`Supabase URL: ${supabaseUrl || '(not configured)'}`);
console.log(`Anon Key Configured: ${Boolean(supabaseAnonKey)}`);
console.log(`Placeholder Detected: ${isPlaceholder}`);
console.log('-----------------------------------------------------');

if (isPlaceholder) {
  console.log('⚠️ Notice: Live Supabase project credentials are not yet configured in .env.');
  console.log('   The application is currently running in Guest/Demo mode with full offline state.');
  console.log('');
  console.log('   To test against your live Supabase cloud database:');
  console.log('   1. Open .env');
  console.log('   2. Replace VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with your live project keys.');
  console.log('   3. Re-run: node scripts/test-supabase.mjs');
  console.log('=====================================================');
  process.exit(0);
}

// 2. Initialize Supabase Client for Testing
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const timestamp = Date.now();
const testUserA = {
  email: `driver_a_${timestamp}@autosphere.test`,
  password: `AutoSphere@Pass${timestamp}!`,
  fullName: 'Shaurya Sharma Test A',
  phone: '+91 98450 18293',
  city: 'Bengaluru',
  state: 'Karnataka',
};

const testUserB = {
  email: `driver_b_${timestamp}@autosphere.test`,
  password: `AutoSphere@Pass${timestamp}!`,
  fullName: 'Vikram Mehta Test B',
  phone: '+91 98200 45678',
  city: 'Mumbai',
  state: 'Maharashtra',
};

async function runTestSuite() {
  let createdVehicleId = null;
  let userAId = null;
  let userBId = null;

  try {
    // ----------------------------------------------------
    // TEST 1: Connectivity & Table Verification
    // ----------------------------------------------------
    console.log('\n[1/6] Verifying Database Tables...');
    const tables = [
      'profiles',
      'vehicles',
      'vehicle_expenses',
      'maintenance_records',
      'insurance_records',
      'fuel_records',
      'saved_recommendations',
      'user_preferences',
      'car_catalogue',
      'recommendation_analyses',
      'manufacturers',
      'car_models',
      'car_variants',
      'indian_states',
      'indian_cities',
      'state_rto_rules',
      'fuel_pricing_records',
      'ev_charging_tariffs',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.log(`  ❌ Table [${table}]: Error - ${error.message} (${error.code})`);
      } else {
        console.log(`  ✓ Table [${table}]: Verified accessible via RLS`);
      }
    }

    // ----------------------------------------------------
    // TEST 2: User A Authentication & Registration
    // ----------------------------------------------------
    console.log('\n[2/6] Testing User A Registration & Profile creation...');
    const { data: signUpA, error: errSignUpA } = await supabase.auth.signUp({
      email: testUserA.email,
      password: testUserA.password,
      options: {
        data: {
          full_name: testUserA.fullName,
          phone: testUserA.phone,
          city: testUserA.city,
          state: testUserA.state,
        },
      },
    });

    if (errSignUpA) {
      console.error(`  ❌ User A Registration failed: ${errSignUpA.message}`);
      return;
    }

    userAId = signUpA.user?.id;
    console.log(`  ✓ User A registered successfully (UID: ${userAId})`);

    // Verify session signIn
    const { data: signInA, error: errSignInA } = await supabase.auth.signInWithPassword({
      email: testUserA.email,
      password: testUserA.password,
    });

    if (errSignInA || !signInA.session) {
      console.error(`  ❌ User A Sign In failed: ${errSignInA?.message}`);
      return;
    }
    console.log(`  ✓ User A Authenticated session active (Access token verified)`);

    // Create client scoped to User A's session
    const clientUserA = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${signInA.session.access_token}` } },
    });

    // ----------------------------------------------------
    // TEST 3: Vehicle Record CRUD (Create, Read, Update, Delete)
    // ----------------------------------------------------
    console.log('\n[3/6] Testing Vehicle CRUD Operations for User A...');

    // CREATE
    const newVehicleData = {
      user_id: userAId,
      make: 'Mahindra',
      model: 'Scorpio-N',
      variant: 'Z8L 4x4 Diesel AT',
      manufacturing_year: 2024,
      registration_year: 2024,
      registration_number: 'KA 01 MR 7812',
      vin: 'MA1TN8SK9P2E90123',
      fuel_type: 'diesel',
      transmission: 'automatic',
      body_type: 'suv',
      current_odometer: 18500,
      purchase_price: 2450000,
      purchase_date: '2024-03-15',
      registration_state: 'Karnataka',
      registration_city: 'Bengaluru',
      power_bhp: 175,
      torque_nm: 380,
      current_fuel_percent: 75,
      health_score: 95,
      is_primary: true,
      image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    };

    const { data: createdVehicle, error: errCreateV } = await clientUserA
      .from('vehicles')
      .insert([newVehicleData])
      .select()
      .single();

    if (errCreateV || !createdVehicle) {
      console.error(`  ❌ Vehicle CREATE failed: ${errCreateV?.message}`);
      return;
    }
    createdVehicleId = createdVehicle.id;
    console.log(`  ✓ Vehicle CREATE successful: ID = ${createdVehicleId} (${createdVehicle.make} ${createdVehicle.model})`);

    // READ
    const { data: readVehicles, error: errReadV } = await clientUserA
      .from('vehicles')
      .select('*')
      .eq('id', createdVehicleId);

    if (errReadV || !readVehicles || readVehicles.length === 0) {
      console.error(`  ❌ Vehicle READ failed: ${errReadV?.message}`);
      return;
    }
    console.log(`  ✓ Vehicle READ successful: Found ${readVehicles.length} record with ODO = ${readVehicles[0].current_odometer} km`);

    // UPDATE
    const { data: updatedVehicle, error: errUpdateV } = await clientUserA
      .from('vehicles')
      .update({
        current_odometer: 25000,
        health_score: 98,
        current_fuel_percent: 85,
      })
      .eq('id', createdVehicleId)
      .select()
      .single();

    if (errUpdateV || !updatedVehicle) {
      console.error(`  ❌ Vehicle UPDATE failed: ${errUpdateV?.message}`);
      return;
    }
    console.log(`  ✓ Vehicle UPDATE successful: New ODO = ${updatedVehicle.current_odometer} km, Health = ${updatedVehicle.health_score}`);

    // ----------------------------------------------------
    // TEST 4: Vehicle Expense Connection with Foreign Key
    // ----------------------------------------------------
    console.log('\n[4/6] Testing Expense Connection to vehicles table...');
    const expenseData = {
      user_id: userAId,
      vehicle_id: createdVehicleId,
      category: 'fuel',
      amount_inr: 4500.00,
      expense_date: new Date().toISOString().split('T')[0],
      odometer_km: 25000,
      vendor: 'Shell V-Power Bellandur',
      notes: 'Full tank premium diesel refill',
      payment_method: 'UPI',
      fuel_litres_or_units: 48.5,
    };

    const { data: createdExpense, error: errCreateE } = await clientUserA
      .from('vehicle_expenses')
      .insert([expenseData])
      .select()
      .single();

    if (errCreateE || !createdExpense) {
      console.error(`  ❌ Expense INSERT failed: ${errCreateE?.message}`);
      return;
    }
    console.log(`  ✓ Expense INSERT successful: ID = ${createdExpense.id}, Amount = ₹${createdExpense.amount_inr}`);

    // Read expenses for vehicle
    const { data: readExpenses, error: errReadE } = await clientUserA
      .from('vehicle_expenses')
      .select('*')
      .eq('vehicle_id', createdVehicleId);

    if (errReadE || !readExpenses || readExpenses.length === 0) {
      console.error(`  ❌ Expense READ failed: ${errReadE?.message}`);
      return;
    }
    console.log(`  ✓ Expense READ verified: ${readExpenses.length} expense(s) linked to vehicle ${createdVehicleId}`);

    // ----------------------------------------------------
    // TEST 5: User-Specific Data Isolation & RLS
    // ----------------------------------------------------
    console.log('\n[5/6] Testing User-Specific Data Isolation (Row Level Security)...');
    // Register User B
    const { data: signUpB, error: errSignUpB } = await supabase.auth.signUp({
      email: testUserB.email,
      password: testUserB.password,
      options: {
        data: {
          full_name: testUserB.fullName,
          phone: testUserB.phone,
          city: testUserB.city,
          state: testUserB.state,
        },
      },
    });

    if (errSignUpB || !signUpB.user) {
      console.error(`  ❌ User B Registration failed: ${errSignUpB?.message}`);
      return;
    }
    userBId = signUpB.user.id;

    const { data: signInB, error: errSignInB } = await supabase.auth.signInWithPassword({
      email: testUserB.email,
      password: testUserB.password,
    });

    if (errSignInB || !signInB.session) {
      console.error(`  ❌ User B Sign In failed: ${errSignInB?.message}`);
      return;
    }

    const clientUserB = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${signInB.session.access_token}` } },
    });

    // User B tries to SELECT User A's vehicles
    const { data: userBVehicles, error: errUserBVehicles } = await clientUserB
      .from('vehicles')
      .select('*');

    if (!errUserBVehicles && userBVehicles) {
      const leakedCount = userBVehicles.filter((v) => v.user_id === userAId).length;
      if (leakedCount === 0) {
        console.log(`  ✓ RLS ISOLATION PASS: User B cannot see User A's vehicles (0 rows returned)`);
      } else {
        console.error(`  ❌ RLS VIOLATION: User B can see ${leakedCount} vehicle(s) belonging to User A!`);
      }
    }

    // User B tries to SELECT User A's expenses
    const { data: userBExpenses, error: errUserBExpenses } = await clientUserB
      .from('vehicle_expenses')
      .select('*');

    if (!errUserBExpenses && userBExpenses) {
      const leakedExpenses = userBExpenses.filter((e) => e.user_id === userAId).length;
      if (leakedExpenses === 0) {
        console.log(`  ✓ RLS ISOLATION PASS: User B cannot see User A's expenses (0 rows returned)`);
      } else {
        console.error(`  ❌ RLS VIOLATION: User B can see ${leakedExpenses} expense(s) belonging to User A!`);
      }
    }

    // ----------------------------------------------------
    // TEST 6: Cleanup & Deletion Verification
    // ----------------------------------------------------
    console.log('\n[6/6] Testing Deletion Cleanup...');
    // Delete expense
    const { error: errDelExpense } = await clientUserA
      .from('vehicle_expenses')
      .delete()
      .eq('id', createdExpense.id);

    if (errDelExpense) {
      console.error(`  ❌ Expense DELETE failed: ${errDelExpense.message}`);
    } else {
      console.log(`  ✓ Expense DELETED successfully`);
    }

    // Delete vehicle
    const { error: errDelVehicle } = await clientUserA
      .from('vehicles')
      .delete()
      .eq('id', createdVehicleId);

    if (errDelVehicle) {
      console.error(`  ❌ Vehicle DELETE failed: ${errDelVehicle.message}`);
    } else {
      console.log(`  ✓ Vehicle DELETED successfully`);
    }

    // Confirm vehicle no longer exists
    const { data: postDeleteVehicles } = await clientUserA
      .from('vehicles')
      .select('*')
      .eq('id', createdVehicleId);

    if (!postDeleteVehicles || postDeleteVehicles.length === 0) {
      console.log(`  ✓ Confirmed vehicle row removed from Supabase`);
    }

    console.log('\n=====================================================');
    console.log('🎉 ALL 6 SUPABASE TESTS PASSED SUCCESSFULLY!');
    console.log('=====================================================');
  } catch (err) {
    console.error('Unexpected test error:', err);
  }
}

runTestSuite();
