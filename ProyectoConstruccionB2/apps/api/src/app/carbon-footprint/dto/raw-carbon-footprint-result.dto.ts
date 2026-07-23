import { ApiProperty } from '@nestjs/swagger';
import { RawCarbonFootprintResult } from '@proyecto-construccion-b2/shared';

/** Documenta la forma de la respuesta "cruda" de la API v1 en Swagger. */
export class RawCarbonFootprintResultDto implements RawCarbonFootprintResult {
  @ApiProperty({ example: 1198.08 })
  transportKgCo2ePerYear!: number;

  @ApiProperty({ example: 962.28 })
  homeKgCo2ePerYear!: number;

  @ApiProperty({ example: 1204.5 })
  dietKgCo2ePerYear!: number;

  @ApiProperty({ example: 3364.86 })
  totalKgCo2ePerYear!: number;
}
