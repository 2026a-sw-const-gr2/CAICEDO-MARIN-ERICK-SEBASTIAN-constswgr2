import { ApiProperty } from '@nestjs/swagger';
import { CarbonFootprintInput } from '@proyecto-construccion-b2/shared';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DietInputDto } from './diet-input.dto';
import { HomeInputDto } from './home-input.dto';
import { TransportInputDto } from './transport-input.dto';

export class CarbonFootprintInputDto implements CarbonFootprintInput {
  @ApiProperty({ type: TransportInputDto })
  @ValidateNested()
  @Type(() => TransportInputDto)
  transport!: TransportInputDto;

  @ApiProperty({ type: HomeInputDto })
  @ValidateNested()
  @Type(() => HomeInputDto)
  home!: HomeInputDto;

  @ApiProperty({ type: DietInputDto })
  @ValidateNested()
  @Type(() => DietInputDto)
  diet!: DietInputDto;
}
