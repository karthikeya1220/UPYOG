import { useState, useMemo } from 'react';
import rawPropertiesData from '../data/properties.json';

/**
 * Custom hook to manage property data filtering, calculations, and aggregations.
 * Provides live calculated KPIs and formatted datasets for Recharts.
 */
export function usePropertyData() {
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Normalize data and handle potential missing values
  const allProperties = useMemo(() => {
    return rawPropertiesData.map(p => ({
      ...p,
      tenant: p.tenant ? p.tenant.trim() : 'Unknown',
      collection_inr: parseFloat(p.collection_inr) || 0,
      annual_tax_inr: parseFloat(p.annual_tax_inr) || 0,
      area_sqft: parseInt(p.area_sqft, 10) || 0,
      floor_count: parseInt(p.floor_count, 10) || 0,
    }));
  }, []);

  // Retrieve unique list of cities (tenants)
  const cities = useMemo(() => {
    const uniqueCities = new Set(allProperties.map(p => p.tenant));
    return Array.from(uniqueCities).sort();
  }, [allProperties]);

  // Filter properties by selected city
  const filteredProperties = useMemo(() => {
    if (selectedCity === 'All Cities') {
      return allProperties;
    }
    return allProperties.filter(
      p => p.tenant.toLowerCase() === selectedCity.toLowerCase()
    );
  }, [allProperties, selectedCity]);

  // Calculate live KPIs based on filtered dataset
  const kpis = useMemo(() => {
    let totalRegistered = filteredProperties.length;
    let approved = 0;
    let rejected = 0;
    let pending = 0;
    let totalCollection = 0;

    filteredProperties.forEach(p => {
      if (p.status === 'Approved') {
        approved++;
        totalCollection += p.collection_inr;
      } else if (p.status === 'Rejected') {
        rejected++;
      } else if (p.status === 'Pending') {
        pending++;
      }
    });

    return {
      totalRegistered,
      approved,
      rejected,
      pending,
      totalCollection,
    };
  }, [filteredProperties]);

  // Generate aggregate metrics for each city (used by comparison charts)
  const citySummaries = useMemo(() => {
    const summaryMap = {};

    allProperties.forEach(p => {
      const city = p.tenant;
      if (!summaryMap[city]) {
        summaryMap[city] = {
          city,
          totalRegistered: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          totalCollection: 0,
        };
      }

      summaryMap[city].totalRegistered++;
      if (p.status === 'Approved') {
        summaryMap[city].approved++;
        summaryMap[city].totalCollection += p.collection_inr;
      } else if (p.status === 'Rejected') {
        summaryMap[city].rejected++;
      } else if (p.status === 'Pending') {
        summaryMap[city].pending++;
      }
    });

    return Object.values(summaryMap).sort((a, b) => b.totalCollection - a.totalCollection);
  }, [allProperties]);

  return {
    cities,
    selectedCity,
    setSelectedCity,
    properties: filteredProperties,
    citySummaries,
    ...kpis,
  };
}
