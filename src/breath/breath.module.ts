import { Module } from '@nestjs/common';
import { BreathService } from './breath.service';
import { BreathController } from './breath.controller';

@Module({
  providers: [BreathService],
  controllers: [BreathController]
})
export class BreathModule {}
