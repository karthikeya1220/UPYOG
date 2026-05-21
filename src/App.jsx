import React, { useState } from 'react';
import { usePropertyData } from './hooks/usePropertyData';
import { KpiCard } from './components/KpiCard';
import { TenantFilter } from './components/TenantFilter';
import { ComparisonChart } from './components/ComparisonChart';
import { ChatAssistant } from './components/ChatAssistant';
import { formatINR } from './utils/formatters';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Coins,
  AlertCircle,
  Sun,
  Moon,
  Download
} from 'lucide-react';

export default function App() {
  const {
    cities,
    wards,
    selectedCity,
    setSelectedCity,
    selectedWard,
    setSelectedWard,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    properties,
    citySummaries,
    typeDistribution,
    loading,
    totalRegistered,
    approved,
    rejected,
    totalCollection
  } = usePropertyData();

  // Track page pagination for detailed data table
  const [tablePage, setTablePage] = useState(0);
  const itemsPerPage = 8;

  // Manage theme state (Light/Dark Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme to HTML root element
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setTablePage(0);
  };

  const handleWardChange = (ward) => {
    setSelectedWard(ward);
    setTablePage(0);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setTablePage(0);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setTablePage(0);
  };

  // Convert properties to CSV format and trigger browser download
  const handleExportCSV = () => {
    if (!properties || properties.length === 0) return;

    const headers = [
      'Property ID',
      'Tenant City',
      'Owner Name',
      'Property Type',
      'Ward',
      'Area SqFt',
      'Status',
      'Annual Tax INR',
      'Collection INR',
      'Registration Date',
      'Floor Count',
      'Address'
    ];

    const csvRows = [
      headers.join(','),
      ...properties.map(p => [
        p.property_id,
        `"${(p.tenant || '').replace(/"/g, '""')}"`,
        `"${(p.owner_name || '').replace(/"/g, '""')}"`,
        p.property_type,
        `"${(p.ward || '').replace(/"/g, '""')}"`,
        p.area_sqft,
        p.status,
        p.annual_tax_inr,
        p.collection_inr,
        p.registration_date,
        p.floor_count,
        `"${(p.address || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `upyog_properties_${selectedCity.toLowerCase().replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute paginated table items
  const paginatedProperties = React.useMemo(() => {
    const start = tablePage * itemsPerPage;
    return properties.slice(start, start + itemsPerPage);
  }, [properties, tablePage]);

  const maxPages = Math.ceil(properties.length / itemsPerPage);

  return (
    <div className="app-container">
      {/* Sticky Header Section */}
      <header className="header">
        <div className="brand-section">
          <div className="brand-logo">UP</div>
          <div>
            <h1 className="brand-title">UPYOG Property Tax Dashboard</h1>
            <p className="brand-subtitle">Multi-Tenant Analytics Engine</p>
          </div>
        </div>

        {/* Filters and Controls Wrapper */}
        <div className="header-controls">
          <TenantFilter
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={handleCityChange}
            wards={wards}
            selectedWard={selectedWard}
            onSelectWard={handleWardChange}
            startDate={startDate}
            onSelectStartDate={handleStartDateChange}
            endDate={endDate}
            onSelectEndDate={handleEndDateChange}
          />
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Toggle color theme"
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="dashboard-grid">
        <div className="main-content">
          
          {/* KPI Dashboard */}
          <div className="kpi-container">
            <KpiCard
              title="Total Registered"
              value={totalRegistered}
              icon={Building2}
              color="blue"
              format="number"
              loading={loading}
            />
            <KpiCard
              title="Approved Properties"
              value={approved}
              icon={CheckCircle2}
              color="green"
              format="number"
              loading={loading}
            />
            <KpiCard
              title="Rejected Properties"
              value={rejected}
              icon={XCircle}
              color="red"
              format="number"
              loading={loading}
            />
            <KpiCard
              title="Total Collections"
              value={totalCollection}
              icon={Coins}
              color="gold"
              format="currency"
              loading={loading}
            />
          </div>

          {/* Interactive Chart Component */}
          <ComparisonChart
            citySummaries={citySummaries}
            typeDistribution={typeDistribution}
            loading={loading}
          />

          {/* Detailed Records Section */}
          <div className="glass-card details-section">
            <div className="flex-space" style={{ marginBottom: '1rem' }}>
              <div>
                <h2 className="chart-title">Registered Property Details</h2>
                <p className="chart-subtitle">
                  {loading ? (
                    'Loading property details...'
                  ) : properties.length === 0 ? (
                    'No properties found'
                  ) : (
                    `Showing ${tablePage * itemsPerPage + 1} - ${Math.min((tablePage + 1) * itemsPerPage, properties.length)} of ${properties.length} properties`
                  )}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {/* CSV Export Button */}
                <button
                  onClick={handleExportCSV}
                  disabled={loading || properties.length === 0}
                  className="chip-btn export-btn"
                  title="Export properties list to CSV"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.375rem',
                    opacity: (loading || properties.length === 0) ? 0.4 : 1,
                    cursor: (loading || properties.length === 0) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Download size={13} />
                  Export CSV
                </button>

                {/* Pagination controls */}
                {!loading && maxPages > 1 && (
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => setTablePage(p => Math.max(0, p - 1))}
                      disabled={tablePage === 0}
                      className="chip-btn"
                      style={{ opacity: tablePage === 0 ? 0.4 : 1 }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setTablePage(p => Math.min(maxPages - 1, p + 1))}
                      disabled={tablePage === maxPages - 1}
                      className="chip-btn"
                      style={{ opacity: tablePage === maxPages - 1 ? 0.4 : 1 }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="table-wrapper">
                <table className="properties-table">
                  <thead>
                    <tr>
                      <th>Property ID</th>
                      <th>Owner Name</th>
                      <th>Type</th>
                      <th>Area (SqFt)</th>
                      <th>Ward</th>
                      <th>Status</th>
                      <th>Tax Due</th>
                      <th>Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: itemsPerPage }).map((_, idx) => (
                      <tr key={idx} className="skeleton-row">
                        <td><div className="skeleton-cell pulsing" style={{ width: '100px', height: '16px', borderRadius: '4px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '130px', height: '16px', borderRadius: '4px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '80px', height: '16px', borderRadius: '4px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '60px', height: '16px', borderRadius: '4px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '50px', height: '16px', borderRadius: '4px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '70px', height: '22px', borderRadius: '12px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '70px', height: '16px', borderRadius: '4px' }}></div></td>
                        <td><div className="skeleton-cell pulsing" style={{ width: '70px', height: '16px', borderRadius: '4px' }}></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={40} className="text-warning" />
                <p style={{ fontWeight: 600 }}>No properties match this selection.</p>
                <p style={{ fontSize: '0.8125rem' }}>Try clearing your filters or refreshing the page.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="properties-table">
                  <thead>
                    <tr>
                      <th>Property ID</th>
                      <th>Owner Name</th>
                      <th>Type</th>
                      <th>Area (SqFt)</th>
                      <th>Ward</th>
                      <th>Status</th>
                      <th>Tax Due</th>
                      <th>Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProperties.map((p) => {
                      const taxDue = formatINR(p.annual_tax_inr);
                      const taxColl = formatINR(p.collection_inr);

                      return (
                        <tr key={p.property_id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.property_id}</td>
                          <td>{p.owner_name}</td>
                          <td>{p.property_type}</td>
                          <td>{p.area_sqft} sqft</td>
                          <td>{p.ward}</td>
                          <td>
                            <span className={`status-badge badge-${p.status.toLowerCase()}`}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{taxDue}</td>
                          <td style={{ fontWeight: 700, color: p.collection_inr > 0 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                            {taxColl}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* AI Sidebar Chat Panel */}
        <ChatAssistant selectedCity={selectedCity} />
      </main>
    </div>
  );
}
