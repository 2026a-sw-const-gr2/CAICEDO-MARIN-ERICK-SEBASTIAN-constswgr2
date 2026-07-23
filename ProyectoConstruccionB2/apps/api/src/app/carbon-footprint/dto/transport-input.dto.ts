import { ApiProperty } from '@nestjs/swagger';
import { TransportInput, TransportMode } from '@proyecto-construccion-b2/shared';
import { IsEnum, IsNumber } from 'class-validator';

export class TransportInputDto implements TransportInput {
  @ApiProperty({
    enum: TransportMode,
    example: TransportMode.CAR_GASOLINE,
    description: 'Modo de transporte utilizado.',
  })
  @IsEnum(TransportMode)
  mode!: TransportMode;

  @ApiProperty({
    example: 120,
    minimum: 0,
    maximum: 5000,
    description: 'Kilómetros recorridos por semana con ese modo de transporte.',
  })
  @IsNumber()
  kilometersPerWeek!: number;
}
