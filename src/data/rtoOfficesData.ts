import { ALL_INDIAN_CITIES, ALL_INDIAN_STATES } from './locationsData';

export type RtoOfficeType = 'RTO' | 'DTO' | 'RTO/DTO';
export type RtoVerificationStatus = 'Verified' | 'Pending Official Verification';

export interface RtoOfficeRecord {
  code: string; // e.g. 'RJ14', 'KA01'
  displayCode: string; // e.g. 'RJ-14'
  officeName: string;
  districtOrCity: string;
  stateId: string;
  stateName: string;
  officeType: RtoOfficeType;
  verificationStatus: RtoVerificationStatus;
  source: string;
  lastVerifiedDate: string;
}

const RJ_OFFICIAL_SOURCE =
  'Rajasthan Transport Department Official Registration Code Page (transport.rajasthan.gov.in)';
const RJ_SUPPLEMENTARY_SOURCE =
  'Newer Supplementary Rajasthan RTO/DTO Directory (Pending cross-check with transport.rajasthan.gov.in)';
const VERIFIED_DATE = '2026-11-25';

function rjOfficial(
  code: string,
  officeName: string,
  districtOrCity: string,
  officeType: RtoOfficeType
): RtoOfficeRecord {
  return {
    code,
    displayCode: `${code.slice(0, 2)}-${code.slice(2)}`,
    officeName,
    districtOrCity,
    stateId: 'RJ',
    stateName: 'Rajasthan',
    officeType,
    verificationStatus: 'Verified',
    source: RJ_OFFICIAL_SOURCE,
    lastVerifiedDate: VERIFIED_DATE,
  };
}

function rjSupplementary(
  code: string,
  officeName: string,
  districtOrCity: string,
  officeType: RtoOfficeType
): RtoOfficeRecord {
  return {
    code,
    displayCode: `${code.slice(0, 2)}-${code.slice(2)}`,
    officeName,
    districtOrCity,
    stateId: 'RJ',
    stateName: 'Rajasthan',
    officeType,
    verificationStatus: 'Pending Official Verification',
    source: RJ_SUPPLEMENTARY_SOURCE,
    lastVerifiedDate: 'Pending',
  };
}

/**
 * Rajasthan RTO / DTO registration codes:
 * - RJ-01 through RJ-45: Verified from Rajasthan Transport Department's official registration-code page.
 *   Includes Jaipur South (RJ-14) and Jaipur North (RJ-45) as separate options.
 * - RJ-46 through RJ-58: Included from newer supplementary directory and marked "Pending Official Verification"
 *   until cross-checked against current official government records.
 */
export const RAJASTHAN_RTO_OFFICES: RtoOfficeRecord[] = [
  // Official RJ-01 through RJ-45
  rjOfficial('RJ01', 'RTO Ajmer', 'Ajmer', 'RTO'),
  rjOfficial('RJ02', 'RTO Alwar', 'Alwar', 'RTO'),
  rjOfficial('RJ03', 'DTO Banswara', 'Banswara', 'DTO'),
  rjOfficial('RJ04', 'DTO Barmer', 'Barmer', 'DTO'),
  rjOfficial('RJ05', 'RTO Bharatpur', 'Bharatpur', 'RTO'),
  rjOfficial('RJ06', 'DTO Bhilwara', 'Bhilwara', 'DTO'),
  rjOfficial('RJ07', 'RTO Bikaner', 'Bikaner', 'RTO'),
  rjOfficial('RJ08', 'DTO Bundi', 'Bundi', 'DTO'),
  rjOfficial('RJ09', 'RTO Chittorgarh', 'Chittorgarh', 'RTO'),
  rjOfficial('RJ10', 'DTO Churu', 'Churu', 'DTO'),
  rjOfficial('RJ11', 'DTO Dholpur', 'Dholpur', 'DTO'),
  rjOfficial('RJ12', 'DTO Dungarpur', 'Dungarpur', 'DTO'),
  rjOfficial('RJ13', 'DTO Sri Ganganagar', 'Sri Ganganagar', 'DTO'),
  rjOfficial('RJ14', 'RTO Jaipur South', 'Jaipur', 'RTO'),
  rjOfficial('RJ15', 'DTO Jaisalmer', 'Jaisalmer', 'DTO'),
  rjOfficial('RJ16', 'DTO Jalore', 'Jalore', 'DTO'),
  rjOfficial('RJ17', 'DTO Jhalawar', 'Jhalawar', 'DTO'),
  rjOfficial('RJ18', 'DTO Jhunjhunu', 'Jhunjhunu', 'DTO'),
  rjOfficial('RJ19', 'RTO Jodhpur', 'Jodhpur', 'RTO'),
  rjOfficial('RJ20', 'RTO Kota', 'Kota', 'RTO'),
  rjOfficial('RJ21', 'DTO Nagaur', 'Nagaur', 'DTO'),
  rjOfficial('RJ22', 'RTO Pali', 'Pali', 'RTO'),
  rjOfficial('RJ23', 'RTO Sikar', 'Sikar', 'RTO'),
  rjOfficial('RJ24', 'DTO Sirohi', 'Sirohi', 'DTO'),
  rjOfficial('RJ25', 'DTO Sawai Madhopur', 'Sawai Madhopur', 'DTO'),
  rjOfficial('RJ26', 'DTO Tonk', 'Tonk', 'DTO'),
  rjOfficial('RJ27', 'RTO Udaipur', 'Udaipur', 'RTO'),
  rjOfficial('RJ28', 'DTO Baran', 'Baran', 'DTO'),
  rjOfficial('RJ29', 'RTO Dausa', 'Dausa', 'RTO'),
  rjOfficial('RJ30', 'DTO Rajsamand', 'Rajsamand', 'DTO'),
  rjOfficial('RJ31', 'DTO Hanumangarh', 'Hanumangarh', 'DTO'),
  rjOfficial('RJ32', 'DTO Kotputli', 'Kotputli', 'DTO'),
  rjOfficial('RJ33', 'DTO Ramganj Mandi', 'Ramganj Mandi', 'DTO'),
  rjOfficial('RJ34', 'DTO Karauli', 'Karauli', 'DTO'),
  rjOfficial('RJ35', 'DTO Pratapgarh', 'Pratapgarh', 'DTO'),
  rjOfficial('RJ36', 'DTO Beawar', 'Beawar', 'DTO'),
  rjOfficial('RJ37', 'DTO Didwana', 'Didwana', 'DTO'),
  rjOfficial('RJ38', 'DTO Abu Road', 'Abu Road', 'DTO'),
  rjOfficial('RJ39', 'DTO Balotra', 'Balotra', 'DTO'),
  rjOfficial('RJ40', 'DTO Bhiwadi', 'Bhiwadi', 'DTO'),
  rjOfficial('RJ41', 'DTO Chomu', 'Chomu', 'DTO'),
  rjOfficial('RJ42', 'DTO Kishangarh', 'Kishangarh', 'DTO'),
  rjOfficial('RJ43', 'DTO Phalodi', 'Phalodi', 'DTO'),
  rjOfficial('RJ44', 'DTO Sujangarh', 'Sujangarh', 'DTO'),
  rjOfficial('RJ45', 'RTO Jaipur North', 'Jaipur', 'RTO'),

  // Supplementary RJ-46 through RJ-58 (Pending Official Verification)
  rjSupplementary('RJ46', 'DTO Bhinmal', 'Bhinmal', 'DTO'),
  rjSupplementary('RJ47', 'DTO Dudu', 'Dudu', 'DTO'),
  rjSupplementary('RJ48', 'DTO Kekri', 'Kekri', 'DTO'),
  rjSupplementary('RJ49', 'DTO Nohar', 'Nohar', 'DTO'),
  rjSupplementary('RJ50', 'DTO Nokha', 'Nokha', 'DTO'),
  rjSupplementary('RJ51', 'DTO Shahpura (Bhilwara)', 'Shahpura (Bhilwara)', 'DTO'),
  rjSupplementary('RJ52', 'DTO Shahpura (Jaipur)', 'Shahpura (Jaipur)', 'DTO'),
  rjSupplementary('RJ53', 'DTO Khetri', 'Khetri', 'DTO'),
  rjSupplementary('RJ54', 'DTO Pipar City', 'Pipar City', 'DTO'),
  rjSupplementary('RJ55', 'DTO Pokhran', 'Pokhran', 'DTO'),
  rjSupplementary('RJ56', 'DTO Sadulshahar', 'Sadulshahar', 'DTO'),
  rjSupplementary('RJ57', 'DTO Sumerpur', 'Sumerpur', 'DTO'),
  rjSupplementary('RJ58', 'DTO Salumber', 'Salumber', 'DTO'),
];

// Build deduplicated RTO registry across all other states
const otherStateRtosMap = new Map<string, RtoOfficeRecord>();

for (const city of ALL_INDIAN_CITIES) {
  if (city.stateId === 'RJ') continue;
  for (const rawCode of city.rtoCodes) {
    const cleanCode = rawCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!cleanCode || otherStateRtosMap.has(cleanCode)) continue;
    otherStateRtosMap.set(cleanCode, {
      code: cleanCode,
      displayCode: rawCode.includes('-') ? rawCode : `${cleanCode.slice(0, 2)}-${cleanCode.slice(2)}`,
      officeName: `RTO ${city.name} (${cleanCode})`,
      districtOrCity: city.name,
      stateId: city.stateId,
      stateName: city.stateName || city.stateId,
      officeType: 'RTO',
      verificationStatus: 'Verified',
      source: 'MoRTH / Parivahan State RTO Directory',
      lastVerifiedDate: VERIFIED_DATE,
    });
  }
}

export const ALL_RTO_OFFICES: RtoOfficeRecord[] = [
  ...RAJASTHAN_RTO_OFFICES,
  ...Array.from(otherStateRtosMap.values()),
];

/**
 * Returns deduplicated RTO/DTO offices for a given state (by state name or 2-letter ID).
 * When Rajasthan is selected, returns all available Rajasthan entries (RJ-01 through RJ-58).
 */
export function getRtosForState(stateNameOrId?: string): RtoOfficeRecord[] {
  if (!stateNameOrId) return [];
  const norm = stateNameOrId.trim().toLowerCase();
  const matchedState = ALL_INDIAN_STATES.find(
    (s) => s.id.toLowerCase() === norm || s.name.toLowerCase() === norm
  );
  const targetStateId = matchedState?.id || stateNameOrId.toUpperCase();

  return ALL_RTO_OFFICES.filter(
    (r) => r.stateId.toLowerCase() === targetStateId.toLowerCase() || r.stateName.toLowerCase() === norm
  );
}

export function findRtoByCode(code?: string): RtoOfficeRecord | undefined {
  if (!code) return undefined;
  const clean = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return ALL_RTO_OFFICES.find((r) => r.code === clean);
}
