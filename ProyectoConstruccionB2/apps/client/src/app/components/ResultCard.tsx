import {
  FootprintCategory,
  FormattedCarbonFootprintResult,
  formatFootprintCategory,
} from '@proyecto-construccion-b2/shared';
import styles from '../app.module.css';
import { CalculationSource } from './CarbonFootprintForm';

interface ResultCardProps {
  source: CalculationSource;
  result: FormattedCarbonFootprintResult;
}

const CATEGORY_CLASS: Record<FootprintCategory, string> = {
  [FootprintCategory.LOW]: styles.badgeLow,
  [FootprintCategory.MEDIUM]: styles.badgeMedium,
  [FootprintCategory.HIGH]: styles.badgeHigh,
};

const SOURCE_LABEL: Record<CalculationSource, string> = {
  v1: 'API v1 (pública) — formateado en el cliente',
  v2: 'API v2 (segura) — formateado por el servidor',
};

export function ResultCard({ source, result }: ResultCardProps) {
  return (
    <section className={styles.resultCard}>
      <header className={styles.resultHeader}>
        <h2>Resultado</h2>
        <span className={`${styles.badge} ${CATEGORY_CLASS[result.category]}`}>
          Huella {formatFootprintCategory(result.category)}
        </span>
      </header>
      <p className={styles.resultSource}>{SOURCE_LABEL[source]}</p>

      <dl className={styles.resultGrid}>
        <div>
          <dt>Transporte</dt>
          <dd>{result.transport.formatted}</dd>
        </div>
        <div>
          <dt>Hogar</dt>
          <dd>{result.home.formatted}</dd>
        </div>
        <div>
          <dt>Dieta</dt>
          <dd>{result.diet.formatted}</dd>
        </div>
        <div className={styles.resultTotal}>
          <dt>Total anual</dt>
          <dd>{result.total.formatted}</dd>
        </div>
      </dl>

      <p className={styles.resultTimestamp}>
        Generado: {new Date(result.generatedAt).toLocaleString()}
      </p>
    </section>
  );
}
