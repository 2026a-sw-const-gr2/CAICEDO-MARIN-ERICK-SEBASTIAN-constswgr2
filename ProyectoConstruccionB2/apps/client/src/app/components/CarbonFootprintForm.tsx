import { FormEvent, useState } from 'react';
import {
  CarbonFootprintInput,
  DietType,
  TransportMode,
  validateCarbonFootprintInput,
} from '@proyecto-construccion-b2/shared';
import styles from '../app.module.css';

export type CalculationSource = 'v1' | 'v2';

interface CarbonFootprintFormProps {
  loading: CalculationSource | null;
  onCalculateV1: (input: CarbonFootprintInput) => void;
  onCalculateV2: (input: CarbonFootprintInput, apiKey: string) => void;
}

const TRANSPORT_LABELS: Record<TransportMode, string> = {
  [TransportMode.CAR_GASOLINE]: 'Auto a gasolina',
  [TransportMode.CAR_DIESEL]: 'Auto a diésel',
  [TransportMode.CAR_ELECTRIC]: 'Auto eléctrico',
  [TransportMode.MOTORCYCLE]: 'Motocicleta',
  [TransportMode.BUS]: 'Bus',
  [TransportMode.TRAIN_SUBWAY]: 'Tren / metro',
  [TransportMode.BICYCLE_WALK]: 'Bicicleta / caminando',
};

const DIET_LABELS: Record<DietType, string> = {
  [DietType.VEGAN]: 'Vegana',
  [DietType.VEGETARIAN]: 'Vegetariana',
  [DietType.PESCATARIAN]: 'Pescetariana',
  [DietType.OMNIVORE_AVERAGE]: 'Omnívora (promedio)',
  [DietType.OMNIVORE_HIGH_MEAT]: 'Omnívora (alto consumo de carne)',
};

export function CarbonFootprintForm({
  loading,
  onCalculateV1,
  onCalculateV2,
}: CarbonFootprintFormProps) {
  const [mode, setMode] = useState<TransportMode>(TransportMode.CAR_GASOLINE);
  const [kilometersPerWeek, setKilometersPerWeek] = useState('120');
  const [electricityKwhPerMonth, setElectricityKwhPerMonth] = useState('250');
  const [gasM3PerMonth, setGasM3PerMonth] = useState('15');
  const [dietType, setDietType] = useState<DietType>(DietType.OMNIVORE_AVERAGE);
  const [apiKey, setApiKey] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const buildInput = (): CarbonFootprintInput => ({
    transport: { mode, kilometersPerWeek: Number(kilometersPerWeek) },
    home: {
      electricityKwhPerMonth: Number(electricityKwhPerMonth),
      gasM3PerMonth: Number(gasM3PerMonth),
    },
    diet: { type: dietType },
  });

  const validateAndRun = (run: (input: CarbonFootprintInput) => void) => {
    const input = buildInput();
    const validation = validateCarbonFootprintInput(input);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
    run(input);
  };

  const handleSubmitV1 = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateAndRun(onCalculateV1);
  };

  const handleClickV2 = () => {
    validateAndRun((input) => onCalculateV2(input, apiKey));
  };

  const isLoading = loading !== null;

  return (
    <form className={styles.form} onSubmit={handleSubmitV1}>
      <fieldset className={styles.fieldset}>
        <legend>Transporte</legend>
        <label className={styles.field}>
          Modo de transporte
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as TransportMode)}
          >
            {Object.values(TransportMode).map((value) => (
              <option key={value} value={value}>
                {TRANSPORT_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Kilómetros por semana
          <input
            type="number"
            min={0}
            max={5000}
            value={kilometersPerWeek}
            onChange={(event) => setKilometersPerWeek(event.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Hogar</legend>
        <label className={styles.field}>
          Consumo eléctrico mensual (kWh)
          <input
            type="number"
            min={0}
            max={5000}
            value={electricityKwhPerMonth}
            onChange={(event) => setElectricityKwhPerMonth(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          Consumo de gas mensual (m3)
          <input
            type="number"
            min={0}
            max={2000}
            value={gasM3PerMonth}
            onChange={(event) => setGasM3PerMonth(event.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Dieta</legend>
        <label className={styles.field}>
          Tipo de dieta
          <select
            value={dietType}
            onChange={(event) => setDietType(event.target.value as DietType)}
          >
            {Object.values(DietType).map((value) => (
              <option key={value} value={value}>
                {DIET_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>API v2 (segura)</legend>
        <label className={styles.field}>
          API key (header x-api-key)
          <input
            type="text"
            placeholder="dev-secret-api-key"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </label>
      </fieldset>

      {validationErrors.length > 0 && (
        <div className={styles.errors} role="alert">
          <strong>Corrige los siguientes datos:</strong>
          <ul>
            {validationErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" disabled={isLoading}>
          {loading === 'v1' ? 'Calculando…' : 'Calcular con API v1 (pública)'}
        </button>
        <button type="button" disabled={isLoading} onClick={handleClickV2}>
          {loading === 'v2' ? 'Calculando…' : 'Calcular con API v2 (segura)'}
        </button>
      </div>
    </form>
  );
}
