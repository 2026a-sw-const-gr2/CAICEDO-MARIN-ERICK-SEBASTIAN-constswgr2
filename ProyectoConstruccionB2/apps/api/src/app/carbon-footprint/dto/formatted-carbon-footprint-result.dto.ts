import { ApiProperty } from '@nestjs/swagger';
import {
  FootprintCategory,
  FormattedCarbonFootprintResult,
} from '@proyecto-construccion-b2/shared';
import { FormattedValueDto } from './formatted-value.dto';

/** Documenta la forma de la respuesta ya formateada de la API v2 en Swagger. */
export class FormattedCarbonFootprintResultDto
  implements FormattedCarbonFootprintResult
{
  @ApiProperty({ type: FormattedValueDto })
  transport!: FormattedValueDto;

  @ApiProperty({ type: FormattedValueDto })
  home!: FormattedValueDto;

  @ApiProperty({ type: FormattedValueDto })
  diet!: FormattedValueDto;

  @ApiProperty({ type: FormattedValueDto })
  total!: FormattedValueDto;

  @ApiProperty({ enum: FootprintCategory, example: FootprintCategory.MEDIUM })
  category!: FootprintCategory;

  @ApiProperty({ example: '2026-07-22T23:45:00.000Z' })
  generatedAt!: string;
}
