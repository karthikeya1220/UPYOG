/**
 * Centralized formatting utility functions for the UPYOG dashboard.
 * Provides consistent formatting for currency (INR), standard numbers, and percentages.
 */

/**
 * Formats a numeric value into Indian Rupee (INR) currency format.
 * @param {number} value - The value to format.
 * @param {number} maxDigits - Maximum fraction digits (defaults to 0).
 * @returns {string} Formatted currency string.
 */
export function formatINR(value, maxDigits = 0) {
  if (value === undefined || value === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: maxDigits
  }).format(value);
}

/**
 * Formats a numeric value with Indian locale grouping commas.
 * @param {number} value - The value to format.
 * @returns {string} Formatted number string.
 */
export function formatNumber(value) {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
}

/**
 * Formats a decimal/percentage value into a percentage string.
 * @param {number} value - The percentage value (e.g. 85.5).
 * @returns {string} Formatted percentage string.
 */
export function formatPercent(value) {
  if (value === undefined || value === null) return '0.0%';
  return `${value.toFixed(1)}%`;
}
