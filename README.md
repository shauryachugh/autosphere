# AutoSphere — India-Wide Automotive Intelligence Platform

**AutoSphere** is a premium, modern dark automotive SaaS web application engineered for Indian car owners. It unifies vehicle telemetry, Total Cost of Ownership (TCO) tracking, predictive health monitoring, AI-powered replacement recommendations, and used car fair market valuation into a single cloud-connected platform.

---

## ⚡ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 (chunk-optimized with manual vendor code-splitting)
- **Styling**: Tailwind CSS (Dark automotive theme: Charcoal/Obsidian surfaces, subtle borders, electric cyan/blue accents)
- **Routing**: React Router v6 with Protected Route Guards
- **Data Visualization**: Recharts (Monthly TCO bar chart, category share donut chart)
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL 15+)
- **Authentication**: Supabase Auth (Email & Password, password recovery, session persistence via LocalStorage)
- **Security**: Supabase Row Level Security (RLS) on all user data tables

---

## 🔐 Phase 2: Backend, Database & Authentication

AutoSphere Phase 2 integrates **Supabase** as the cloud database and identity provider:

### 1. Authentication System
- **Email/Password Registration**: Full sign-up flow with user profile creation (Full name, phone, home city, state).
- **Secure Login**: Session-based credentials with automatic JWT token refresh.
- **Persistent Sessions**: Authenticated state survives page refreshes and browser restarts (`localStorage` + `onAuthStateChange`).
- **Password Recovery**: Complete `/forgot-password` request and `/reset-password` reset flow.
- **Protected Routes**: `<ProtectedRoute>` wrapper automatically intercepts unauthenticated visits and redirects to `/login` with clean loading states.
- **Interactive Demo / Guest Mode**: Instant 1-click preview mode allowing users to explore the full platform even when live Supabase credentials are not connected.

### 2. PostgreSQL Database Schema (8 Relational Tables)
All tables reside under the public schema in PostgreSQL and have strict foreign key constraints referencing `auth.users(id)`:
1. **`profiles`**: User metadata, full name, phone number, city, state, preferred currency (INR), avatar.
2. **`vehicles`**: Stores full vehicle specifications:
   - `make`, `model`, `variant`
   - `manufacturing_year`, `registration_year`
   - `fuel_type`, `transmission`
   - `current_odometer`, `purchase_price_inr`, `purchase_date`
   - `registration_state`, `registration_city`, `registration_number`
   - `health_score`, `fuel_efficiency`, `tpms_pressures`, `is_primary`
3. **`vehicle_expenses`**: Granular expense logging (Fuel, Maintenance, Insurance, Toll, Accessories, Tuning) with odometer readings, receipt URLs, and payment methods.
4. **`maintenance_records`**: Service history, garage/workshop name, service type, labor/parts cost breakdown, and next service reminder mileage.
5. **`insurance_records`**: Policy number, provider (ICICI Lombard, HDFC ERGO, Tata AIG, etc.), IDV (Insured Declared Value), premium paid, expiry dates.
6. **`fuel_records`**: Fuel fill-up volume (L / kWh), cost per unit, full-tank indicator, and calculated real-world efficiency.
7. **`saved_recommendations`**: User-saved prospective vehicle upgrades with custom notes.
8. **`user_preferences`**: WhatsApp alert toggles, PUC/service reminders, theme preferences.

### 3. Row Level Security (RLS) Policies
- Every table has `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`.
- Users can **only read, insert, update, and delete their own records**:
  ```sql
  CREATE POLICY "Users can only view their own vehicles"
    ON public.vehicles FOR SELECT
    USING (auth.uid() = user_id);
  ```
- No service role keys are exposed to the browser. Only the public `anon` key is used with RLS enforcement.
- Database trigger `on_auth_user_created` automatically inserts an initialized row into `profiles` upon new user sign-up.

---

## 🚀 Key Application Pages

### 1. Authentication
- `/login`: Secure sign-in with email/password and 1-click Demo mode.
- `/register`: User onboarding with Indian city & state selection.
- `/forgot-password`: Password reset request via email.
- `/reset-password`: Set new password after following reset link.

### 2. Core Platform Pages
- **Dashboard (`/`)**: Hero vehicle telematics, HSRP plate preview, real-time SoC/fuel, TPMS pressure visualizer, monthly expenditure chart, recent activity, and quick actions.
- **Smart Car Recommendations (`/recommendations`)**: TCO driving habit simulator, powertrain filters, and side-by-side comparison modal with Bharat NCAP safety benchmarks.
- **Ownership Cost Intelligence (`/ownership-cost`)**: Granular expense breakdown, Recharts visual analytics, searchable transaction ledger, and CSV ledger export.
- **My Garage (`/garage`)**: Multi-vehicle fleet manager, Add Vehicle Wizard with complete Indian vehicle metadata, DigiLocker document vault with expiry tracking, and service intervals.
- **Vehicle Health & Telematics (`/vehicle-health`)**: ECU health score gauge, direct TPMS 4-wheel visualizer, DTC error code lookup, and live OBD-II diagnostic scan simulator.
- **SphereAI Automotive Co-Pilot (`/ai-assistant`)**: Context-aware AI chatbot specializing in Indian OEM schedules, RTO Parivahan norms, and FASTag queries.
- **Buy & Sell Verified Marketplace (`/buy-sell`)**: Algorithmic Indian used car fair market valuation engine with dealer vs private buyer breakdown.
- **Curated Accessories Hub (`/accessories`)**: Verified hardware (4K Dashcams, Tyre Inflators, 7.4 kW EV Wallboxes, 7D Mats) with fitment tags and cart checkout.
- **Profile & Settings (`/settings`)**: Driver profile, active Supabase session card with user UID and RLS indicator, NETC FASTag wallet manager with UPI top-up, and connected car sync (*AdrenoX, iRA, Bluelink, Suzuki Connect*).

---

## 🚗 Phase 3: Smart Car Replacement Intelligence

AutoSphere Phase 3 introduces the platform's flagship financial intelligence capability: **Smart Car Replacement Intelligence**. It evaluates a car owner's current real-world running and maintenance expenditures and computes whether replacement makes financial sense when factoring in new car on-road prices, state RTO taxes, loan interest, depreciation, and future wear-and-tear escalation.

### 1. Architectural Modules
1. **Module 1: Current Vehicle Analysis**:
   - 1-click auto-retrieval of existing garage vehicle telemetry, odometer, and aggregated logged fuel, maintenance, repair, and insurance expenses.
   - Interactive manual overrides for fair market resale value, monthly commute distance, and city/highway driving split.
   - Instant Baseline TCO strip: Monthly spend, annual spend, fuel cost per km, and estimated 3-year/5-year baseline ownership expenditure.

2. **Module 2: Replacement Requirements**:
   - Financial constraints: Maximum on-road budget, preferred monthly EMI ceiling, available down payment, and optional toggle to roll current car resale proceeds directly into down payment.
   - Financing setup: Loan tenure slider (1 to 7 years) and interest rate slider (7.5% to 15.0% p.a.).
   - Powertrain & vehicle criteria: Preferred fuel type (Petrol, Diesel, CNG, Strong Hybrid, Electric, or Any), transmission (Manual, Automatic, or Any), and vehicle category (Hatchback, Sedan, SUV, MPV).
   - Localized context: State and city selection for RTO road tax calculation and commute split (City % vs Highway %).

3. **Module 3: Deterministic Financial Calculation Engine**:
   - **Zero AI Hallucinations**: 100% deterministic TypeScript formulas for all financial figures.
   - **State RTO Tax Models**: Exact regional road tax logic (e.g. 0% road tax for EVs in Karnataka and Delhi; 0% for Strong Hybrids in UP; 15-18% for high-displacement Diesel in Karnataka; 10% for sub-10L Petrol in Delhi).
   - **Standard Compound Loan EMI**: Exact formula \(E = P \cdot r \cdot (1+r)^n / ((1+r)^n - 1)\) computing monthly EMI and total borrowing interest.
   - **Net TCO (No Double-Counting)**: Avoids double-counting loan principal and vehicle purchase price. True Economic TCO = Net Vehicle Depreciation (On-Road minus Resale Value) + Total Loan Interest + Total Operating Costs (Fuel/Energy + Maintenance + Insurance).

4. **Module 4: Indian Car Recommendation Engine**:
   - Comprehensive structured catalogue across 11 major OEMs in India: **Tata Motors, Maruti Suzuki, Mahindra, Hyundai, Toyota, Kia, Honda, Skoda, Volkswagen, MG Motor, and Renault**.
   - Covers all 5 powertrains: Petrol, Diesel, CNG, Strong Hybrid, and Electric.
   - Rich vehicle metadata: Ex-showroom price, state on-road price, ARAI/MIDC range or mileage, power/torque, Bharat NCAP crash safety rating, annual maintenance schedule, annual insurance estimate, 3-year and 5-year resale retention percentages.

5. **Module 5: Transparent Weighted Ranking System**:
   - Multi-factor evaluation:
     - Budget Compatibility (25%)
     - Monthly Cash-Flow Affordability (25%)
     - 5-Year Net TCO Advantage (20%)
     - Fuel & Running Cost Efficiency (10%)
     - Expected Resale Value Retention (10%)
     - Powertrain & Category Preference Match (10%)
   - Displays composite match score (0-100) and transparent "Why Recommended" rationales.

6. **Module 6: Head-to-Head Comparison Dashboard**:
   - Side-by-side matrix comparing the user's current vehicle against up to 3 chosen replacement candidates.
   - Interactive Recharts visualisations:
     - **5-Year Cumulative TCO Breakdown**: Stacked bar chart showing Net Depreciation, Loan Interest, Fuel Expenses, and Maintenance/Insurance.
     - **Monthly Out-of-Pocket Cash Flow**: Grouped comparison of monthly EMI, monthly fuel/charging, and monthly maintenance reserves.

7. **Module 7: Rigorous Final Verdict Engine**:
   - Never advises replacement merely because a new car consumes less fuel or needs fewer oil changes.
   - Evaluates the 5-year net cost differential against capital lock-in, RTO road taxes, dealer margins, and loan interest.
   - Generates one of three definitive outcomes:
     - 🛡️ **`KEEP YOUR CURRENT CAR`**: Replacement does not justify the capital expenditure and loan interest burden.
     - ⚖️ **`CONSIDER UPGRADING`**: Marginal financial variance; justified primarily if the current car is aging (> 8 years, > 1,10,000 km) or incurs escalating repairs.
     - 🚀 **`REPLACEMENT MAY BE FINANCIALLY BENEFICIAL`**: High monthly commuting distance combined with switching to EV/Hybrid/CNG creates substantial net savings (> ₹1,00,000 over 5 years).
   - Includes transparent balance sheet comparison, calculated savings/cost delta, and 3-step action plan with plain-text report export.

8. **Module 8: Supabase Database Integration**:
   - `car_catalogue`: Centralized vehicle models and variants for Indian-market expansion.
   - `recommendation_analyses`: Stores user analyses, current vehicle telemetry, selected requirements, ranked recommendations, compared vehicles, and verdict history.
   - Protected by Row Level Security (`auth.uid() = user_id`) and indexed for rapid retrieval.
   - Offline fallback: Seamless guest mode persistence via `localStorage` when running without cloud credentials.

---

## 🇮🇳 Phase 4: India Automotive Database & Pricing Engine

AutoSphere Phase 4 provisions the dedicated, structured Indian automotive reference database and modular on-road pricing infrastructure:

### 1. Architectural Modules
1. **Module 1: Manufacturer Database**:
   - Structured registry of passenger vehicle OEMs operating in India: **Maruti Suzuki, Hyundai, Tata Motors, Mahindra, Kia, Toyota, Honda, Skoda, Volkswagen, Renault, MG Motor, and Nissan**.
   - Stores corporate headquarters, year established in India, customer care hotline, official portal, and Indian market share percentage.

2. **Module 2: Car Model Database**:
   - Models indexed across vehicle categories: SUV, Sedan, Hatchback, MPV, and Crossover.
   - Tracks launch year, active market status, powertrain availability, transmission choices, Bharat NCAP / Global NCAP safety ratings, and high-resolution imagery.

3. **Module 3: Variant Database**:
   - Granular variant-level engineering specifications:
     - Engine displacement (cc) or high-voltage battery capacity (kWh).
     - Power (bhp), Torque (Nm), ARAI certified mileage (km/l, km/kg) or electric driving range (km/charge).
     - Seating capacity (5, 6, 7 seats), Ground Clearance (mm), and Boot Space (litres).
     - Realistic ex-showroom baseline pricing, annual periodic maintenance schedules, and comprehensive insurance estimates.

4. **Module 4: India Location Database**:
   - Complete coverage of **all 28 Indian States and 8 Union Territories** (36 jurisdictions).
   - Detailed city catalogue mapping state associations, metro status, municipal parking charges, and RTO series prefixes (e.g. `KA-01` to `KA-53`, `DL-01` to `DL-14`, `MH-01` to `MH-50`, `TN-01` to `TN-99`).
   - Reusable `SearchableLocationSelect` component with fast typeahead and instant city/state linkage.

5. **Module 5: Modular On-Road Price Engine**:
   - Completely decoupled from UI logic in [`src/utils/pricingEngine.ts`](file:///c:/Users/shaur/autosphere/src/utils/pricingEngine.ts).
   - Configurable state RTO tax rules:
     - *Electric Vehicles*: 0% road tax in Karnataka, Delhi, and Tamil Nadu.
     - *Strong Hybrids*: 0% road tax waiver in Uttar Pradesh; preferential rates in Maharashtra.
     - *Diesel*: Higher RTO tax brackets (15.5% - 18.5% in Karnataka + 11% Infra Cess).
     - *TCS*: 1% Tax Collected at Source on ex-showroom values exceeding ₹10,00,000.
     - *FASTag & Plates*: ₹500 mandatory FASTag + ₹1,800 HSRP laser plates and smart card registration.
     - *Insurance*: 1-Year Own Damage (OD) + 3-Year Mandatory Third-Party (TP) with Zero Depreciation toggle.
   - Multi-state tax comparison matrix showing on-road variance and state subsidy savings across India.

6. **Module 6: Fuel and EV Charging Tariffs Database**:
   - Real-world petrol, diesel, and CNG tariffs recorded across Indian states and cities.
   - State Discom electricity tariffs for domestic AC wallbox charging (e.g. BESCOM in KA ₹8.15, MSEDCL in MH ₹8.80, TPDDL in DL ₹6.50) vs public DC fast chargers (₹18 - ₹24/kWh).
   - Accurate running cost per kilometre calculation (`calculateLocationRunningCostPerKm`).

7. **Interactive Vehicle & Pricing Explorer**:
   - New dedicated route: `/pricing` ([`src/pages/PricingCatalogue.tsx`](file:///c:/Users/shaur/autosphere/src/pages/PricingCatalogue.tsx))
   - Live location selector dynamically recalculates on-road pricing in real-time across the entire Indian catalogue.
   - Modal deep-dive breakdown with itemized government levies, insurance schedule, and side-by-side all-India state tax comparison.

---

## 📋 Phase 5: Digital Vehicle Passport & Vehicle Health Tracker

AutoSphere Phase 5 introduces a comprehensive, tamper-evident **Digital Vehicle Passport** and deterministic **Vehicle Health Management System** engineered specifically for Indian car owners:

### 1. Module 1: Digital Vehicle Passport (`/passport`)
- **Vehicle Identity Certificate**: Verified specifications card including OEM, Model, Variant, Manufacturing Year, Fuel Type, Transmission, Registration Number, State, City, RTO Code, Purchase Date, Purchase Price, and Current Odometer.
- **Comprehensive Records**: Chassis/VIN, Engine Number, Previous Owners count, Color, High Security Registration Plate (HSRP) preview, and Verified Ownership QR verification badge.
- **Interactive Management**: Modal interface allowing owners to update notes, odometer, color, and photos with instant persistence to Supabase and local cache.

### 2. Module 2: Subsystem Health Tracker (`/vehicle-health`)
- **Subsystem-Level Health Tracking**: Categorized tracking across six vehicle subsystems:
  1. *Engine*: Engine oil & filter, air filter, coolant & radiator flushes.
  2. *Battery*: 12V auxiliary battery inspection, resting voltage test (>12.6V), terminal corrosion checks.
  3. *Tyres*: Tyre rotation (7,500 km cycle), digital wheel alignment, tread depth measurement (>2.5 mm).
  4. *Brakes*: Brake pad thickness inspection, rotor runout, DOT 4 brake fluid flush.
  5. *Transmission*: Manual/automatic gear oil inspection and driveline lubrication.
  6. *Air Conditioning*: Cabin pollen filter, refrigerant recharge (R134a/R1234yf), evaporator core sanitization.
- **Deterministic Health Status Engine**: Evaluates service intervals deterministically against recorded dates and current odometer reading:
  - 🟢 **Up to Date**: Recently serviced, within acceptable calendar and mileage thresholds.
  - 🟡 **Due Soon**: Within 30 days or within 1,000 km of OEM service milestone.
  - 🔴 **Overdue**: Service milestone passed by calendar date or odometer reading.
  - ⚪ **Information Missing**: Subsystem with no recorded maintenance baseline.
  *(Note: AutoSphere clearly denotes service intervals based on OEM benchmarks and mechanic records, without claiming unverified OBD mechanical diagnoses).*
- **Customizable Maintenance Schedules**: Car owners can modify service intervals (months/kilometres) to match OEM manuals or trusted mechanic advice.

### 3. Module 3: Digital Document Vault (`/documents`)
- **Secure Cloud Storage**: Dedicated vault for all vehicle paperwork: Registration Certificate (RC), Comprehensive/Zero-Dep Insurance, PUC Certificate, Purchase Tax Invoice, Service Bills, and Extended Warranty.
- **Compliance Intelligence**: Real-time expiry countdowns, status indicators (Valid, Expiring Soon, Expired), and Document Completeness score.
- **Privacy & RLS**: All documents reference private Supabase storage paths (`vehicle-documents/{userId}/{vehicleId}/filename.pdf`) restricted to the verified vehicle owner via Row Level Security.

### 4. Module 4: Chronological Maintenance Timeline (`/timeline`)
- **Reverse-Chronological Vehicle Ledger**: Visual timeline tracking every lifecycle event from day-one purchase to periodic servicing, part replacements, PUC tests, insurance renewals, and fuel logs.
- **Granular Filters**: Filter by event type (*All, Servicing, Repairs, Parts, Insurance, PUC, Fuel*).
- **Financial Linkage**: Displays exact service provider (e.g. *Sireesh Auto Mahindra Authorized*), date, mileage, and cost in INR.

### 5. Module 5: Smart In-App Reminders (`/reminders` & Dashboard Widget)
- **Actionable Compliance & Service Notifications**: Priority-ranked alerts (High, Medium, Low) for PUC expiration, policy renewal, brake pad inspections, and periodic services.
- **One-Click Management**: Complete or dismiss reminders with immediate feedback.
- **Dashboard Integration**: Live compliance reminders widget embedded directly in the main Dashboard with due dates and quick-action completion.
  *(Note: Clearly transparent that in-app reminders operate in the browser/cloud, while automated SMS/WhatsApp alerts require SMS gateway configuration).*

### 6. Module 6: Zero-Duplication Expense Synchronization
- **Integrated Ledger Sync**: Logging a maintenance event via `VehicleHealth` writes directly to `maintenance_records` and synchronizes to `vehicle_expenses` (category: `service`) in one transaction, automatically updating monthly and annual ownership expenditures with zero duplicate records.

### 7. Database Migration & Schema Extensions
- Migration file [`supabase/migrations/20261125020000_vehicle_passport_and_health.sql`](file:///c:/Users/shaur/autosphere/supabase/migrations/20261125020000_vehicle_passport_and_health.sql) creates:
  - `vehicle_documents`: Document metadata with storage pointers and compliance validity dates.
  - `maintenance_schedules`: Subsystem benchmarks, custom intervals, and service history.
  - `vehicle_reminders`: Priority-ranked compliance and service alerts with completion tracking.
  - `vehicle_photos`: Exterior, interior, and odometer verification photo gallery.
  - Extended `vehicles` table with `engine_number`, `rto_code`, `previous_owners_count`, `color`, `notes`, `photos`.
  - Strict Row Level Security policies (`auth.uid() = user_id`) on all new tables.

---

## 🤖 Phase 6: AutoSphere AI Car Assistant (Gemini API Integration)

AutoSphere Phase 6 introduces **AutoSphere AI**, a conversational automotive intelligence co-pilot engineered specifically for the Indian automotive market and integrated with the Google Gemini API:

### 1. Modern Conversational Chat Interface (`/ai-assistant`)
- **Executive SaaS Aesthetics**: Responsive full-viewport conversational UI featuring dark automotive obsidian surfaces, electric cyan message bubbles, and glowing telematics indicators.
- **Message Capabilities**:
  - Clear distinction between User and AI message bubbles.
  - Formatted markdown rendering supporting bold callouts, itemized bullet points, headings, and code blocks.
  - Integrated copy-to-clipboard button with visual confirmation checkmark on every AI response.
  - Interactive retry workflow on connection errors.
  - Structured data cards (Service price breakdowns, Petrol vs CNG vs EV economic comparisons, and OBD-II diagnostics) with direct deep-links into AutoSphere modules (`/pricing`, `/recommendations`, `/vehicle-health`, `/garage`).
- **Dynamic Quick Starter Prompts**:
  1. *"Which car should I buy under ₹10 lakh?"*
  2. *"How can I reduce my car's ownership cost?"*
  3. *"Compare petrol and CNG for my driving habits."*
  4. *"What maintenance does my car need?"*
  5. *"Should I keep my current car or replace it?"*
  6. *"Explain my vehicle health report."*
- **Conversation History & Persistence**:
  - Scoped to authenticated user session and persisted in `localStorage`.
  - 1-click "Clear All History" action with confirmation guard.
  - Automatic scroll-to-bottom on new messages and during AI analysis.

### 2. Secure Server-Side Gemini API Architecture
- **Netlify Function**: [`netlify/functions/gemini-chat.ts`](file:///c:/Users/shaur/autosphere/netlify/functions/gemini-chat.ts) handles production requests to `/.netlify/functions/gemini-chat` and `/api/gemini-chat`.
- **Local Vite Dev Middleware**: In development mode (`npm run dev`), [`vite.config.ts`](file:///c:/Users/shaur/autosphere/vite.config.ts) intercepts `/api/gemini-chat` and securely queries Gemini on the server side using `process.env.GEMINI_API_KEY`.
- **Zero API Key Exposure**: The Gemini API key is **NEVER** exposed to client components, frontend environment variables, or client bundles.
- **Request Sanitization & Rate Limiting**:
  - Strips PII (email addresses, phone numbers, credit cards) before sending payloads to AI providers.
  - Server-side in-memory rate limiter protects endpoints against denial-of-service abuse.
  - Strictly limits payload character size and sanitizes inputs.

### 3. AutoSphere Context Synthesizer (`src/services/aiContextService.ts`)
- Automatically injects sanitized telemetry from the user's active garage vehicle:
  - Make, model, variant, year, fuel type, transmission, and odometer.
  - Subsystem health statuses (Engine, Battery, Tyres, Brakes, Transmission, AC).
  - Diagnostic error codes and DPF soot accumulation levels.
  - Compliance validity dates (PUC and Insurance expiry).
  - Indian automotive market benchmarks (State fuel prices, EV charging tariffs, RTO road taxes).

### 4. Offline / Fallback Automotive Intelligence Engine (`src/services/aiFallbackService.ts`)
- When `GEMINI_API_KEY` is not configured or network connectivity is offline, AutoSphere activates its built-in automotive intelligence engine.
- Generates deep, authentic, mathematically verified responses for all 6 starter prompts, Indian road tax comparisons, and OBD diagnostics with full transparency.

---

## 🏷️ Phase 7: Buy/Sell Intelligence & Accessories Hub

AutoSphere Phase 7 introduces comprehensive used-car transaction intelligence, transparent fair-price algorithmic valuation, safe consumer-to-consumer enquiries, and a curated automotive accessories ecosystem:

### 1. Module 1: Buy Smart (Used-Car Marketplace) (`/buy-sell`)
- **Multi-Factor Filter Engine**: Search and filter by brand, model, manufacturing year, fuel type, transmission, max budget, odometer reading, city/location, and condition.
- **Verification Integrity**: Clearly distinguishes between `AutoSphere Verified` listings (200-point physical check, verified RC, single-owner history) and `Seller Submitted` listings.
- **Detailed Car Spec Sheet**: Masked registration numbers, full equipment list, verified RTO state, service history status, and high-resolution photo stream.

### 2. Module 2: TruePrice™ Algorithmic Fair-Price Intelligence (`src/services/usedCarPriceService.ts`)
- **Deterministic Valuation Engine**: Factors in:
  - Age-based depreciation curve (15% in yr 1, 10%/yr in yrs 2-3, tapering off at ~46% by yr 5).
  - Indian brand retention multipliers (Toyota 1.12, Maruti 1.08, Mahindra 1.03, Hyundai 1.02 vs luxury/high-maintenance brands 0.82).
  - Odometer delta against standard commuter benchmark (12,000 km/year).
  - Ownership penalty (1st owner premium vs multiple previous registrations).
  - Physical condition adjustment (Excellent, Very Good, Good, Fair).
  - Regional regulatory factors (e.g. 10-Year Delhi-NCR NGT diesel rule discount, factory CNG demand premium).
- **Price Assessment**: Real-time evaluation against asking price:
  - 🟢 **Below Estimated Range** (Great Deal)
  - 🔵 **Within Estimated Range** (Fair Price)
  - 🟡 **Above Estimated Range** (Premium Price)
- **Transparent Disclosure**: Explains the exact mathematical drivers and disclaims that estimates reflect indicative consumer-to-consumer benchmarks without legal appraisal guarantees.

### 3. Module 3: Sell Your Car (`/buy-sell?tab=sell`)
- **Interactive Listing Creator**:
  - 1-click auto-fill from user's registered garage vehicles (`vehicles` table).
  - Manual entry options for custom models and specifications.
  - Photo gallery upload and condition grading.
- **Live Smart Selling Price Suggestion**: Dynamically updates the recommended starting asking price, suggested fair range, and confidence level as the user adjusts odometer, year, and condition.
- **Listing Lifecycle Management**: Allows sellers to manage their own listings: Edit asking price, pause/resume, mark as sold, or delete.

### 4. Module 4: Safe Buyer-Seller Enquiry System (`src/services/usedCarListingService.ts`)
- **Zero-Spam Consumer Privacy**: Buyers send enquiries and price offers directly within AutoSphere. Personal mobile numbers and email addresses are never exposed publicly or sent to third parties.
- **Dedicated Seller Inbox**: Sellers receive enquiries, review buyer offered prices, send responses, and mark enquiries as resolved.

### 5. Module 5: Curated Accessories Hub (`/accessories`)
- **7 Core Automotive Categories**:
  1. *Interior*: 7D carbon all-weather custom mats, memory foam neck/lumbar cushions, magnetic window sunshades.
  2. *Exterior*: 9H hydrophobic graphene ceramic paint coating, smoked chrome-line rain visors.
  3. *Car Cleaning & Detailing*: 1200 GSM edgeless microfiber drying towels, 120W wireless cyclone vacuum.
  4. *Electronics & Infotainment*: 4K Front + 1080p Rear Smart dual dashcam (Sony Starvis), 150 PSI digital cordless tyre inflator.
  5. *Safety & Utility*: 1500A peak emergency jump starter power bank, heavy-duty tubeless tyre puncture kit.
  6. *EV Accessories*: 7.4 kW Type-2 AC home wallbox smart charger, 16A 3-pin portable emergency EV cable.
  7. *Maintenance Essentials*: Mobil 1 API SP synthetic 5W-30 engine oil, frameless aerodynamic wiper blades.
- **Vehicle Compatibility Engine**:
  - Dynamically evaluates fitment against the user's active garage vehicle (e.g. *Mahindra XUV700*, *Tata Nexon EV*).
  - Displays compatibility badges: 🟢 *Compatible with your vehicle*, 🔵 *Universal Fitment*, or 🟡 *Fitment Check Required*.
  - Toggle to filter exclusively compatible items.
- **Wishlist Management**: 1-click save/unsave to local wishlist.
- **Platform Scope Notice**: Transparently labeled as a curated sample catalogue with indicative MRPs. No live payments or order dispatch are claimed.

### 6. Database Migration & Schema Extensions
- Migration file [`supabase/migrations/20261125030000_buy_sell_and_accessories.sql`](file:///c:/Users/shaur/autosphere/supabase/migrations/20261125030000_buy_sell_and_accessories.sql) creates:
  - `used_car_listings`: Verified and user-created vehicle listings with condition, price, and status.
  - `used_car_enquiries`: Private buyer-seller enquiry messages with strict RLS (`auth.uid() = buyer_id OR auth.uid() = seller_id`).
  - `accessories`: Catalogue of curated automotive hardware and vehicle compatibility arrays.
  - `saved_accessories`: User wishlist table with strict RLS (`auth.uid() = user_id`).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or v20+)
- npm or pnpm
- (Optional) A free [Supabase](https://supabase.com) account

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/autosphere.git
cd autosphere
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note**: If `VITE_SUPABASE_URL` is left empty or using placeholders, AutoSphere runs in **Demo / Guest Mode**, allowing full evaluation with realistic mock data and local state.

### 3. Run Database Migrations (Supabase)

To set up the database tables and Row Level Security:
1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/shaur/autosphere/supabase/schema.sql) (or `supabase/migrations/20261124000000_autosphere_schema.sql`).
3. Click **Run**. All 8 tables, indexes, RLS policies, and user creation triggers will be provisioned instantly.

### 4. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 🏁 Phase 8: Final Integration, Testing & Deployment

Phase 8 consolidates all 7 preceding phases into a hardened, production-ready automotive platform prepared for deployment on **Netlify**:

### 1. Architectural & Module Verification (17 Core Features)
1. **Authentication & Session Persistence**: Email/password, Supabase Auth tokens, password reset, protected route interception, and zero-auth demo fallback.
2. **Dashboard & Fleet Overview**: Live telematics, TPMS 4-wheel visualizer, fuel/charge level, monthly spending analytics, and quick actions.
3. **Smart Car Replacement Intelligence**: 3-year & 5-year TCO engine, loan EMI calculator, KA/UP state tax exemptions, and replacement verdict generation.
4. **India Automotive Database**: 11+ major Indian OEMs, 26 models, 27 variants with detailed powertrains (Petrol, Diesel, CNG, Hybrid, EV).
5. **Modular On-Road Pricing Engine**: Location-aware RTO road tax calculation across 36 States/UTs, municipal parking cess, GST TCS (1%), and Fastag.
6. **Digital Vehicle Passport**: Complete vehicle spec sheet, registration data, RTO code, engine & chassis numbers, and color tags.
7. **Vehicle Subsystem Health Tracker**: Deterministic status computation across 6 subsystems (Engine, Battery, Tyres, Brakes, Transmission, AC).
8. **Digital Document Vault**: Tamper-proof metadata tracking for Smart Card RC, Zero-Dep Insurance, PUC certificates, and purchase invoices.
9. **Maintenance Timeline**: Chronological service event logging, invoice records, and zero-duplicate expense ledger synchronization.
10. **Smart Service Reminders**: In-app proactive alerts for PUC expiry, insurance renewals, and service milestones.
11. **AutoSphere AI Co-Pilot**: Multi-turn automotive assistant with active vehicle telemetry injection and robust domain fallbacks.
12. **Server-Side Gemini Integration**: Secure Netlify Function endpoint (`/api/gemini-chat` or `/.netlify/functions/gemini-chat`) keeping `GEMINI_API_KEY` private.
13. **Buy Smart Marketplace**: Verified used car listings with multi-attribute filtering, condition grading, and masked registration numbers.
14. **TruePrice™ Algorithmic Valuation**: Transparent depreciation, brand retention multipliers, and confidence intervals for secondary car transactions.
15. **Sell Your Car Workflow**: Interactive listing creator with garage auto-fill and live suggested asking price engine.
16. **Safe Buyer-Seller In-App Inquiries**: Zero-spam consumer privacy protecting buyer/seller mobile numbers and email addresses.
17. **Curated Accessories Hub & Compatibility Engine**: 7 automotive categories, vehicle fitment check algorithm, and persistent user wishlist.

### 2. Comprehensive Test Suite
Execute the master integration test suite:
```bash
npx tsx scripts/test-phase8-master.ts
```
Expected result: **57/57 tests passing (100% success rate)** across all 7 architectural domains.

Additional regression test suites:
```bash
npx tsx scripts/test-phase3.ts   # 41 tests passing
npx tsx scripts/test-phase4.ts   # 53 tests passing
npx tsx scripts/test-phase5.ts   # 54 tests passing
```
Total verified automated test assertions: **205/205 passing**.

### 3. Production Deployment on Netlify
The platform is pre-configured for instant zero-configuration deployment to Netlify:
- **Build Command**: `npm run build` (`tsc && vite build`)
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`
- **Routing Redirects**: Configured in `netlify.toml` for Single Page App (SPA) HTML5 history routing (`/* -> /index.html`) and API proxying (`/api/* -> /.netlify/functions/:splat`).

#### Required Netlify Environment Variables:
Configure these in **Netlify Dashboard -> Site Configuration -> Environment Variables**:
| Variable Name | Environment | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Production & Preview | Supabase Project URL (`https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Production & Preview | Supabase Anonymous Public Key |
| `GEMINI_API_KEY` | Production & Preview | Server-side Google Gemini API key (kept confidential) |
| `GEMINI_MODEL` | Production & Preview | Optional model override (defaults to `gemini-1.5-flash`) |

---

## 🔒 Security Best Practices

- **Zero Service Keys in Client**: Frontend only communicates using `VITE_SUPABASE_ANON_KEY`.
- **Database Row Level Security (RLS)**: Enforced directly at the PostgreSQL engine level. Unauthorized queries return 0 rows.
- **Sanitized Inputs**: Form inputs validate email patterns, phone formats, and numeric ranges.
- **Secure Sessions**: Authentication state is stored securely and updated in real-time via Supabase's `onAuthStateChange` listener.
