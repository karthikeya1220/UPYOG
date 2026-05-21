import PropTypes from 'prop-types';
import { ChevronDown, MapPin, Calendar, Compass } from 'lucide-react';

/**
 * Filter panel to select specific cities, wards, and date ranges.
 */
export function TenantFilter({
  cities,
  selectedCity,
  onSelectCity,
  wards = [],
  selectedWard = 'All Wards',
  onSelectWard = () => {},
  startDate = '',
  onSelectStartDate = () => {},
  endDate = '',
  onSelectEndDate = () => {},
}) {
  const isWardDisabled = selectedCity === 'All Cities';

  return (
    <div className="filters-wrapper">
      {/* City Filter */}
      <div className="filter-group">
        <div className="filter-label-wrapper">
          <MapPin size={14} className="text-secondary" />
          <span className="filter-label">City:</span>
        </div>
        <div className="select-wrapper">
          <select
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="custom-select"
          >
            <option value="All Cities">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-icon" />
        </div>
      </div>

      {/* Ward Filter */}
      <div className="filter-group">
        <div className="filter-label-wrapper">
          <Compass size={14} className="text-secondary" />
          <span className="filter-label">Ward:</span>
        </div>
        <div className="select-wrapper">
          <select
            value={selectedWard}
            onChange={(e) => onSelectWard(e.target.value)}
            className="custom-select"
            disabled={isWardDisabled}
            style={{ opacity: isWardDisabled ? 0.5 : 1, cursor: isWardDisabled ? 'not-allowed' : 'pointer' }}
          >
            <option value="All Wards">All Wards</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-icon" />
        </div>
      </div>

      {/* Date Range: From */}
      <div className="filter-group">
        <div className="filter-label-wrapper">
          <Calendar size={14} className="text-secondary" />
          <span className="filter-label">From:</span>
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onSelectStartDate(e.target.value)}
          className="custom-date-input"
        />
      </div>

      {/* Date Range: To */}
      <div className="filter-group">
        <div className="filter-label-wrapper">
          <Calendar size={14} className="text-secondary" />
          <span className="filter-label">To:</span>
        </div>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onSelectEndDate(e.target.value)}
          className="custom-date-input"
        />
      </div>
    </div>
  );
}

TenantFilter.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCity: PropTypes.string.isRequired,
  onSelectCity: PropTypes.func.isRequired,
  wards: PropTypes.arrayOf(PropTypes.string),
  selectedWard: PropTypes.string,
  onSelectWard: PropTypes.func,
  startDate: PropTypes.string,
  onSelectStartDate: PropTypes.func,
  endDate: PropTypes.string,
  onSelectEndDate: PropTypes.func,
};


