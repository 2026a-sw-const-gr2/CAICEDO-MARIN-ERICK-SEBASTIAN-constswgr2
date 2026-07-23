import { INPUT_RANGES } from './constants.js';
import {
  CarbonFootprintInput,
  DietInput,
  DietType,
  HomeInput,
  TransportInput,
  TransportMode,
  ValidationResult,
} from './types.js';

function ok(): ValidationResult {
  return { valid: true, errors: [] };
}

function fail(errors: string[]): ValidationResult {
  return { valid: false, errors };
}

function merge(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((r) => r.errors);
  return errors.length > 0 ? fail(errors) : ok();
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateRange(
  value: unknown,
  field: string,
  range: { min: number; max: number },
): ValidationResult {
  if (!isFiniteNumber(value)) {
    return fail([`${field} debe ser un número.`]);
  }
  if (value < range.min || value > range.max) {
    return fail([
      `${field} debe estar entre ${range.min} y ${range.max}.`,
    ]);
  }
  return ok();
}

/** Valida los datos de transporte: modo válido y kilómetros semanales dentro de rango. */
export function validateTransportInput(
  input: TransportInput | undefined | null,
): ValidationResult {
  if (!input) {
    return fail(['El transporte es obligatorio.']);
  }
  const errors: string[] = [];
  if (!Object.values(TransportMode).includes(input.mode)) {
    errors.push('El modo de transporte no es válido.');
  }
  const km = validateRange(
    input.kilometersPerWeek,
    'Los kilómetros por semana',
    INPUT_RANGES.kilometersPerWeek,
  );
  errors.push(...km.errors);
  return errors.length > 0 ? fail(errors) : ok();
}

/** Valida los datos del hogar: consumo eléctrico y de gas dentro de rango. */
export function validateHomeInput(
  input: HomeInput | undefined | null,
): ValidationResult {
  if (!input) {
    return fail(['El consumo del hogar es obligatorio.']);
  }
  return merge(
    validateRange(
      input.electricityKwhPerMonth,
      'El consumo eléctrico mensual',
      INPUT_RANGES.electricityKwhPerMonth,
    ),
    validateRange(
      input.gasM3PerMonth,
      'El consumo de gas mensual',
      INPUT_RANGES.gasM3PerMonth,
    ),
  );
}

/** Valida los datos de dieta: tipo dentro del catálogo soportado. */
export function validateDietInput(
  input: DietInput | undefined | null,
): ValidationResult {
  if (!input) {
    return fail(['La dieta es obligatoria.']);
  }
  if (!Object.values(DietType).includes(input.type)) {
    return fail(['El tipo de dieta no es válido.']);
  }
  return ok();
}

/**
 * Valida el payload completo enviado a las APIs v1 y v2. Se usa tanto en el
 * cliente (para bloquear peticiones incorrectas) como en el backend (defensa
 * en profundidad ante datos que no pasaron por el formulario).
 */
export function validateCarbonFootprintInput(
  input: CarbonFootprintInput | undefined | null,
): ValidationResult {
  if (!input) {
    return fail(['El payload de la huella de carbono es obligatorio.']);
  }
  return merge(
    validateTransportInput(input.transport),
    validateHomeInput(input.home),
    validateDietInput(input.diet),
  );
}
