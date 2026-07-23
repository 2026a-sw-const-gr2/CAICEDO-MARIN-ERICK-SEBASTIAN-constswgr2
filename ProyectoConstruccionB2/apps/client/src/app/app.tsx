import { useState } from 'react';
import {
  CarbonFootprintInput,
  FormattedCarbonFootprintResult,
  formatCarbonFootprintResult,
} from '@proyecto-construccion-b2/shared';
import styles from './app.module.css';
import {
  CarbonFootprintApiError,
  fetchFormattedCarbonFootprint,
  fetchRawCarbonFootprint,
} from './api/carbonFootprintApi';
import {
  CalculationSource,
  CarbonFootprintForm,
} from './components/CarbonFootprintForm';
import { ResultCard } from './components/ResultCard';

interface ResultState {
  source: CalculationSource;
  result: FormattedCarbonFootprintResult;
}

function toErrorMessages(error: unknown): string[] {
  if (error instanceof CarbonFootprintApiError) {
    return error.details.length > 0 ? error.details : [error.message];
  }
  if (error instanceof Error) {
    return [error.message];
  }
  return ['Ocurrió un error inesperado.'];
}

export function App() {
  const [result, setResult] = useState<ResultState | null>(null);
  const [loading, setLoading] = useState<CalculationSource | null>(null);
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const handleCalculateV1 = async (input: CarbonFootprintInput) => {
    setLoading('v1');
    setApiErrors([]);
    setResult(null);
    try {
      const raw = await fetchRawCarbonFootprint(input);
      // La API v1 devuelve datos crudos: el formateo ocurre aquí, en el cliente.
      setResult({ source: 'v1', result: formatCarbonFootprintResult(raw) });
    } catch (error) {
      setApiErrors(toErrorMessages(error));
    } finally {
      setLoading(null);
    }
  };

  const handleCalculateV2 = async (
    input: CarbonFootprintInput,
    apiKey: string,
  ) => {
    setLoading('v2');
    setApiErrors([]);
    setResult(null);
    try {
      const formatted = await fetchFormattedCarbonFootprint(input, apiKey);
      setResult({ source: 'v2', result: formatted });
    } catch (error) {
      setApiErrors(toErrorMessages(error));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Estimador de Huella de Carbono Personal</h1>
        <p>
          Calcula tu huella anual de CO2e a partir de tu transporte, el
          consumo de tu hogar y tu dieta.
        </p>
      </header>

      <CarbonFootprintForm
        loading={loading}
        onCalculateV1={handleCalculateV1}
        onCalculateV2={handleCalculateV2}
      />

      {apiErrors.length > 0 && (
        <div className={styles.errors} role="alert">
          <strong>No se pudo completar el cálculo:</strong>
          <ul>
            {apiErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {result && <ResultCard source={result.source} result={result.result} />}
    </div>
  );
}

export default App;
