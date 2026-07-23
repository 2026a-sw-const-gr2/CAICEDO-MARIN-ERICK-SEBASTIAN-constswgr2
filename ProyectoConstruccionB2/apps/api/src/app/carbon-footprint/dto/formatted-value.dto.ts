import { ApiProperty } from '@nestjs/swagger';
import { FormattedValue } from '@proyecto-construccion-b2/shared';

export class FormattedValueDto implements FormattedValue {
  @ApiProperty({ example: 1198.08 })
  value!: number;

  @ApiProperty({ example: '1198.08 kg CO2e/año' })
  formatted!: string;
}
