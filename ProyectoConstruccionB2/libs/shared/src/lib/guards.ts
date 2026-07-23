import { FootprintCategory } from './types.js';
import type {
  FormattedCarbonFootprintResult,
  FormattedValue,
  RawCarbonFootprintResult,
} from './types.js';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isFormattedValue(value: unknown): value is FormattedValue {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return isFiniteNumber(candidate['value']) && typeof candidate['formatted'] === 'string';
}

/** Type guard estructural para la respuesta "cruda" de la API v1. */
export function isRawCarbonFootprintResult(
  value: unknown,
): value is RawCarbonFootprintResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isFiniteNumber(candidate['transportKgCo2ePerYear']) &&
    isFiniteNumber(candidate['homeKgCo2ePerYear']) &&
    isFiniteNumber(candidate['dietKgCo2ePerYear']) &&
    isFiniteNumber(candidate['totalKgCo2ePerYear'])
  );
}

/** Type guard estructural para la respuesta formateada de la API v2. */
export function isFormattedCarbonFootprintResult(
  value: unknown,
): value is FormattedCarbonFootprintResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    isFormattedValue(candidate['transport']) &&
    isFormattedValue(candidate['home']) &&
    isFormattedValue(candidate['diet']) &&
    isFormattedValue(candidate['total']) &&
    typeof candidate['category'] === 'string' &&
    Object.values(FootprintCategory).includes(
      candidate['category'] as FootprintCategory,
    ) &&
    typeof candidate['generatedAt'] === 'string'
  );
}
