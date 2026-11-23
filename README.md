# AutoSphere — India-Wide Automotive Intelligence Platform (Phase 1)

**AutoSphere** is a premium, modern dark automotive SaaS web application designed specifically for Indian car owners. It unifies vehicle telemetry, Total Cost of Ownership (TCO) tracking, predictive health monitoring, AI-powered replacement recommendations, and used car fair market valuation into a single platform.

---

## ⚡ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 (chunk-optimized with manual vendor code-splitting)
- **Styling**: Tailwind CSS (Dark automotive theme: Charcoal/Obsidian surfaces, subtle borders, electric cyan/blue accents)
- **Routing**: React Router v6
- **Data Visualization**: Recharts (Monthly TCO bar chart, category share donut chart)
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & JetBrains Mono (instrument cluster styling)

---

## 🚀 Key Features & Pages

### 1. Dashboard (`/`)
- **Welcome Briefing**: Contextual user briefing and vehicle status.
- **Hero Vehicle Telematics Showcase**: Active vehicle details (e.g., *Mahindra XUV700 AX7L AWD* / *Tata Nexon EV*), authentic Indian HSRP number plate preview with IND hologram, connected telematics platform indicator (*AdrenoX / iRA*).
- **Live Instrument Cluster**: Real-time State of Charge (SoC) / Fuel level, range remaining (km), overall OBD-II health score (0-100), cold tyre pressure TPMS (PSI) across 4 wheels + spare, real-world fuel efficiency, next scheduled service counter, and linked NETC FASTag wallet balance.
- **Financial Ownership Snapshot**: Current month spend vs previous month, annual TCO spend, and cost-per-km metrics.
- **Recent Maintenance & Expense Activity**: Chronological expense stream with categorization.
- **Recommended Upgrades Preview**: Quick preview of top matching vehicles (e.g. *Toyota Innova Hycross Hybrid*, *Tata Harrier.ev*).
- **Quick Actions**: One-click launchers for Logging Expenses, Scheduling Service, Checking Market Valuation, and Running OBD-II Scans.

### 2. Smart Car Recommendations (`/recommendations`)
- **TCO Driving Habit Simulator**: Interactive sliders for monthly commute distance (400 km – 3,500 km/mo) and traffic condition mix (city crawling vs highway cruising) that dynamically recalculate expected annual fuel savings in INR.
- **Powertrain Filters**: Filter across Electric (EV), Strong Hybrid, Diesel, and Petrol.
- **Match Score**: Algorithmic compatibility index (e.g., 96/100).
- **Side-by-Side Comparison Modal**: Benchmarks the prospective car against your active garage car across power, torque, real efficiency, Bharat NCAP safety ratings, 5-year projected savings, and Indian road condition pros & cons.

### 3. Ownership Cost Intelligence (`/ownership-cost`)
- **Lifecycle Cost Analysis**: Granular breakdown of Fuel/Electricity, Periodic Maintenance, Insurance & Taxes, FASTag Tolls, and Accessories.
- **Visual Analytics**: Interactive Recharts monthly bar chart and category distribution donut chart.
- **Transaction Ledger**: Searchable, filterable table of vehicle expenses with payment method tags and delete capability.
- **CSV Data Export**: One-click download of the complete TCO transaction ledger.

### 4. My Garage (`/garage`)
- **Multi-Vehicle Fleet**: Manage multiple cars (Primary and secondary, e.g. Diesel SUV + Urban EV).
- **Add Vehicle Wizard**: Register new vehicles with Indian OEM presets, fuel types, transmission options, and live HSRP number plate rendering.
- **DigiLocker Document Vault**: Legally valid cloud documents (Smart RC, Comprehensive Insurance, PUC Certificate, Driving License) with expiry countdowns and download simulations.
- **Service Intervals & Booking**: OEM periodic service interval tracker with estimated costs in INR.

### 5. Vehicle Health & Telematics (`/vehicle-health`)
- **ECU Health Ring**: Circular health score gauge (94/100) reflecting real-time powertrain parameters.
- **Subsystem Telematics**: Engine knock & timing, coolant temperature (89°C), brake pad wear (3.8mm), 12V / high-voltage battery health, and DPF soot accumulation level.
- **Direct TPMS Visualizer**: 4-wheel vehicle chassis diagram displaying live cold tyre pressure in PSI.
- **DTC Diagnostic Trouble Codes**: Real-time error codes (e.g. `P2463` DPF Soot Accumulation) with layman explanations for Indian driving conditions, DIY highway regen fix guides, repair estimates, and one-click resolution.
- **Live OBD-II Scan**: Interactive wireless handshake scan simulation.

### 6. SphereAI Automotive Co-Pilot (`/ai-assistant`)
- **Specialized Indian Automotive Assistant**: Context-aware AI chatbot understanding Indian OEM maintenance schedules, RTO Parivahan regulations, FASTag disputes, and EV charging infrastructure.
- **Suggested Prompt Carousel**: Instant queries for service quote validation, DPF issues, diesel-to-EV economics, and Bangalore traffic e-challans.
- **Structured Response Cards**: Formatted cost breakdowns, DTC diagnostics cards, and RTO status reports with action buttons.

### 7. Buy & Sell Verified Marketplace (`/buy-sell`)
- **Indian Used Car Valuation Engine**: Algorithmic market appraisal considering OEM, model, manufacturing year, mileage, city market demand (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai), and condition.
- **Valuation Breakdown**: Instant dealer buyout cash offer vs. direct individual buyer maximum value.
- **Verified Pre-Owned Inventory**: 200-point inspected cars with warranty badges, flood-free certification, and doorstep test drive booking.

### 8. Curated Accessories Hub (`/accessories`)
- **Hardware for Indian Driving**: 70mai 4K HDR Dashcams, Qubo Smart Portable Tyre Inflators, 7.4 kW Type 2 Smart Home EV Wallbox Chargers, 7D All-Weather Monsoon Floor Mats, and Bluetooth OBD-II Scanners.
- **Compatibility Tag**: Confirms guaranteed fitment for the active vehicle.
- **Shopping Cart Drawer**: Full quantity adjustment, total calculation in INR with GST, and checkout simulation.

### 9. Profile & Settings (`/settings`)
- **Driver Profile**: Personal details, WhatsApp alert preferences, and city/state jurisdiction.
- **NETC FASTag Wallet Manager**: Live balance display and instant UPI top-up simulation.
- **Connected Car Sync**: Integrations with *Mahindra AdrenoX*, *Tata iRA / ZConnect*, *Hyundai Bluelink*, and *Suzuki Connect*.
- **Notification Thresholds**: Toggle periodic service alerts, PUC expiry countdowns, insurance renewal notices, and FASTag low-balance warnings.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or v20+)
- npm or pnpm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

The application will be accessible at `http://localhost:3000` (or `http://localhost:4173` for preview).
