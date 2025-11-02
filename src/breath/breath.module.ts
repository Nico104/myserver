import { Module } from '@nestjs/common';
import { BreathService } from './breath.service';
import { BreathController } from './breath.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BreathController],
  providers: [BreathService, PrismaService],
})
export class BreathModule {}
