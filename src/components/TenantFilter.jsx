import PropTypes from 'prop-types';
import { ChevronDown, MapPin } from 'lucide-react';

/**
 * Dropdown filter to select specific tenant cities or view aggregated metrics.
 */
export function TenantFilter({ cities, selectedCity, onSelectCity }) {
  return (
    <div className="filter-container">
      <MapPin size={16} className="text-secondary" />
      <span className="filter-label">Tenant City:</span>
      <div className="select-wrapper">
        <select
          value={selectedCity}
          onChange={(e) => onSelectCity(e.target.value)}
          className="custom-select"
        >
          <option value="All Cities">All Cities (Aggregated)</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="select-icon" />
      </div>
    </div>
  );
}

TenantFilter.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCity: PropTypes.string.isRequired,
  onSelectCity: PropTypes.func.isRequired
};

