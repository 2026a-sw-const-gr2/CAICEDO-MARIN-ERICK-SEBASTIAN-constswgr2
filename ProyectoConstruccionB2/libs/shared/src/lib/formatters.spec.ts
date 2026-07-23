import { describe, expect, it } from 'vitest';
import { FootprintCategory } from './types.js';
import {
  formatCarbonFootprintResult,
  formatKgCo2PerYear,
  getFootprintCategory,
  roundTo,
} from './formatters.js';

describe('roundTo', () => {
  it('rounds to two decimals by default', () => {
    expect(roundTo(1.23456)).toBe(1.23);
  });
});

describe('formatKgCo2PerYear', () => {
  it('appends the expected unit', () => {
    expect(formatKgCo2PerYear(1234.5)).toBe('1234.50 kg CO2e/año');
  });
});

describe('getFootprintCategory', () => {
  it('classifies low, medium and high footprints', () => {
    expect(getFootprintCategory(500)).toBe(FootprintCategory.LOW);
    expect(getFootprintCategory(4000)).toBe(FootprintCategory.MEDIUM);
    expect(getFootprintCategory(9000)).toBe(FootprintCategory.HIGH);
  });
});

describe('formatCarbonFootprintResult', () => {
  it('formats a raw breakdown into the v2 shape', () => {
    const formatted = formatCarbonFootprintResult({
      transportKgCo2ePerYear: 1000,
      homeKgCo2ePerYear: 500,
      dietKgCo2ePerYear: 800,
      totalKgCo2ePerYear: 2300,
    });
    expect(formatted.total.value).toBe(2300);
    expect(formatted.total.formatted).toContain('kg CO2e/año');
    expect(formatted.category).toBe(FootprintCategory.MEDIUM);
    expect(typeof formatted.generatedAt).toBe('string');
  });
});
