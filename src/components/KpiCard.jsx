import React from 'react';
import PropTypes from 'prop-types';
import { formatINR, formatNumber, formatPercent } from '../utils/formatters';

/**
 * Reusable Card component to display key performance indicators (KPIs).
 * Supports counts, currencies (INR), and percentages.
 */
export function KpiCard({ title, value, icon: Icon, color = 'blue', format = 'number' }) {
  
  // Custom formatter for the display value
  const formattedValue = React.useMemo(() => {
    if (format === 'currency') {
      return formatINR(value);
    }
    if (format === 'percent') {
      return formatPercent(value);
    }
    return formatNumber(value);
  }, [value, format]);

  // Map theme accent color to specific styling classes in index.css
  const cardColorClass = `kpi-${color}`;

  return (
    <div className={`glass-card kpi-card ${cardColorClass}`}>
      {Icon && (
        <div className="kpi-icon-wrapper">
          <Icon size={22} strokeWidth={2.5} />
        </div>
      )}
      <div className="kpi-info">
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">{formattedValue}</div>
      </div>
    </div>
  );
}

KpiCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(['blue', 'green', 'red', 'gold', 'amber']),
  format: PropTypes.oneOf(['number', 'currency', 'percent'])
};

