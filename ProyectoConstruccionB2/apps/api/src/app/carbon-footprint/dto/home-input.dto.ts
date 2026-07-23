import { ApiProperty } from '@nestjs/swagger';
import { HomeInput } from '@proyecto-construccion-b2/shared';
import { IsNumber } from 'class-validator';

export class HomeInputDto implements HomeInput {
  @ApiProperty({
    example: 250,
    minimum: 0,
    maximum: 5000,
    description: 'Consumo eléctrico mensual del hogar, en kWh.',
  })
  @IsNumber()
  electricityKwhPerMonth!: number;

  @ApiProperty({
    example: 15,
    minimum: 0,
    maximum: 2000,
    description: 'Consumo de gas mensual del hogar, en m3.',
  })
  @IsNumber()
  gasM3PerMonth!: number;
}
