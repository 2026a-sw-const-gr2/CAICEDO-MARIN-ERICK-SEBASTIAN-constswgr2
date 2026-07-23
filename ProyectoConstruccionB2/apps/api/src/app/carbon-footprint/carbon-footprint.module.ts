import { Module } from '@nestjs/common';
import { CarbonFootprintController } from './carbon-footprint.controller';
import { CarbonFootprintService } from './carbon-footprint.service';

@Module({
  controllers: [CarbonFootprintController],
  providers: [CarbonFootprintService],
})
export class CarbonFootprintModule {}
