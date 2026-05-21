import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePropertyData } from './usePropertyData';

describe('usePropertyData Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePropertyData());

    expect(result.current.selectedCity).toBe('All Cities');
    expect(result.current.cities).toHaveLength(10);
    expect(result.current.properties).toHaveLength(1000);
  });

  it('should calculate correct KPIs for All Cities', () => {
    const { result } = renderHook(() => usePropertyData());

    // Test overall count (1000 properties)
    expect(result.current.totalRegistered).toBe(1000);
    
    // Total registered should match approved + rejected + pending
    const sumStatuses = result.current.approved + result.current.rejected + result.current.pending;
    expect(sumStatuses).toBe(1000);
    
    // Total collection should be greater than 0
    expect(result.current.totalCollection).toBeGreaterThan(0);
  });

  it('should update properties and KPIs when city changes', () => {
    const { result } = renderHook(() => usePropertyData());

    // Switch to Delhi
    act(() => {
      result.current.setSelectedCity('Delhi');
    });

    expect(result.current.selectedCity).toBe('Delhi');
    
    // Properties list should only contain Delhi
    result.current.properties.forEach(p => {
      expect(p.tenant.toLowerCase()).toBe('delhi');
    });

    // Check that Delhi specific values are computed
    expect(result.current.totalRegistered).toBe(result.current.properties.length);
    const sumDelhiStatuses = result.current.approved + result.current.rejected + result.current.pending;
    expect(sumDelhiStatuses).toBe(result.current.properties.length);
  });

  it('should generate city summaries correctly', () => {
    const { result } = renderHook(() => usePropertyData());

    expect(result.current.citySummaries).toHaveLength(10);
    
    // Should be sorted by totalCollection descending
    for (let i = 0; i < result.current.citySummaries.length - 1; i++) {
      const currentCollection = result.current.citySummaries[i].totalCollection;
      const nextCollection = result.current.citySummaries[i + 1].totalCollection;
      expect(currentCollection).toBeGreaterThanOrEqual(nextCollection);
    }
  });
});
