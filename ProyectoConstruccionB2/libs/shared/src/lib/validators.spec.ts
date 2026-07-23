import { describe, expect, it } from 'vitest';
import { DietType, TransportMode } from './types.js';
import {
  validateCarbonFootprintInput,
  validateDietInput,
  validateHomeInput,
  validateTransportInput,
} from './validators.js';

describe('validateTransportInput', () => {
  it('accepts a valid transport input', () => {
    const result = validateTransportInput({
      mode: TransportMode.BUS,
      kilometersPerWeek: 100,
    });
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('rejects negative kilometers', () => {
    const result = validateTransportInput({
      mode: TransportMode.BUS,
      kilometersPerWeek: -5,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects an unknown transport mode', () => {
    const result = validateTransportInput({
      mode: 'ROCKET' as TransportMode,
      kilometersPerWeek: 10,
    });
    expect(result.valid).toBe(false);
  });
});

describe('validateHomeInput', () => {
  it('rejects a value above the accepted range', () => {
    const result = validateHomeInput({
      electricityKwhPerMonth: 999999,
      gasM3PerMonth: 10,
    });
    expect(result.valid).toBe(false);
  });
});

describe('validateDietInput', () => {
  it('rejects a missing diet type', () => {
    const result = validateDietInput(null);
    expect(result.valid).toBe(false);
  });

  it('accepts a known diet type', () => {
    const result = validateDietInput({ type: DietType.VEGAN });
    expect(result.valid).toBe(true);
  });
});

describe('validateCarbonFootprintInput', () => {
  it('aggregates errors from all sections', () => {
    const result = validateCarbonFootprintInput({
      transport: { mode: TransportMode.CAR_GASOLINE, kilometersPerWeek: -1 },
      home: { electricityKwhPerMonth: -1, gasM3PerMonth: -1 },
      diet: { type: DietType.OMNIVORE_AVERAGE },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
