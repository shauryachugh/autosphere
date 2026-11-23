/**
 * Formats a numeric value into standard Indian Rupee notation (e.g., ₹1,45,000)
 */
export function formatINR(amount: number, includeDecimals = false): string {
  if (isNaN(amount)) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  };
  
  const formatted = new Intl.NumberFormat('en-IN', options).format(absAmount);
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats large amounts into Lakhs or Crores (e.g., ₹24.5 Lakhs or ₹1.2 Crore)
 */
export function formatLakhsCrores(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2);
    return `₹${lakhs} Lakh`;
  }
  
  return formatINR(amount);
}

/**
 * Format date string into readable Indian format (e.g. 14 Dec 2026)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculates days remaining from today to target date
 */
export function getDaysRemaining(targetDateStr: string): number {
  try {
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Formats mileage / Odometer with comma separation
 */
export function formatKm(km: number): string {
  return new Intl.NumberFormat('en-IN').format(km) + ' km';
}

/**
 * Cleans registration number display
 */
export function formatRegNumber(reg: string): string {
  return reg.toUpperCase().trim();
}
