/**
 * Modos de transporte soportados para el cálculo de huella de carbono.
 */
export enum TransportMode {
  CAR_GASOLINE = 'CAR_GASOLINE',
  CAR_DIESEL = 'CAR_DIESEL',
  CAR_ELECTRIC = 'CAR_ELECTRIC',
  MOTORCYCLE = 'MOTORCYCLE',
  BUS = 'BUS',
  TRAIN_SUBWAY = 'TRAIN_SUBWAY',
  BICYCLE_WALK = 'BICYCLE_WALK',
}

/**
 * Tipos de dieta soportados para el cálculo de huella de carbono.
 */
export enum DietType {
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
  PESCATARIAN = 'PESCATARIAN',
  OMNIVORE_AVERAGE = 'OMNIVORE_AVERAGE',
  OMNIVORE_HIGH_MEAT = 'OMNIVORE_HIGH_MEAT',
}

/** Categoría cualitativa de la huella total, usada por la UI para semaforizar el resultado. */
export enum FootprintCategory {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface TransportInput {
  mode: TransportMode;
  kilometersPerWeek: number;
}

export interface HomeInput {
  electricityKwhPerMonth: number;
  gasM3PerMonth: number;
}

export interface DietInput {
  type: DietType;
}

/** Payload que el cliente envía a las APIs v1 y v2. */
export interface CarbonFootprintInput {
  transport: TransportInput;
  home: HomeInput;
  diet: DietInput;
}

/** Desglose de la huella anual estimada, en kg de CO2 equivalente. */
export interface CarbonFootprintBreakdown {
  transportKgCo2ePerYear: number;
  homeKgCo2ePerYear: number;
  dietKgCo2ePerYear: number;
  totalKgCo2ePerYear: number;
}

/** Respuesta "cruda" de la API v1: solo números, sin formatear. */
export type RawCarbonFootprintResult = CarbonFootprintBreakdown;

/** Un valor numérico junto con su representación de texto ya formateada. */
export interface FormattedValue {
  value: number;
  formatted: string;
}

/** Respuesta procesada y formateada por el servidor en la API v2. */
export interface FormattedCarbonFootprintResult {
  transport: FormattedValue;
  home: FormattedValue;
  diet: FormattedValue;
  total: FormattedValue;
  category: FootprintCategory;
  generatedAt: string;
}

/** Resultado estándar de las funciones de validación de `libs/shared`. */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
