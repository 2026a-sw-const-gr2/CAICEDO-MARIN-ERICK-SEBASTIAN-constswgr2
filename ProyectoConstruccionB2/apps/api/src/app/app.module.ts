import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarbonFootprintModule } from './carbon-footprint/carbon-footprint.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CarbonFootprintModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
