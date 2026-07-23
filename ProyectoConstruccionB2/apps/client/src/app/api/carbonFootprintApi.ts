import {
  CarbonFootprintInput,
  FormattedCarbonFootprintResult,
  RawCarbonFootprintResult,
  isFormattedCarbonFootprintResult,
  isRawCarbonFootprintResult,
} from '@proyecto-construccion-b2/shared';

const API_URL = import.meta.env.VITE_API_URL;

export class CarbonFootprintApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = 'CarbonFootprintApiError';
    this.status = status;
    this.details = details;
  }
}

async function extractErrorDetails(response: Response): Promise<string[]> {
  try {
    const body: unknown = await response.json();
    const message = (body as { message?: unknown } | null)?.message;
    if (Array.isArray(message)) {
      return message.map(String);
    }
    if (typeof message === 'string') {
      return [message];
    }
  } catch {
    // La respuesta no traía JSON; se usa el mensaje genérico de abajo.
  }
  return [`Error inesperado del servidor (HTTP ${response.status}).`];
}

/**
 * Consume la API v1 (pública, sin autenticación) y devuelve el resultado
 * "crudo". El formateo para mostrarlo en pantalla lo hace el cliente con
 * `formatCarbonFootprintResult` de libs/shared.
 */
export async function fetchRawCarbonFootprint(
  input: CarbonFootprintInput,
): Promise<RawCarbonFootprintResult> {
  const response = await fetch(`${API_URL}/v1/carbon-footprint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new CarbonFootprintApiError(
      'No se pudo calcular la huella con la API v1.',
      response.status,
      await extractErrorDetails(response),
    );
  }

  const data: unknown = await response.json();
  if (!isRawCarbonFootprintResult(data)) {
    throw new CarbonFootprintApiError(
      'La API v1 devolvió una respuesta con una forma inesperada.',
      response.status,
    );
  }
  return data;
}

/**
 * Consume la API v2 (protegida por `x-api-key`) y devuelve el resultado ya
 * formateado por el servidor. Distingue explícitamente 401/403 para que la
 * UI pueda mostrar un mensaje claro sobre la API key.
 */
export async function fetchFormattedCarbonFootprint(
  input: CarbonFootprintInput,
  apiKey: string,
): Promise<FormattedCarbonFootprintResult> {
  const response = await fetch(`${API_URL}/v2/carbon-footprint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(input),
  });

  if (response.status === 401 || response.status === 403) {
    throw new CarbonFootprintApiError(
      'Acceso denegado a la API v2: revisa el header x-api-key.',
      response.status,
      await extractErrorDetails(response),
    );
  }

  if (!response.ok) {
    throw new CarbonFootprintApiError(
      'No se pudo calcular la huella con la API v2.',
      response.status,
      await extractErrorDetails(response),
    );
  }

  const data: unknown = await response.json();
  if (!isFormattedCarbonFootprintResult(data)) {
    throw new CarbonFootprintApiError(
      'La API v2 devolvió una respuesta con una forma inesperada.',
      response.status,
    );
  }
  return data;
}
