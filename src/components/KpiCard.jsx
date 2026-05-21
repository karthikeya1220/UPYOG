import React from 'react';

/**
 * Reusable Card component to display key performance indicators (KPIs).
 * Supports counts, currencies (INR), and percentages.
 */
export function KpiCard({ title, value, icon: Icon, color = 'blue', format = 'number' }) {
  
  // Custom formatter for the display value
  const formattedValue = React.useMemo(() => {
    if (value === undefined || value === null) return '0';
    
    if (format === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value);
    }
    
    if (format === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    
    return new Intl.NumberFormat('en-IN').format(value);
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
