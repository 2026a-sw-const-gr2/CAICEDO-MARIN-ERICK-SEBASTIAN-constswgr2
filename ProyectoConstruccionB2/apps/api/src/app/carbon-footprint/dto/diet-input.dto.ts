import { ApiProperty } from '@nestjs/swagger';
import { DietInput, DietType } from '@proyecto-construccion-b2/shared';
import { IsEnum } from 'class-validator';

export class DietInputDto implements DietInput {
  @ApiProperty({
    enum: DietType,
    example: DietType.OMNIVORE_AVERAGE,
    description: 'Tipo de dieta seguida habitualmente.',
  })
  @IsEnum(DietType)
  type!: DietType;
}
