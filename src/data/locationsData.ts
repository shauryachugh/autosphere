import { IndianState, IndianCity } from '../types/automotive.types';

// Complete 28 States + 8 Union Territories
export const ALL_INDIAN_STATES: IndianState[] = [
  // 28 States
  { id: 'AP', name: 'Andhra Pradesh', type: 'state', capital: 'Amaravati', rtoCodePrefix: 'AP', gstStateCode: '37', isActive: true },
  { id: 'AR', name: 'Arunachal Pradesh', type: 'state', capital: 'Itanagar', rtoCodePrefix: 'AR', gstStateCode: '12', isActive: true },
  { id: 'AS', name: 'Assam', type: 'state', capital: 'Dispur', rtoCodePrefix: 'AS', gstStateCode: '18', isActive: true },
  { id: 'BR', name: 'Bihar', type: 'state', capital: 'Patna', rtoCodePrefix: 'BR', gstStateCode: '10', isActive: true },
  { id: 'CG', name: 'Chhattisgarh', type: 'state', capital: 'Raipur', rtoCodePrefix: 'CG', gstStateCode: '22', isActive: true },
  { id: 'GA', name: 'Goa', type: 'state', capital: 'Panaji', rtoCodePrefix: 'GA', gstStateCode: '30', isActive: true },
  { id: 'GJ', name: 'Gujarat', type: 'state', capital: 'Gandhinagar', rtoCodePrefix: 'GJ', gstStateCode: '24', isActive: true },
  { id: 'HR', name: 'Haryana', type: 'state', capital: 'Chandigarh', rtoCodePrefix: 'HR', gstStateCode: '06', isActive: true },
  { id: 'HP', name: 'Himachal Pradesh', type: 'state', capital: 'Shimla', rtoCodePrefix: 'HP', gstStateCode: '02', isActive: true },
  { id: 'JH', name: 'Jharkhand', type: 'state', capital: 'Ranchi', rtoCodePrefix: 'JH', gstStateCode: '20', isActive: true },
  { id: 'KA', name: 'Karnataka', type: 'state', capital: 'Bengaluru', rtoCodePrefix: 'KA', gstStateCode: '29', isActive: true },
  { id: 'KL', name: 'Kerala', type: 'state', capital: 'Thiruvananthapuram', rtoCodePrefix: 'KL', gstStateCode: '32', isActive: true },
  { id: 'MP', name: 'Madhya Pradesh', type: 'state', capital: 'Bhopal', rtoCodePrefix: 'MP', gstStateCode: '23', isActive: true },
  { id: 'MH', name: 'Maharashtra', type: 'state', capital: 'Mumbai', rtoCodePrefix: 'MH', gstStateCode: '27', isActive: true },
  { id: 'MN', name: 'Manipur', type: 'state', capital: 'Imphal', rtoCodePrefix: 'MN', gstStateCode: '14', isActive: true },
  { id: 'ML', name: 'Meghalaya', type: 'state', capital: 'Shillong', rtoCodePrefix: 'ML', gstStateCode: '17', isActive: true },
  { id: 'MZ', name: 'Mizoram', type: 'state', capital: 'Aizawl', rtoCodePrefix: 'MZ', gstStateCode: '15', isActive: true },
  { id: 'NL', name: 'Nagaland', type: 'state', capital: 'Kohima', rtoCodePrefix: 'NL', gstStateCode: '13', isActive: true },
  { id: 'OD', name: 'Odisha', type: 'state', capital: 'Bhubaneswar', rtoCodePrefix: 'OD', gstStateCode: '21', isActive: true },
  { id: 'PB', name: 'Punjab', type: 'state', capital: 'Chandigarh', rtoCodePrefix: 'PB', gstStateCode: '03', isActive: true },
  { id: 'RJ', name: 'Rajasthan', type: 'state', capital: 'Jaipur', rtoCodePrefix: 'RJ', gstStateCode: '08', isActive: true },
  { id: 'SK', name: 'Sikkim', type: 'state', capital: 'Gangtok', rtoCodePrefix: 'SK', gstStateCode: '11', isActive: true },
  { id: 'TN', name: 'Tamil Nadu', type: 'state', capital: 'Chennai', rtoCodePrefix: 'TN', gstStateCode: '33', isActive: true },
  { id: 'TS', name: 'Telangana', type: 'state', capital: 'Hyderabad', rtoCodePrefix: 'TS', gstStateCode: '36', isActive: true },
  { id: 'TR', name: 'Tripura', type: 'state', capital: 'Agartala', rtoCodePrefix: 'TR', gstStateCode: '16', isActive: true },
  { id: 'UP', name: 'Uttar Pradesh', type: 'state', capital: 'Lucknow', rtoCodePrefix: 'UP', gstStateCode: '09', isActive: true },
  { id: 'UK', name: 'Uttarakhand', type: 'state', capital: 'Dehradun', rtoCodePrefix: 'UK', gstStateCode: '05', isActive: true },
  { id: 'WB', name: 'West Bengal', type: 'state', capital: 'Kolkata', rtoCodePrefix: 'WB', gstStateCode: '19', isActive: true },

  // 8 Union Territories
  { id: 'AN', name: 'Andaman and Nicobar Islands', type: 'union_territory', capital: 'Port Blair', rtoCodePrefix: 'AN', gstStateCode: '35', isActive: true },
  { id: 'CH', name: 'Chandigarh', type: 'union_territory', capital: 'Chandigarh', rtoCodePrefix: 'CH', gstStateCode: '04', isActive: true },
  { id: 'DD', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'union_territory', capital: 'Daman', rtoCodePrefix: 'DD', gstStateCode: '26', isActive: true },
  { id: 'DL', name: 'Delhi (NCT)', type: 'union_territory', capital: 'New Delhi', rtoCodePrefix: 'DL', gstStateCode: '07', isActive: true },
  { id: 'JK', name: 'Jammu and Kashmir', type: 'union_territory', capital: 'Srinagar / Jammu', rtoCodePrefix: 'JK', gstStateCode: '01', isActive: true },
  { id: 'LA', name: 'Ladakh', type: 'union_territory', capital: 'Leh', rtoCodePrefix: 'LA', gstStateCode: '38', isActive: true },
  { id: 'LD', name: 'Lakshadweep', type: 'union_territory', capital: 'Kavaratti', rtoCodePrefix: 'LD', gstStateCode: '31', isActive: true },
  { id: 'PY', name: 'Puducherry', type: 'union_territory', capital: 'Puducherry', rtoCodePrefix: 'PY', gstStateCode: '34', isActive: true },
];

export const ALL_INDIAN_CITIES: IndianCity[] = [
  // --- KARNATAKA ---
  { id: 'bengaluru', name: 'Bengaluru', stateId: 'KA', stateName: 'Karnataka', tier: 1, rtoCodes: ['KA-01', 'KA-02', 'KA-03', 'KA-04', 'KA-05', 'KA-50', 'KA-51', 'KA-53'], isMetro: true, municipalParkingTaxINR: 4000, localCessPercent: 0, isActive: true },
  { id: 'mysuru', name: 'Mysuru', stateId: 'KA', stateName: 'Karnataka', tier: 2, rtoCodes: ['KA-09', 'KA-55'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'hubballi-dharwad', name: 'Hubballi-Dharwad', stateId: 'KA', stateName: 'Karnataka', tier: 2, rtoCodes: ['KA-25'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'mangaluru', name: 'Mangaluru', stateId: 'KA', stateName: 'Karnataka', tier: 2, rtoCodes: ['KA-19'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'belagavi', name: 'Belagavi', stateId: 'KA', stateName: 'Karnataka', tier: 2, rtoCodes: ['KA-22'], isMetro: false, municipalParkingTaxINR: 1200, localCessPercent: 0, isActive: true },

  // --- MAHARASHTRA ---
  { id: 'mumbai', name: 'Mumbai', stateId: 'MH', stateName: 'Maharashtra', tier: 1, rtoCodes: ['MH-01', 'MH-02', 'MH-03', 'MH-47'], isMetro: true, municipalParkingTaxINR: 4000, localCessPercent: 0, isActive: true },
  { id: 'pune', name: 'Pune', stateId: 'MH', stateName: 'Maharashtra', tier: 1, rtoCodes: ['MH-12', 'MH-14', 'MH-54'], isMetro: true, municipalParkingTaxINR: 3000, localCessPercent: 0, isActive: true },
  { id: 'nagpur', name: 'Nagpur', stateId: 'MH', stateName: 'Maharashtra', tier: 2, rtoCodes: ['MH-31', 'MH-40', 'MH-49'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'nashik', name: 'Nashik', stateId: 'MH', stateName: 'Maharashtra', tier: 2, rtoCodes: ['MH-15', 'MH-51'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'thane', name: 'Thane', stateId: 'MH', stateName: 'Maharashtra', tier: 1, rtoCodes: ['MH-04', 'MH-48'], isMetro: true, municipalParkingTaxINR: 3500, localCessPercent: 0, isActive: true },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', stateId: 'MH', stateName: 'Maharashtra', tier: 2, rtoCodes: ['MH-20'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- DELHI (NCT) ---
  { id: 'new-delhi', name: 'New Delhi', stateId: 'DL', stateName: 'Delhi (NCT)', tier: 1, rtoCodes: ['DL-01', 'DL-02', 'DL-03', 'DL-04', 'DL-05', 'DL-06', 'DL-07', 'DL-08', 'DL-09', 'DL-10', 'DL-11', 'DL-12', 'DL-13', 'DL-14'], isMetro: true, municipalParkingTaxINR: 4000, localCessPercent: 0, isActive: true },

  // --- HARYANA ---
  { id: 'gurugram', name: 'Gurugram', stateId: 'HR', stateName: 'Haryana', tier: 1, rtoCodes: ['HR-26', 'HR-72', 'HR-98'], isMetro: true, municipalParkingTaxINR: 3000, localCessPercent: 0, isActive: true },
  { id: 'faridabad', name: 'Faridabad', stateId: 'HR', stateName: 'Haryana', tier: 2, rtoCodes: ['HR-38', 'HR-51'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'panchkula', name: 'Panchkula', stateId: 'HR', stateName: 'Haryana', tier: 2, rtoCodes: ['HR-03', 'HR-68'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- UTTAR PRADESH ---
  { id: 'noida', name: 'Noida', stateId: 'UP', stateName: 'Uttar Pradesh', tier: 1, rtoCodes: ['UP-16'], isMetro: true, municipalParkingTaxINR: 3000, localCessPercent: 0, isActive: true },
  { id: 'ghaziabad', name: 'Ghaziabad', stateId: 'UP', stateName: 'Uttar Pradesh', tier: 2, rtoCodes: ['UP-14'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'lucknow', name: 'Lucknow', stateId: 'UP', stateName: 'Uttar Pradesh', tier: 2, rtoCodes: ['UP-32'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'kanpur', name: 'Kanpur', stateId: 'UP', stateName: 'Uttar Pradesh', tier: 2, rtoCodes: ['UP-78'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'varanasi', name: 'Varanasi', stateId: 'UP', stateName: 'Uttar Pradesh', tier: 2, rtoCodes: ['UP-65'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'agra', name: 'Agra', stateId: 'UP', stateName: 'Uttar Pradesh', tier: 2, rtoCodes: ['UP-80'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- TAMIL NADU ---
  { id: 'chennai', name: 'Chennai', stateId: 'TN', stateName: 'Tamil Nadu', tier: 1, rtoCodes: ['TN-01', 'TN-02', 'TN-03', 'TN-04', 'TN-05', 'TN-06', 'TN-07', 'TN-09', 'TN-10', 'TN-14'], isMetro: true, municipalParkingTaxINR: 3500, localCessPercent: 0, isActive: true },
  { id: 'coimbatore', name: 'Coimbatore', stateId: 'TN', stateName: 'Tamil Nadu', tier: 2, rtoCodes: ['TN-37', 'TN-38', 'TN-66', 'TN-99'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'madurai', name: 'Madurai', stateId: 'TN', stateName: 'Tamil Nadu', tier: 2, rtoCodes: ['TN-58', 'TN-59'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- TELANGANA ---
  { id: 'hyderabad', name: 'Hyderabad', stateId: 'TS', stateName: 'Telangana', tier: 1, rtoCodes: ['TS-07', 'TS-08', 'TS-09', 'TS-10', 'TS-11', 'TS-12', 'TS-13'], isMetro: true, municipalParkingTaxINR: 3500, localCessPercent: 0, isActive: true },
  { id: 'warangal', name: 'Warangal', stateId: 'TS', stateName: 'Telangana', tier: 2, rtoCodes: ['TS-03'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- GUJARAT ---
  { id: 'ahmedabad', name: 'Ahmedabad', stateId: 'GJ', stateName: 'Gujarat', tier: 1, rtoCodes: ['GJ-01', 'GJ-27'], isMetro: true, municipalParkingTaxINR: 3000, localCessPercent: 0, isActive: true },
  { id: 'surat', name: 'Surat', stateId: 'GJ', stateName: 'Gujarat', tier: 2, rtoCodes: ['GJ-05'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'vadodara', name: 'Vadodara', stateId: 'GJ', stateName: 'Gujarat', tier: 2, rtoCodes: ['GJ-06'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },
  { id: 'rajkot', name: 'Rajkot', stateId: 'GJ', stateName: 'Gujarat', tier: 2, rtoCodes: ['GJ-03'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- WEST BENGAL ---
  { id: 'kolkata', name: 'Kolkata', stateId: 'WB', stateName: 'West Bengal', tier: 1, rtoCodes: ['WB-01', 'WB-02', 'WB-03', 'WB-04', 'WB-05', 'WB-06', 'WB-07', 'WB-08', 'WB-19', 'WB-20'], isMetro: true, municipalParkingTaxINR: 3000, localCessPercent: 0, isActive: true },
  { id: 'howrah', name: 'Howrah', stateId: 'WB', stateName: 'West Bengal', tier: 2, rtoCodes: ['WB-12', 'WB-14'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },
  { id: 'siliguri', name: 'Siliguri', stateId: 'WB', stateName: 'West Bengal', tier: 2, rtoCodes: ['WB-73', 'WB-74'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- RAJASTHAN ---
  { id: 'jaipur', name: 'Jaipur', stateId: 'RJ', stateName: 'Rajasthan', tier: 2, rtoCodes: ['RJ-14', 'RJ-45'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'jodhpur', name: 'Jodhpur', stateId: 'RJ', stateName: 'Rajasthan', tier: 2, rtoCodes: ['RJ-19'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'udaipur', name: 'Udaipur', stateId: 'RJ', stateName: 'Rajasthan', tier: 2, rtoCodes: ['RJ-27'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- KERALA ---
  { id: 'kochi', name: 'Kochi', stateId: 'KL', stateName: 'Kerala', tier: 2, rtoCodes: ['KL-07', 'KL-43'], isMetro: false, municipalParkingTaxINR: 2500, localCessPercent: 1.0, isActive: true },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', stateId: 'KL', stateName: 'Kerala', tier: 2, rtoCodes: ['KL-01', 'KL-15', 'KL-21'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 1.0, isActive: true },
  { id: 'kozhikode', name: 'Kozhikode', stateId: 'KL', stateName: 'Kerala', tier: 2, rtoCodes: ['KL-11'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 1.0, isActive: true },

  // --- PUNJAB & CHANDIGARH ---
  { id: 'chandigarh-city', name: 'Chandigarh', stateId: 'CH', stateName: 'Chandigarh', tier: 2, rtoCodes: ['CH-01'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'ludhiana', name: 'Ludhiana', stateId: 'PB', stateName: 'Punjab', tier: 2, rtoCodes: ['PB-10'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },
  { id: 'amritsar', name: 'Amritsar', stateId: 'PB', stateName: 'Punjab', tier: 2, rtoCodes: ['PB-02'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- ANDHRA PRADESH ---
  { id: 'visakhapatnam', name: 'Visakhapatnam', stateId: 'AP', stateName: 'Andhra Pradesh', tier: 2, rtoCodes: ['AP-31', 'AP-32'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'vijayawada', name: 'Vijayawada', stateId: 'AP', stateName: 'Andhra Pradesh', tier: 2, rtoCodes: ['AP-16'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },

  // --- MADHYA PRADESH ---
  { id: 'indore', name: 'Indore', stateId: 'MP', stateName: 'Madhya Pradesh', tier: 2, rtoCodes: ['MP-09'], isMetro: false, municipalParkingTaxINR: 2000, localCessPercent: 0, isActive: true },
  { id: 'bhopal', name: 'Bhopal', stateId: 'MP', stateName: 'Madhya Pradesh', tier: 2, rtoCodes: ['MP-04'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },

  // --- BIHAR & JHARKHAND ---
  { id: 'patna', name: 'Patna', stateId: 'BR', stateName: 'Bihar', tier: 2, rtoCodes: ['BR-01'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },
  { id: 'ranchi', name: 'Ranchi', stateId: 'JH', stateName: 'Jharkhand', tier: 2, rtoCodes: ['JH-01'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- ODISHA & CHHATTISGARH ---
  { id: 'bhubaneswar', name: 'Bhubaneswar', stateId: 'OD', stateName: 'Odisha', tier: 2, rtoCodes: ['OD-02', 'OD-33'], isMetro: false, municipalParkingTaxINR: 1800, localCessPercent: 0, isActive: true },
  { id: 'raipur', name: 'Raipur', stateId: 'CG', stateName: 'Chhattisgarh', tier: 2, rtoCodes: ['CG-04'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },

  // --- ASSAM & GOA & UTTARAKHAND ---
  { id: 'guwahati', name: 'Guwahati', stateId: 'AS', stateName: 'Assam', tier: 2, rtoCodes: ['AS-01'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'goa-panaji', name: 'Panaji', stateId: 'GA', stateName: 'Goa', tier: 3, rtoCodes: ['GA-01', 'GA-07'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'dehradun', name: 'Dehradun', stateId: 'UK', stateName: 'Uttarakhand', tier: 2, rtoCodes: ['UK-07'], isMetro: false, municipalParkingTaxINR: 1500, localCessPercent: 0, isActive: true },
  { id: 'srinagar', name: 'Srinagar', stateId: 'JK', stateName: 'Jammu and Kashmir', tier: 3, rtoCodes: ['JK-01'], isMetro: false, municipalParkingTaxINR: 1000, localCessPercent: 0, isActive: true },
];

export const STATES_BY_ID = new Map(ALL_INDIAN_STATES.map(s => [s.id, s]));
export const CITIES_BY_ID = new Map(ALL_INDIAN_CITIES.map(c => [c.id, c]));

// Helper to filter cities by state
export function getCitiesForState(stateId: string): IndianCity[] {
  return ALL_INDIAN_CITIES.filter(c => c.stateId.toUpperCase() === stateId.toUpperCase());
}

// Search utility across states and cities
export function searchLocations(query: string): { cities: IndianCity[]; states: IndianState[] } {
  const q = query.trim().toLowerCase();
  if (!q) return { cities: ALL_INDIAN_CITIES.slice(0, 10), states: ALL_INDIAN_STATES.slice(0, 5) };

  const matchedCities = ALL_INDIAN_CITIES.filter(
    c => c.name.toLowerCase().includes(q) || (c.stateName && c.stateName.toLowerCase().includes(q)) || c.rtoCodes.some(r => r.toLowerCase().includes(q))
  );

  const matchedStates = ALL_INDIAN_STATES.filter(
    s => s.name.toLowerCase().includes(q) || s.id.toLowerCase() === q || s.capital.toLowerCase().includes(q)
  );

  return { cities: matchedCities, states: matchedStates };
}
