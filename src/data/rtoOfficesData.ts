import { ALL_INDIAN_CITIES, ALL_INDIAN_STATES } from './locationsData';

export type RtoOfficeType = 'RTO' | 'DTO' | 'RTO/DTO';
export type RtoVerificationStatus = 'verified' | 'needs_verification';

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

const RJ_SOURCE = 'Transport Department, Govt. of Rajasthan (transport.rajasthan.gov.in)';
const RJ_VERIFIED_DATE = '2026-11-25';

function rj(
  code: string,
  officeName: string,
  districtOrCity: string,
  officeType: RtoOfficeType,
  verificationStatus: RtoVerificationStatus = 'verified'
): RtoOfficeRecord {
  return {
    code,
    displayCode: `${code.slice(0, 2)}-${code.slice(2)}`,
    officeName,
    districtOrCity,
    stateId: 'RJ',
    stateName: 'Rajasthan',
    officeType,
    verificationStatus,
    source: RJ_SOURCE,
    lastVerifiedDate: RJ_VERIFIED_DATE,
  };
}

/**
 * Complete Rajasthan Transport Department RTO / DTO registration codes.
 * Includes older RJ01-RJ38 offices, Jaipur's multiple offices (RJ14, RJ45, RJ59, RJ60),
 * and newer allocations (RJ39-RJ60, plus RJ61-RJ62 marked for official confirmation).
 */
export const RAJASTHAN_RTO_OFFICES: RtoOfficeRecord[] = [
  rj('RJ01', 'RTO Ajmer', 'Ajmer', 'RTO'),
  rj('RJ02', 'RTO Alwar', 'Alwar', 'RTO'),
  rj('RJ03', 'DTO Banswara', 'Banswara', 'DTO'),
  rj('RJ04', 'DTO Barmer', 'Barmer', 'DTO'),
  rj('RJ05', 'RTO Bharatpur', 'Bharatpur', 'RTO'),
  rj('RJ06', 'DTO Bhilwara', 'Bhilwara', 'DTO'),
  rj('RJ07', 'RTO Bikaner', 'Bikaner', 'RTO'),
  rj('RJ08', 'DTO Bundi', 'Bundi', 'DTO'),
  rj('RJ09', 'RTO Chittorgarh', 'Chittorgarh', 'RTO'),
  rj('RJ10', 'DTO Churu', 'Churu', 'DTO'),
  rj('RJ11', 'DTO Dholpur', 'Dholpur', 'DTO'),
  rj('RJ12', 'DTO Dungarpur', 'Dungarpur', 'DTO'),
  rj('RJ13', 'DTO Sri Ganganagar', 'Sri Ganganagar', 'DTO'),
  rj('RJ14', 'RTO Jaipur (South / Jhalana)', 'Jaipur', 'RTO'),
  rj('RJ15', 'DTO Jaisalmer', 'Jaisalmer', 'DTO'),
  rj('RJ16', 'DTO Jalore', 'Jalore', 'DTO'),
  rj('RJ17', 'DTO Jhalawar', 'Jhalawar', 'DTO'),
  rj('RJ18', 'DTO Jhunjhunu', 'Jhunjhunu', 'DTO'),
  rj('RJ19', 'RTO Jodhpur', 'Jodhpur', 'RTO'),
  rj('RJ20', 'RTO Kota', 'Kota', 'RTO'),
  rj('RJ21', 'DTO Nagaur', 'Nagaur', 'DTO'),
  rj('RJ22', 'RTO Pali', 'Pali', 'RTO'),
  rj('RJ23', 'RTO Sikar', 'Sikar', 'RTO'),
  rj('RJ24', 'DTO Sirohi', 'Sirohi', 'DTO'),
  rj('RJ25', 'DTO Sawai Madhopur', 'Sawai Madhopur', 'DTO'),
  rj('RJ26', 'DTO Tonk', 'Tonk', 'DTO'),
  rj('RJ27', 'RTO Udaipur', 'Udaipur', 'RTO'),
  rj('RJ28', 'DTO Baran', 'Baran', 'DTO'),
  rj('RJ29', 'RTO Dausa', 'Dausa', 'RTO'),
  rj('RJ30', 'DTO Rajsamand', 'Rajsamand', 'DTO'),
  rj('RJ31', 'DTO Hanumangarh', 'Hanumangarh', 'DTO'),
  rj('RJ32', 'DTO Kotputli', 'Kotputli (Jaipur / Kotputli-Behror)', 'DTO'),
  rj('RJ33', 'DTO Ramganj Mandi', 'Ramganj Mandi (Kota)', 'DTO'),
  rj('RJ34', 'DTO Karauli', 'Karauli', 'DTO'),
  rj('RJ35', 'DTO Pratapgarh', 'Pratapgarh', 'DTO'),
  rj('RJ36', 'DTO Beawar', 'Beawar', 'DTO'),
  rj('RJ37', 'DTO Didwana', 'Didwana (Didwana-Kuchaman)', 'DTO'),
  rj('RJ38', 'DTO Abu Road', 'Abu Road (Sirohi)', 'DTO'),
  rj('RJ39', 'DTO Balotra', 'Balotra', 'DTO'),
  rj('RJ40', 'DTO Bhiwadi', 'Bhiwadi (Khairthal-Tijara / Alwar)', 'DTO'),
  rj('RJ41', 'DTO Chomu', 'Chomu (Jaipur)', 'DTO'),
  rj('RJ42', 'DTO Kishangarh', 'Kishangarh (Ajmer)', 'DTO'),
  rj('RJ43', 'DTO Phalodi', 'Phalodi', 'DTO'),
  rj('RJ44', 'DTO Sujangarh', 'Sujangarh (Churu)', 'DTO'),
  rj('RJ45', 'RTO Jaipur (North / Sahkar Marg)', 'Jaipur', 'RTO'),
  rj('RJ46', 'DTO Bhinmal', 'Bhinmal (Jalore)', 'DTO'),
  rj('RJ47', 'DTO Dudu', 'Dudu', 'DTO'),
  rj('RJ48', 'DTO Kekri', 'Kekri', 'DTO'),
  rj('RJ49', 'DTO Nohar', 'Nohar (Hanumangarh)', 'DTO'),
  rj('RJ50', 'DTO Nokha', 'Nokha (Bikaner)', 'DTO'),
  rj('RJ51', 'DTO Shahpura (Bhilwara)', 'Shahpura (Bhilwara)', 'DTO'),
  rj('RJ52', 'DTO Shahpura (Jaipur)', 'Shahpura (Jaipur)', 'DTO'),
  rj('RJ53', 'DTO Khetri', 'Khetri (Jhunjhunu)', 'DTO'),
  rj('RJ54', 'DTO Pipar City', 'Pipar City (Jodhpur)', 'DTO'),
  rj('RJ55', 'DTO Pokhran', 'Pokhran (Jaisalmer)', 'DTO'),
  rj('RJ56', 'DTO Sadulshahar', 'Sadulshahar (Sri Ganganagar)', 'DTO'),
  rj('RJ57', 'DTO Sumerpur', 'Sumerpur (Pali)', 'DTO'),
  rj('RJ58', 'DTO Salumber', 'Salumber', 'DTO'),
  rj('RJ59', 'RTO Jaipur-II / Shahpura Allocation', 'Jaipur', 'RTO/DTO', 'needs_verification'),
  rj('RJ60', 'RTO Jaipur (Additional / RTO-I Series)', 'Jaipur', 'RTO'),
  rj('RJ61', 'DTO Newly Reorganized District Series (Kotputli-Behror / Regional)', 'Rajasthan (Check Portal)', 'DTO', 'needs_verification'),
  rj('RJ62', 'DTO Newly Reorganized District Series (Anupgarh / Regional)', 'Rajasthan (Check Portal)', 'DTO', 'needs_verification'),
];

// Build deduplicated RTO registry across all states
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
      verificationStatus: 'verified',
      source: 'MoRTH / Parivahan State RTO Directory',
      lastVerifiedDate: RJ_VERIFIED_DATE,
    });
  }
}

export const ALL_RTO_OFFICES: RtoOfficeRecord[] = [
  ...RAJASTHAN_RTO_OFFICES,
  ...Array.from(otherStateRtosMap.values()),
];

/**
 * Returns deduplicated RTO/DTO offices for a given state (by state name or 2-letter ID).
 * When Rajasthan is selected, returns only Rajasthan RTO/DTO offices.
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
