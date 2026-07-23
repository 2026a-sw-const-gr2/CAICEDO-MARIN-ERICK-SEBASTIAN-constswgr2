import { FOOTPRINT_CATEGORY_THRESHOLDS } from './constants.js';
import {
  CarbonFootprintBreakdown,
  FootprintCategory,
  FormattedCarbonFootprintResult,
  FormattedValue,
} from './types.js';

/** Redondea un número a la cantidad de decimales indicada (por defecto 2). */
export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Formatea un valor en kg de CO2 equivalente, ej. "123.46 kg CO2e". */
export function formatKgCo2(value: number, decimals = 2): string {
  return `${roundTo(value, decimals).toFixed(decimals)} kg CO2e`;
}

/** Formatea un valor anual en kg de CO2 equivalente, ej. "1234.56 kg CO2e/año". */
export function formatKgCo2PerYear(value: number, decimals = 2): string {
  return `${roundTo(value, decimals).toFixed(decimals)} kg CO2e/año`;
}

/** Envuelve un número crudo junto con su representación formateada. */
export function toFormattedValue(value: number, decimals = 2): FormattedValue {
  return { value: roundTo(value, decimals), formatted: formatKgCo2PerYear(value, decimals) };
}

/** Clasifica la huella total anual en Baja, Media o Alta según los umbrales definidos. */
export function getFootprintCategory(
  totalKgCo2ePerYear: number,
): FootprintCategory {
  if (totalKgCo2ePerYear <= FOOTPRINT_CATEGORY_THRESHOLDS[FootprintCategory.LOW]) {
    return FootprintCategory.LOW;
  }
  if (
    totalKgCo2ePerYear <= FOOTPRINT_CATEGORY_THRESHOLDS[FootprintCategory.MEDIUM]
  ) {
    return FootprintCategory.MEDIUM;
  }
  return FootprintCategory.HIGH;
}

/** Etiqueta legible en español para una categoría de huella. */
export function formatFootprintCategory(category: FootprintCategory): string {
  switch (category) {
    case FootprintCategory.LOW:
      return 'Baja';
    case FootprintCategory.MEDIUM:
      return 'Media';
    case FootprintCategory.HIGH:
      return 'Alta';
  }
}

/**
 * Transforma un resultado "crudo" (API v1) en la misma estructura formateada
 * que produce el servidor en la API v2. El cliente la usa para formatear
 * localmente la respuesta de v1; el backend la usa para construir v2.
 */
export function formatCarbonFootprintResult(
  breakdown: CarbonFootprintBreakdown,
  generatedAt: string = new Date().toISOString(),
): FormattedCarbonFootprintResult {
  return {
    transport: toFormattedValue(breakdown.transportKgCo2ePerYear),
    home: toFormattedValue(breakdown.homeKgCo2ePerYear),
    diet: toFormattedValue(breakdown.dietKgCo2ePerYear),
    total: toFormattedValue(breakdown.totalKgCo2ePerYear),
    category: getFootprintCategory(breakdown.totalKgCo2ePerYear),
    generatedAt,
  };
}
