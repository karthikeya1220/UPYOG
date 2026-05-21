import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, PieChart } from 'lucide-react';

/**
 * Recharts component showing data comparisons across all cities.
 * Includes a toggle to switch between total tax collection and property status distribution.
 */
export function ComparisonChart({ citySummaries }) {
  const [viewType, setViewType] = useState('collection'); // 'collection' or 'status'

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

  // Custom interactive tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-city">{label}</p>
          {payload.map((item, idx) => {
            const val = item.value;
            const formattedVal =
              item.name === 'Total Collection'
                ? new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(val)
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

  return (
    <div className="glass-card chart-section">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">Inter-City Comparative Analytics</h2>
          <p className="chart-subtitle">Analyzing collection figures and registration statuses side-by-side</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            <PieChart size={12} />
            Status Split
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
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
                  wrapperStyle={{ fontSize: '11px' }}
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
      </div>
    </div>
  );
}
