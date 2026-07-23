import { DietType, FootprintCategory, TransportMode } from './types.js';

/**
 * Factores de emisión (kg CO2e por km) por modo de transporte.
 * Valores ilustrativos con fines académicos, inspirados en promedios
 * publicados por DEFRA/EPA para vehículos ligeros y transporte público.
 */
export const TRANSPORT_EMISSION_FACTORS: Record<TransportMode, number> = {
  [TransportMode.CAR_GASOLINE]: 0.192,
  [TransportMode.CAR_DIESEL]: 0.171,
  [TransportMode.CAR_ELECTRIC]: 0.053,
  [TransportMode.MOTORCYCLE]: 0.103,
  [TransportMode.BUS]: 0.105,
  [TransportMode.TRAIN_SUBWAY]: 0.041,
  [TransportMode.BICYCLE_WALK]: 0,
};

/** Factor de emisión de la red eléctrica, en kg CO2e por kWh consumido. */
export const ELECTRICITY_EMISSION_FACTOR_KG_PER_KWH = 0.233;

/** Factor de emisión del gas natural doméstico, en kg CO2e por m3 consumido. */
export const GAS_EMISSION_FACTOR_KG_PER_M3 = 2.03;

/**
 * Emisiones diarias promedio (kg CO2e/día) asociadas a cada tipo de dieta.
 * Valores ilustrativos con fines académicos, inspirados en estudios como
 * Poore & Nemecek (2018) sobre el impacto de la alimentación.
 */
export const DIET_EMISSION_FACTORS_KG_PER_DAY: Record<DietType, number> = {
  [DietType.VEGAN]: 1.5,
  [DietType.VEGETARIAN]: 1.7,
  [DietType.PESCATARIAN]: 2.3,
  [DietType.OMNIVORE_AVERAGE]: 3.3,
  [DietType.OMNIVORE_HIGH_MEAT]: 4.6,
};

export const DAYS_PER_YEAR = 365;
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;

/** Rangos aceptados para los formularios de entrada (usados por los validadores). */
export const INPUT_RANGES = {
  kilometersPerWeek: { min: 0, max: 5000 },
  electricityKwhPerMonth: { min: 0, max: 5000 },
  gasM3PerMonth: { min: 0, max: 2000 },
} as const;

/** Umbrales (kg CO2e/año) usados para clasificar la huella total. */
export const FOOTPRINT_CATEGORY_THRESHOLDS: Record<
  Exclude<FootprintCategory, FootprintCategory.HIGH>,
  number
> = {
  [FootprintCategory.LOW]: 2000,
  [FootprintCategory.MEDIUM]: 6000,
};
