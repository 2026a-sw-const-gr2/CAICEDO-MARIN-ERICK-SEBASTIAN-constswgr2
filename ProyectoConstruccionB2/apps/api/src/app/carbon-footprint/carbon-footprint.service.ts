import { Injectable } from '@nestjs/common';
import {
  CarbonFootprintBreakdown,
  CarbonFootprintInput,
  DAYS_PER_YEAR,
  DIET_EMISSION_FACTORS_KG_PER_DAY,
  ELECTRICITY_EMISSION_FACTOR_KG_PER_KWH,
  GAS_EMISSION_FACTOR_KG_PER_M3,
  MONTHS_PER_YEAR,
  TRANSPORT_EMISSION_FACTORS,
  WEEKS_PER_YEAR,
} from '@proyecto-construccion-b2/shared';

/**
 * Calcula la huella de carbono anual estimada a partir del transporte, el
 * consumo del hogar y la dieta. Los factores de emisión viven en
 * libs/shared para que el mismo dato alimente validadores, formularios y
 * este cálculo.
 */
@Injectable()
export class CarbonFootprintService {
  calculate(input: CarbonFootprintInput): CarbonFootprintBreakdown {
    const transportKgCo2ePerYear =
      input.transport.kilometersPerWeek *
      TRANSPORT_EMISSION_FACTORS[input.transport.mode] *
      WEEKS_PER_YEAR;

    const homeKgCo2ePerYear =
      (input.home.electricityKwhPerMonth * ELECTRICITY_EMISSION_FACTOR_KG_PER_KWH +
        input.home.gasM3PerMonth * GAS_EMISSION_FACTOR_KG_PER_M3) *
      MONTHS_PER_YEAR;

    const dietKgCo2ePerYear =
      DIET_EMISSION_FACTORS_KG_PER_DAY[input.diet.type] * DAYS_PER_YEAR;

    const totalKgCo2ePerYear =
      transportKgCo2ePerYear + homeKgCo2ePerYear + dietKgCo2ePerYear;

    return {
      transportKgCo2ePerYear,
      homeKgCo2ePerYear,
      dietKgCo2ePerYear,
      totalKgCo2ePerYear,
    };
  }
}
