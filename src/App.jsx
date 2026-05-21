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
  AlertCircle
} from 'lucide-react';

export default function App() {
  const {
    cities,
    selectedCity,
    setSelectedCity,
    properties,
    citySummaries,
    totalRegistered,
    approved,
    rejected,
    totalCollection
  } = usePropertyData();

  // Track page pagination for detailed data table
  const [tablePage, setTablePage] = useState(0);
  const itemsPerPage = 8;

  // Handler for changing city and resetting page
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setTablePage(0);
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

        {/* Tenant Filter Dropdown */}
        <TenantFilter
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleCityChange}
        />
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
            />
            <KpiCard
              title="Approved Properties"
              value={approved}
              icon={CheckCircle2}
              color="green"
              format="number"
            />
            <KpiCard
              title="Rejected Properties"
              value={rejected}
              icon={XCircle}
              color="red"
              format="number"
            />
            <KpiCard
              title="Total Collections"
              value={totalCollection}
              icon={Coins}
              color="gold"
              format="currency"
            />
          </div>

          {/* Interactive Chart Component */}
          <ComparisonChart citySummaries={citySummaries} />

          {/* Detailed Records Section */}
          <div className="glass-card details-section">
            <div className="flex-space" style={{ marginBottom: '1rem' }}>
              <div>
                <h2 className="chart-title">Registered Property Details</h2>
                <p className="chart-subtitle">
                  Showing {properties.length === 0 ? 0 : tablePage * itemsPerPage + 1} - {Math.min((tablePage + 1) * itemsPerPage, properties.length)} of {properties.length} properties for {selectedCity}
                </p>
              </div>
              
              {/* Pagination controls */}
              {maxPages > 1 && (
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

            {properties.length === 0 ? (
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
