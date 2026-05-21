import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import { formatINR } from '../utils/formatters';

// Colors mapped to property types for a premium, consistent visual identity
const COLOR_MAP = {
  'Residential': '#3b82f6', // Premium Blue
  'Commercial': '#10b981', // Premium Emerald Green
  'Industrial': '#f59e0b'   // Premium Amber/Gold
};
const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// Custom interactive tooltip for bar charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-city">{label}</p>
        {payload.map((item, idx) => {
          const val = item.value;
          const formattedVal =
            item.name === 'Total Collection'
              ? formatINR(val)
              : `${val} Properties`;

          return (
            <p key={idx} className="tooltip-value" style={{ color: item.color }}>
              {item.name}: {formattedVal}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string
};

/**
 * Recharts component showing data comparisons across all cities.
 * Includes toggles to switch between tax collections, property status distribution,
 * and a Pie Chart showing property type distribution.
 */
export function ComparisonChart({ citySummaries, typeDistribution = [], loading = false }) {
  const [viewType, setViewType] = useState('collection'); // 'collection', 'status', or 'types'

  // Format currency values for Y-Axis labels
  const formatYAxis = (tickItem) => {
    if (tickItem >= 100000) {
      return `₹${(tickItem / 100000).toFixed(1)}L`;
    }
    if (tickItem >= 1000) {
      return `₹${(tickItem / 1000).toFixed(0)}k`;
    }
    return `₹${tickItem}`;
  };

  if (loading) {
    return (
      <div className="glass-card chart-section loading-skeleton-container">
        <div className="chart-header">
          <div>
            <div className="skeleton-title pulsing" style={{ height: '20px', width: '220px', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
            <div className="skeleton-subtitle pulsing" style={{ height: '12px', width: '320px', borderRadius: '4px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="pulsing" style={{ height: '32px', width: '80px', borderRadius: '0.375rem' }}></div>
            <div className="pulsing" style={{ height: '32px', width: '80px', borderRadius: '0.375rem' }}></div>
            <div className="pulsing" style={{ height: '32px', width: '80px', borderRadius: '0.375rem' }}></div>
          </div>
        </div>
        <div className="chart-wrapper skeleton-chart-wrapper pulsing">
          <div className="skeleton-chart-bars">
            <div className="skeleton-bar" style={{ height: '40%' }}></div>
            <div className="skeleton-bar" style={{ height: '70%' }}></div>
            <div className="skeleton-bar" style={{ height: '50%' }}></div>
            <div className="skeleton-bar" style={{ height: '90%' }}></div>
            <div className="skeleton-bar" style={{ height: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card chart-section">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">
            {viewType === 'types' ? 'Property Type Distribution' : 'Inter-City Comparative Analytics'}
          </h2>
          <p className="chart-subtitle">
            {viewType === 'types' 
              ? 'Analyzing the spread of residential, commercial, and industrial properties'
              : 'Analyzing collection figures and registration statuses side-by-side'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setViewType('collection')}
            className="chip-btn"
            style={{
              borderColor: viewType === 'collection' ? 'var(--primary)' : 'var(--border-card)',
              backgroundColor: viewType === 'collection' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: viewType === 'collection' ? '#93c5fd' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <BarChart3 size={12} />
            Collection
          </button>
          <button
            onClick={() => setViewType('status')}
            className="chip-btn"
            style={{
              borderColor: viewType === 'status' ? 'var(--primary)' : 'var(--border-card)',
              backgroundColor: viewType === 'status' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: viewType === 'status' ? '#93c5fd' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <PieIcon size={12} />
            Status Split
          </button>
          <button
            onClick={() => setViewType('types')}
            className="chip-btn"
            style={{
              borderColor: viewType === 'types' ? 'var(--primary)' : 'var(--border-card)',
              backgroundColor: viewType === 'types' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: viewType === 'types' ? '#93c5fd' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <PieIcon size={12} />
            Property Types
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        {viewType === 'types' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart margin={{ bottom: 20 }}>
              <Tooltip formatter={(value) => [`${value} Properties`, 'Count']} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }}
              />
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {typeDistribution.map((entry, index) => {
                  const color = COLOR_MAP[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={citySummaries}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="city"
                stroke="var(--text-secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              {viewType === 'collection' ? (
                <>
                  <YAxis
                    stroke="var(--text-secondary)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }}
                  />
                  <Bar
                    name="Total Collection"
                    dataKey="totalCollection"
                    fill="url(#colorCollection)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  />
                  <defs>
                    <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </>
              ) : (
                <>
                  <YAxis
                    stroke="var(--text-secondary)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }}
                  />
                  <Bar
                    name="Approved"
                    dataKey="approved"
                    fill="#10b981"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    name="Rejected"
                    dataKey="rejected"
                    fill="#f43f5e"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    name="Pending"
                    dataKey="pending"
                    fill="#f59e0b"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={20}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

ComparisonChart.propTypes = {
  citySummaries: PropTypes.arrayOf(
    PropTypes.shape({
      city: PropTypes.string.isRequired,
      totalRegistered: PropTypes.number.isRequired,
      approved: PropTypes.number.isRequired,
      rejected: PropTypes.number.isRequired,
      pending: PropTypes.number.isRequired,
      totalCollection: PropTypes.number.isRequired
    })
  ).isRequired,
  typeDistribution: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ),
  loading: PropTypes.bool
};


