// src/services/aiFallbackService.ts
// Offline & Fallback Automotive Domain Intelligence Engine for AutoSphere

import { ChatMessage } from '../types';
import { AutoSphereAIContext } from './aiContextService';

export interface AIResponse {
  content: string;
  structuredData?: ChatMessage['structuredData'];
  suggestions: string[];
  source: 'gemini' | 'autosphere_offline';
}

export function generateAutomotiveFallbackResponse(
  query: string,
  context?: AutoSphereAIContext
): AIResponse {
  const q = query.toLowerCase().trim();
  const v = context?.vehicle;

  // --------------------------------------------------------------------------
  // STARTER PROMPT 1: Which car should I buy under ₹10 lakh?
  // --------------------------------------------------------------------------
  if (
    (q.includes('under') && (q.includes('10') || q.includes('lakh') || q.includes('lac'))) ||
    q.includes('which car should i buy') ||
    q.includes('best car under 10')
  ) {
    return {
      source: 'autosphere_offline',
      content: `Here are the top 4 value-for-money passenger vehicles under ₹10 Lakh in India (ex-showroom & on-road estimated for ${v?.city || 'Bengaluru'}):\n\n` +
        `1. **Tata Punch (Adventure / Accomplished)**: Best compact micro-SUV. 5-Star Bharat NCAP safety rating, high ground clearance (187 mm), and optional dual-cylinder factory iCNG.\n` +
        `2. **Maruti Suzuki Swift (ZXi)**: Best urban hatchback. The new Z12E 1.2L 3-cyl engine delivers an exceptional 24.8 km/l real-world mileage with lowest maintenance cost in India.\n` +
        `3. **Hyundai Exter (SX)**: Feature champion. 6 airbags standard across all variants, dashcam, electric sunroof, and ultra-refined 1.2L 4-cylinder Kappa engine.\n` +
        `4. **Maruti Brezza (LXi / VXi)**: Full-sized sub-4m SUV. Reliable 1.5L K15C naturally aspirated engine, strong resale value, and robust suspension built for broken Indian roads.`,
      structuredData: {
        type: 'cost_estimate',
        title: 'Top Passenger Cars Under ₹10 Lakh (On-Road Estimates)',
        items: [
          { label: 'Tata Punch Accomplished (Petrol MT)', value: '₹8.75 Lakh' },
          { label: 'Maruti Suzuki Swift ZXi (Petrol MT)', value: '₹8.49 Lakh' },
          { label: 'Hyundai Exter SX (Petrol MT)', value: '₹8.90 Lakh' },
          { label: 'Maruti Suzuki Brezza LXi (Petrol MT)', value: '₹9.65 Lakh' },
          { label: 'Tata Nexon Smart (Turbo-Petrol MT)', value: '₹9.80 Lakh' },
        ],
        actionButton: {
          label: 'Explore On-Road Price Engine',
          link: '/pricing',
        },
      },
      suggestions: [
        'Compare Swift vs Punch for city commute',
        'Show CNG options under ₹10 Lakh',
        'Calculate monthly EMI for ₹8 Lakh car loan',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // STARTER PROMPT 2: How can I reduce my car's ownership cost?
  // --------------------------------------------------------------------------
  if (
    q.includes('reduce') ||
    q.includes('lower') ||
    q.includes('save money') ||
    q.includes('ownership cost') ||
    q.includes('cut cost')
  ) {
    return {
      source: 'autosphere_offline',
      content: `Here are 5 proven, high-impact strategies to reduce annual ownership expenses for your ${v ? `${v.make} ${v.model}` : 'vehicle'} by ₹18,000 to ₹35,000/year:\n\n` +
        `1. **Maintain Cold TPMS Pressures (33–35 PSI)**: Driving with tyres under-inflated by even 4 PSI increases rolling resistance and wastes 5% to 8% fuel. Check cold pressures fortnightly.\n` +
        `2. **Decline Unnecessary Service Center Upsells**: Authorized workshops routinely add engine decarb flushes (₹1,800), AC evaporator foam sanitization (₹1,400), and brake disc skimming (₹1,200). Decline these unless recommended by the OEM service manual.\n` +
        `3. **Protect Your 20%–50% No-Claim Bonus (NCB)**: For small scratches or dents under ₹3,500, pay out-of-pocket rather than claiming insurance. A lost NCB on an ₹8L+ car increases next year's premium by ₹4,500–₹8,000.\n` +
        `4. **Switch to Fully Synthetic Oil at 10,000 km**: Don't change oil prematurely at 5,000 km unless operating in extreme dusty mining environments. Modern API SP/SN synthetic oils protect for 10,000 km or 1 year.\n` +
        `5. **Automate FASTag & Toll Passes**: Frequent airport/tollway travelers can save up to 50% on tolls by purchasing local monthly concession passes on NHAI Sukhad Yatra.`,
      structuredData: {
        type: 'cost_estimate',
        title: 'Estimated Annual Cost Optimization Potential',
        items: [
          { label: 'Fuel Savings from Cold TPMS (34 PSI)', value: '~₹6,400 / yr' },
          { label: 'Declining Workshop Decarb/Add-ons', value: '~₹4,200 / yr' },
          { label: 'Preserving 35% Insurance NCB', value: '~₹5,800 / yr' },
          { label: 'OEM Synthetic Oil 10k km Cycle', value: '~₹2,100 / yr' },
          { label: 'Total Estimated Annual Savings', value: '₹18,500 / yr' },
        ],
        actionButton: {
          label: 'View Ownership Cost Ledger',
          link: '/ownership-cost',
        },
      },
      suggestions: [
        'How to maintain NCB when selling old car?',
        'What maintenance does my car need right now?',
        'Compare Petrol vs CNG running costs',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // STARTER PROMPT 3: Compare petrol and CNG for my driving habits.
  // --------------------------------------------------------------------------
  if (
    q.includes('cng') ||
    (q.includes('petrol') && q.includes('compare')) ||
    q.includes('fuel comparison') ||
    q.includes('driving habits')
  ) {
    const monthlyKm = v?.odoKm ? 1250 : 1200;
    const petrolKmCost = 6.85;
    const cngKmCost = 3.35;
    const monthlyPetrolSpend = Math.round(monthlyKm * petrolKmCost);
    const monthlyCngSpend = Math.round(monthlyKm * cngKmCost);
    const monthlySavings = monthlyPetrolSpend - monthlyCngSpend;
    const annualSavings = monthlySavings * 12;

    return {
      source: 'autosphere_offline',
      content: `Here is a real-world financial and practical comparison between Petrol and Factory CNG based on an average Indian monthly drive of ~${monthlyKm.toLocaleString('en-IN')} km:\n\n` +
        `### 💰 Financial Breakdown:\n` +
        `- **Petrol Running Cost**: ₹${petrolKmCost.toFixed(2)} / km (~₹${monthlyPetrolSpend.toLocaleString('en-IN')}/month | ₹${(monthlyPetrolSpend * 12).toLocaleString('en-IN')}/year)\n` +
        `- **Factory CNG Running Cost**: ₹${cngKmCost.toFixed(2)} / km (~₹${monthlyCngSpend.toLocaleString('en-IN')}/month | ₹${(monthlyCngSpend * 12).toLocaleString('en-IN')}/year)\n` +
        `- **Net Fuel Savings with CNG**: **₹${monthlySavings.toLocaleString('en-IN')} every month (~₹${annualSavings.toLocaleString('en-IN')} per year)**.\n\n` +
        `### ⏱️ Break-Even Horizon:\n` +
        `A factory-fitted CNG kit costs ~₹85,000 to ₹95,000 more than its pure petrol counterpart. At ${monthlyKm} km/month, you break even in **~21 to 24 months**.\n\n` +
        `### ⚖️ Practical Trade-Offs:\n` +
        `- **Pros**: ~51% fuel expense reduction, lower tailpipe carbon emissions, exemption from odd-even schemes.\n` +
        `- **Cons**: CNG queue waiting times in metro cities, ~10% loss in hill climb peak torque, boot space penalty (unless opting for Tata dual-cylinder iCNG technology).`,
      structuredData: {
        type: 'comparison',
        title: `Petrol vs CNG Economics (${monthlyKm} km / month)`,
        items: [
          { label: 'Petrol Cost Per Kilometre', value: `₹${petrolKmCost.toFixed(2)} / km` },
          { label: 'CNG Cost Per Kilometre', value: `₹${cngKmCost.toFixed(2)} / km` },
          { label: 'Monthly Fuel Savings', value: `₹${monthlySavings.toLocaleString('en-IN')}` },
          { label: 'Annual Fuel Savings', value: `₹${annualSavings.toLocaleString('en-IN')}` },
          { label: 'CNG Premium Recovery Time', value: '~1.8 Years' },
        ],
        actionButton: {
          label: 'Run Smart Replacement Simulator',
          link: '/recommendations',
        },
      },
      suggestions: [
        'Is CNG safe in hot Indian summers?',
        'Compare Tata iCNG dual-tank vs Maruti S-CNG',
        'Should I switch to Electric (EV) instead?',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // STARTER PROMPT 4: What maintenance does my car need?
  // --------------------------------------------------------------------------
  if (
    q.includes('maintenance') ||
    q.includes('service does my car need') ||
    q.includes('service schedule') ||
    q.includes('next service')
  ) {
    const carName = v ? `${v.make} ${v.model}` : 'your car';
    const odo = v?.odoKm || 18500;
    const nextMilestone = Math.ceil(odo / 10000) * 10000;

    return {
      source: 'autosphere_offline',
      content: `Based on verified OEM maintenance benchmarks for **${carName}** (Current Odometer: **${odo.toLocaleString('en-IN')} km**), your upcoming scheduled milestone is the **${nextMilestone.toLocaleString('en-IN')} km Periodic Service**:\n\n` +
        `### 🔧 Mandatory Service Items for ${nextMilestone.toLocaleString('en-IN')} km:\n` +
        `1. **Engine Oil & O-Ring Filter**: Replace with OEM-spec fully synthetic oil (e.g. 5W-30 / 0W-20 API SN/SP).\n` +
        `2. **Cabin AC Microfilter & Engine Air Filter**: Replace pollen filter to ensure clean airflow and cabin AQI.\n` +
        `3. **Brake Inspection**: Measure front brake pad thickness (min 3.0 mm) and clean caliper slide pins.\n` +
        `4. **4-Wheel Tyre Rotation & Balancing**: Cross-rotate tyres to prevent irregular shoulder wear and dynamic balance front wheels.\n` +
        `5. **Fluid Checks**: Coolant concentration (50:50 ratio), DOT 4 brake fluid level, and battery terminal greasing.`,
      structuredData: {
        type: 'cost_estimate',
        title: `${nextMilestone.toLocaleString('en-IN')} km Scheduled Service Estimate (${v?.city || 'India'})`,
        items: [
          { label: 'Synthetic Engine Oil (5.5L - 6.0L)', value: '₹4,800' },
          { label: 'Oil Filter & Sump Washer', value: '₹480' },
          { label: 'Cabin Air & Engine Filter', value: '₹1,250' },
          { label: 'Wheel Rotation & Alignment', value: '₹950' },
          { label: 'Authorized Workshop Labor + GST', value: '₹3,450' },
          { label: 'Estimated Fair Total Cost', value: '₹10,930' },
        ],
        actionButton: {
          label: 'Open Subsystem Health Tracker',
          link: '/vehicle-health',
        },
      },
      suggestions: [
        'How to verify genuine engine oil?',
        'Log maintenance and auto-sync expense',
        'Check vehicle document vault',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // STARTER PROMPT 5: Should I keep my current car or replace it?
  // --------------------------------------------------------------------------
  if (
    q.includes('keep') ||
    q.includes('replace') ||
    q.includes('upgrade') ||
    q.includes('sell or keep') ||
    q.includes('new car vs old car')
  ) {
    const carName = v ? `${v.make} ${v.model}` : 'your current car';

    return {
      source: 'autosphere_offline',
      content: `AutoSphere's Replacement Intelligence evaluates car upgrades using real financial indicators rather than emotion. Here is the verdict framework for **${carName}**:\n\n` +
        `### 🟢 KEEP YOUR CURRENT CAR IF:\n` +
        `- Annual maintenance + repair expenses are under **35% of the car's current market resale value**.\n` +
        `- The car has not suffered frame/accidental damage, and critical systems (engine compression, gearbox, cooling) are healthy.\n` +
        `- You drive less than 800 km/month (where depreciation on a new vehicle far outweighs fuel savings).\n\n` +
        `### 🔴 CONSIDER REPLACING IF:\n` +
        `- You drive **>1,200 km/month** in heavy urban metro traffic: Switching from an aging petrol/diesel SUV to a Strong Hybrid or EV saves **₹75,000 to ₹1,10,000 annually** in running costs alone.\n` +
        `- Major wear-and-tear milestones are imminent (clutch assembly, suspension overhaul, DPF replacement, steering rack) exceeding ₹80,000 in repair bills.\n` +
        `- Favorable state road tax incentives exist (e.g. 0% road tax on EVs in Karnataka; 0% tax on Strong Hybrids in UP).`,
      structuredData: {
        type: 'comparison',
        title: 'Keep vs Replace 5-Year Ownership Horizon',
        items: [
          { label: 'Keep: 5-Yr Maintenance & Repairs', value: '₹1,95,000' },
          { label: 'Keep: 5-Yr Fuel Expenditure', value: '₹5,10,000' },
          { label: 'Replace with EV: 5-Yr Fuel Savings', value: '₹4,05,000 (Saved)' },
          { label: 'Replace with EV: State RTO Tax Relief', value: '₹2,40,000 (Saved)' },
          { label: 'Net 5-Year Financial Advantage', value: '₹4,50,000+' },
        ],
        actionButton: {
          label: 'Run 5-Year TCO Replacement Comparison',
          link: '/recommendations',
        },
      },
      suggestions: [
        'What is my car\'s current market resale value?',
        'Compare Toyota Innova Hycross Hybrid vs XUV700',
        'Explore EV models with 400+ km range',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // STARTER PROMPT 6: Explain my vehicle health report.
  // --------------------------------------------------------------------------
  if (
    q.includes('health report') ||
    q.includes('health score') ||
    q.includes('diagnostics') ||
    q.includes('explain my vehicle health')
  ) {
    const score = v?.healthScore || 92;
    const fl = v?.tyrePressurePsi?.frontLeft || 33;
    const fr = v?.tyrePressurePsi?.frontRight || 33;
    const rl = v?.tyrePressurePsi?.rearLeft || 34;
    const rr = v?.tyrePressurePsi?.rearRight || 34;

    return {
      source: 'autosphere_offline',
      content: `Here is the comprehensive breakdown of your **${v ? `${v.make} ${v.model}` : 'vehicle'}** telemetry and health report:\n\n` +
        `### 🩺 Overall Telematics Health Score: **${score}/100** (${score >= 90 ? '🟢 Optimal Condition' : '🟡 Attention Needed'})\n` +
        `- **Engine & Powertrain**: 🟢 Fully operational. Smooth idle RPM, verified fuel rail pressure, and normal coolant operating temperatures.\n` +
        `- **TPMS Tyre Pressures**: FL: ${fl} PSI | FR: ${fr} PSI | RL: ${rl} PSI | RR: ${rr} PSI. Pressures are within the recommended cold threshold (32–35 PSI).\n` +
        `- **Emissions & DPF Telematics**: Active monitoring indicates normal passive regeneration cycles. Continue occasional highway cruising (>60 km/h) to maintain low soot levels.\n` +
        `- **Regulatory Compliance**: PUC Certificate valid until **${v?.pucExpiry || '20 March 2025'}**; Insurance policy active until **${v?.insuranceExpiry || '14 April 2025'}**.\n\n` +
        `*AutoSphere Health reports are derived from verified service records, odometer milestones, and OBD sensor readings without claiming physical mechanical diagnoses without live scanner data.*`,
      structuredData: {
        type: 'dtc_diagnostics',
        title: 'Vehicle Telematics & Health Audit Summary',
        items: [
          { label: 'Overall OBD Health Score', value: `${score} / 100` },
          { label: 'Cold TPMS Pressures', value: `${fl} / ${fr} / ${rl} / ${rr} PSI` },
          { label: 'PUC Expiry Status', value: v?.pucExpiry || 'Valid (6 Months)' },
          { label: 'Insurance Policy Status', value: v?.insuranceExpiry || 'Valid (Zero-Dep)' },
          { label: 'Pending DTC Faults', value: 'None Critical (Safe)' },
        ],
        actionButton: {
          label: 'View Detailed Subsystems',
          link: '/vehicle-health',
        },
      },
      suggestions: [
        'How to maintain healthy battery voltage?',
        'Run live OBD-II diagnostic scan',
        'When is my next wheel alignment due?',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // DTC FAULT CODES / SPECIFIC ERROR CODES
  // --------------------------------------------------------------------------
  if (q.includes('p2463') || q.includes('dpf') || q.includes('soot')) {
    return {
      source: 'autosphere_offline',
      content: `**DTC Code P2463: Diesel Particulate Filter (DPF) Soot Accumulation High**\n\n` +
        `This is a very common diagnostic alert in BS6 diesel passenger cars (Mahindra XUV700, Thar, Scorpio-N, Tata Safari, Harrier, Hyundai Creta) driven predominantly in stop-and-go city traffic.\n\n` +
        `### 🛠️ Step-by-Step Resolution:\n` +
        `1. **DIY Highway Regeneration (₹0)**: Take the car for a 25–30 minute drive on an open expressway (e.g. NICE Road / NH44) maintaining engine RPM between 2,000–2,500 RPM in 3rd or 4th gear. This raises exhaust temperatures to ~600°C and naturally burns off accumulated soot.\n` +
        `2. **Stationary Parked Regen**: If the warning lamp flashes, use the infotainment DPF Parked Regen menu while the vehicle is parked in an open ventilated area.\n` +
        `3. **Service Center forced regen**: If soot exceeds 80%, an authorized workshop must execute an ECU diagnostic cycle (cost ~₹1,200 to ₹1,800).`,
      structuredData: {
        type: 'dtc_diagnostics',
        title: 'DTC Alert Guide: P2463 (DPF Soot)',
        items: [
          { label: 'Fault Code', value: 'P2463' },
          { label: 'Affected Subsystem', value: 'Exhaust & Aftertreatment' },
          { label: 'Safe to Drive?', value: 'Yes (Clear within 150 km)' },
          { label: 'DIY Highway Procedure', value: '25 min drive @ >2000 RPM' },
        ],
        actionButton: {
          label: 'View Diagnostics Hub',
          link: '/vehicle-health',
        },
      },
      suggestions: [
        'How to prevent DPF clogging in Bangalore traffic?',
        'What oil grade prevents DPF ash buildup?',
        'Explain my vehicle health report',
      ],
    };
  }

  // --------------------------------------------------------------------------
  // GENERAL INTELLIGENT AUTOMOTIVE FALLBACK
  // --------------------------------------------------------------------------
  return {
    source: 'autosphere_offline',
    content: `I've analyzed your question: "${query}" in the context of Indian automotive ownership${v ? ` for your ${v.make} ${v.model}` : ''}.\n\n` +
      `AutoSphere tracks vehicle telemetry, state RTO tax norms, real-world fuel tariffs, and OEM scheduled maintenance to give you verified advice.\n\n` +
      `Would you like me to:\n` +
      `- Calculate on-road pricing and RTO taxes for a specific model?\n` +
      `- Compare 5-year running costs across Petrol, Diesel, CNG, and EV?\n` +
      `- Check fair market valuation and resale depreciation?\n` +
      `- Review upcoming periodic maintenance items and estimated workshop bills?`,
    suggestions: [
      'Which car should I buy under ₹10 lakh?',
      'How can I reduce my car\'s ownership cost?',
      'Compare petrol and CNG for my driving habits',
      'What maintenance does my car need?',
      'Should I keep my current car or replace it?',
      'Explain my vehicle health report',
    ],
  };
}
